import { loadMockState, saveMockState } from '@/data/mock';

// Vite production build maps /api relative to the domain
const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8000/api/index.php' // local development server if running
  : '/api/index.php'; // production hosting

let apiAvailable = false;
let checkedAvailability = false;

// Check if the PHP API server is available
export async function checkApiAvailability(): Promise<boolean> {
  if (checkedAvailability) return apiAvailable;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const res = await fetch(`${API_BASE}?action=status`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      apiAvailable = true;
      
      // If the backend database is brand new and not initialized, push local mock data to seed it
      if (data && data.initialized === false) {
        console.log("Database is not initialized. Syncing initial mock data to server...");
        const cleanState = loadMockState();
        await fetch(`${API_BASE}?action=init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanState)
        });
      }
    }
  } catch (e) {
    console.warn("API server not detected. Falling back to local storage.", e);
    apiAvailable = false;
  }
  checkedAvailability = true;
  return apiAvailable;
}

// 1. Fetch entire dashboard state
export async function getDashboardData() {
  const isAvailable = await checkApiAvailability();
  if (isAvailable) {
    try {
      const res = await fetch(`${API_BASE}?action=get_data`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("API get_data failed. Reading from local storage instead.", e);
    }
  }
  return loadMockState();
}

// 2. Authentication API wrappers
export async function loginApi(email: string, password: string) {
  const isAvailable = await checkApiAvailability();
  if (isAvailable) {
    try {
      const res = await fetch(`${API_BASE}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data; // { success: true, user: User, token: string }
    } catch (e: any) {
      if (e.message && e.message.includes('Failed to fetch')) {
        // network issue, fallback to localStorage
      } else {
        throw e;
      }
    }
  }

  // Local Storage Fallback
  const mockState = loadMockState();
  const user = mockState.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    if (user.password && user.password !== password) {
      throw new Error('Mật khẩu không chính xác.');
    }
    if (user.status && user.status !== 'ACTIVE') {
      throw new Error('Tài khoản của bạn đã bị khóa hoặc chặn bởi quản trị viên.');
    }
    mockState.user = user;
    saveMockState(mockState);
    return {
      success: true,
      user,
      token: `mock-jwt-${user.role.toLowerCase()}-token`
    };
  } else {
    throw new Error('Không tìm thấy tài khoản email này. Vui lòng đăng ký.');
  }
}

export async function registerApi(payload: { name: string; email: string; company: string; password?: string }) {
  const isAvailable = await checkApiAvailability();
  if (isAvailable) {
    try {
      const res = await fetch(`${API_BASE}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (e: any) {
      if (e.message && e.message.includes('Failed to fetch')) {
        // network issue, fallback to localStorage
      } else {
        throw e;
      }
    }
  }

  // Local Storage Fallback
  const mockState = loadMockState();
  const exists = mockState.users.some(u => u.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) {
    throw new Error('Email này đã được đăng ký trong hệ thống.');
  }
  const newUser = {
    id: `u-${Math.floor(1000 + Math.random() * 9000)}`,
    name: payload.name,
    email: payload.email,
    company: payload.company,
    role: 'CLIENT' as const,
    avatar: payload.name.trim().charAt(0).toUpperCase() || '?',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    password: payload.password || 'client123',
  };
  mockState.users.push(newUser);
  saveMockState(mockState);
  return { success: true, user: newUser, token: 'mock-jwt-client-token' };
}

// Helper to make API post requests in background for sync
async function apiPost(actionName: string, bodyData: any) {
  const isAvailable = await checkApiAvailability();
  if (!isAvailable) return null;
  try {
    const res = await fetch(`${API_BASE}?action=${actionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(`API action ${actionName} failed`, e);
  }
  return null;
}

// 3. Mutator API endpoints (called by Redux middleware for synchronization)
export async function addTicketApi(ticket: any) {
  return apiPost('add_ticket', ticket);
}

export async function addTicketMessageApi(payload: { ticketId: string; message: string; sender: string; senderName: string }) {
  return apiPost('add_ticket_message', payload);
}

export async function updateTicketStatusApi(ticketId: string, status: string) {
  return apiPost('update_ticket_status', { ticketId, status });
}

export async function addOrderApi(order: any) {
  return apiPost('add_order', order);
}

export async function updateOrderStatusApi(orderId: string, status: string) {
  return apiPost('update_order_status', { orderId, status });
}

export async function addProjectApi(project: any) {
  return apiPost('add_project', project);
}

export async function updateProjectStatusApi(projectId: string, status: string, progress?: number, milestones?: any) {
  return apiPost('update_project_status', { projectId, status, progress, milestones });
}

export async function addQuotationApi(quotation: any) {
  return apiPost('add_quotation', quotation);
}

export async function updateQuotationStatusApi(quotationId: string, status: string) {
  return apiPost('update_quotation_status', { quotationId, status });
}

export async function addProductApi(product: any) {
  return apiPost('add_product', product);
}

export async function updateProductApi(product: any) {
  return apiPost('update_product', product);
}

export async function deleteProductApi(productId: string) {
  return apiPost('delete_product', { productId });
}

export async function updateProfileApi(userId: string, profileData: any) {
  return apiPost('update_profile', { userId, ...profileData });
}

export async function updateUserStatusApi(userId: string, status: string) {
  return apiPost('update_user_status', { userId, status });
}

export async function readNotificationsApi() {
  return apiPost('read_notifications', {});
}
