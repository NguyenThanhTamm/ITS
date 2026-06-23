import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Ticket, Quotation, Order, SystemNotification, ProjectStatus, OrderStatus, TicketStatus, User, UserRole } from '@/types';
import { loadMockState, saveMockState } from '@/data/mock';

interface DashboardState {
  projects: Project[];
  tickets: Ticket[];
  quotations: Quotation[];
  orders: Order[];
  notifications: SystemNotification[];
  users: User[];
}

const saved = loadMockState();

const initialState: DashboardState = {
  projects: saved.projects,
  tickets: saved.tickets,
  quotations: saved.quotations,
  orders: saved.orders,
  notifications: saved.notifications,
  users: saved.users || [],
};

const syncWithStorage = (state: DashboardState) => {
  const current = loadMockState();
  saveMockState({
    ...current,
    projects: state.projects,
    tickets: state.tickets,
    quotations: state.quotations,
    orders: state.orders,
    notifications: state.notifications,
    users: state.users,
  });
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addTicket(state, action: PayloadAction<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'> & { clientName?: string; clientId?: string }>) {
      const { clientName, clientId, ...ticketData } = action.payload;
      const newTicket: Ticket = {
        ...ticketData,
        status: 'OPEN',
        id: `t-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientId: clientId || 'u-client',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'CLIENT',
            senderName: clientName || 'Khách hàng',
            message: ticketData.description,
            timestamp: new Date().toISOString(),
          }
        ]
      };
      state.tickets.unshift(newTicket);
      
      // Auto notification
      state.notifications.unshift({
        id: `n-${Date.now()}`,
        title: 'Yêu cầu Hỗ trợ mới được tạo',
        message: `Yêu cầu hỗ trợ ${newTicket.id} "${newTicket.subject}" đã được gửi thành công.`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'TICKET'
      });

      syncWithStorage(state);
    },
    addTicketMessage(state, action: PayloadAction<{ ticketId: string; message: string; sender: 'CLIENT' | 'SUPPORT'; senderName: string }>) {
      const { ticketId, message, sender, senderName } = action.payload;
      const ticket = state.tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.messages.push({
          id: `msg-${Date.now()}`,
          sender,
          senderName,
          message,
          timestamp: new Date().toISOString()
        });
        ticket.updatedAt = new Date().toISOString();
        if (sender === 'CLIENT') {
          ticket.status = 'OPEN';
        } else {
          ticket.status = 'PENDING';
        }
        syncWithStorage(state);
      }
    },
    updateTicketStatus(state, action: PayloadAction<{ ticketId: string; status: TicketStatus }>) {
      const { ticketId, status } = action.payload;
      const ticket = state.tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
        syncWithStorage(state);
      }
    },
    approveQuotation(state, action: PayloadAction<string>) {
      const quote = state.quotations.find(q => q.id === action.payload);
      if (quote) {
        quote.status = 'APPROVED';
        
        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: 'Báo giá đã được phê duyệt',
          message: `Bạn đã duyệt báo giá "${quote.title}". Đang tiến hành tạo dự án tự động.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'QUOTATION'
        });

        // Add mock project automatically
        const newProjId = `p-${Math.floor(100 + Math.random() * 900)}`;
        state.projects.unshift({
          id: newProjId,
          name: quote.title.replace(' Đề xuất ', ' ').replace(' Báo giá ', ' '),
          description: `Phương án triển khai dịch vụ được khởi tạo tự động từ báo giá đã duyệt ${quote.id}. Kỹ thuật viên sẽ liên hệ khảo sát và kickoff.`,
          status: 'PLANNING',
          progress: 10,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          milestones: [
            { id: `m-${Date.now()}-1`, title: 'Khảo sát hiện trạng & Thống nhất phương án điều phối', completed: false, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            { id: `m-${Date.now()}-2`, title: 'Bàn giao thiết bị phần cứng & Vật tư kết nối', completed: false, dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            { id: `m-${Date.now()}-3`, title: 'Cấu hình kỹ thuật mạng chuyên sâu & Kiểm thử bảo mật', completed: false, dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            { id: `m-${Date.now()}-4`, title: 'Nghiệm thu đo test thực tế & Ký biên bản bàn giao', completed: false, dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          ],
          manager: {
            name: 'Nguyễn Thanh Tâm',
            email: 'admin@tamnguyen.dev',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
          },
          clientId: quote.clientId || 'u-client'
        });

        syncWithStorage(state);
      }
    },
    declineQuotation(state, action: PayloadAction<string>) {
      const quote = state.quotations.find(q => q.id === action.payload);
      if (quote) {
        quote.status = 'DECLINED';
        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: 'Báo giá bị từ chối',
          message: `Báo giá "${quote.title}" đã được đánh dấu từ chối duyệt.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'QUOTATION'
        });
        syncWithStorage(state);
      }
    },
    addQuotation(state, action: PayloadAction<{ title: string; cost: number; details: string; clientId?: string }>) {
      const { title, cost, details, clientId } = action.payload;
      const newQuote: Quotation = {
        id: `q-${Math.floor(100 + Math.random() * 900)}`,
        title,
        status: 'PENDING',
        items: [
          { id: `qi-${Date.now()}-1`, description: 'Phí dịch vụ hạ tầng & giải pháp theo dự toán', quantity: 1, unitPrice: cost, total: cost }
        ],
        subtotal: cost,
        tax: Math.round(cost * 0.1),
        total: Math.round(cost * 1.1),
        notes: details,
        createdAt: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        clientId: clientId || 'u-client'
      };
      state.quotations.unshift(newQuote);
      
      state.notifications.unshift({
        id: `n-${Date.now()}`,
        title: 'Yêu cầu Báo giá mới',
        message: `Yêu cầu báo giá "${title}" với chi phí ước tính $${cost.toLocaleString()}/tháng đã được gửi đi thành công.`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'QUOTATION'
      });
      syncWithStorage(state);
    },
    addOrder(state, action: PayloadAction<{ itemName: string; price: number; quantity?: number; clientId?: string }>) {
      const { itemName, price, quantity, clientId } = action.payload;
      const qty = quantity || 1;
      const totalPrice = price * qty;
      const newOrder: Order = {
        id: `ord-${Math.floor(100 + Math.random() * 900)}`,
        itemName,
        price: totalPrice,
        quantity: qty,
        status: 'PROCESSING',
        purchaseDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timeline: [
          { label: 'Xác nhận đơn hàng', timestamp: new Date().toISOString(), description: 'Đơn hàng mới đã được tiếp nhận thành công trên hệ thống và chuyển cho Admin điều phối.', completed: true },
          { label: 'Cấu hình thiết bị', timestamp: '', description: 'Chuẩn bị bản quyền và nạp cấu hình bảo mật trước khi đóng gói gửi đi.', completed: false },
          { label: 'Đang vận chuyển', timestamp: '', description: 'Đơn hàng đang được đối tác vận chuyển giao nhận.', completed: false },
          { label: 'Đã nhận & Kích hoạt', timestamp: '', description: 'Khách hàng nhận thiết bị/bản quyền và tiến hành tích hợp vận hành.', completed: false }
        ],
        clientId: clientId || 'u-client'
      };
      state.orders.unshift(newOrder);
      
      state.notifications.unshift({
        id: `n-${Date.now()}`,
        title: 'Đơn hàng mới đã được khởi tạo',
        message: `Đơn hàng "${itemName}" (Số lượng: ${qty}) trị giá $${totalPrice.toLocaleString()} đã gửi đi thành công và đang chờ Admin xử lý.`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'ORDER'
      });
      syncWithStorage(state);
    },
    updateOrder(state, action: PayloadAction<{ orderId: string; status: OrderStatus; trackingNumber?: string; timelineLabel?: string; timelineDesc?: string }>) {
      const { orderId, status, trackingNumber, timelineLabel, timelineDesc } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        if (trackingNumber !== undefined) {
          order.trackingNumber = trackingNumber;
        }
        
        // Push a custom step if provided
        if (timelineLabel && timelineDesc) {
          const existingStep = order.timeline.find(t => t.label.toLowerCase() === timelineLabel.toLowerCase());
          if (existingStep) {
            existingStep.completed = true;
            existingStep.timestamp = new Date().toISOString();
            existingStep.description = timelineDesc;
          } else {
            order.timeline.push({
              label: timelineLabel,
              timestamp: new Date().toISOString(),
              description: timelineDesc,
              completed: true
            });
          }
        } else {
          // Automatic transitions based on status
          if (status === 'SHIPPED') {
            const step1 = order.timeline.find(t => t.label.includes('Cấu hình'));
            if (step1 && !step1.completed) {
              step1.completed = true;
              step1.timestamp = new Date().toISOString();
            }
            const step2 = order.timeline.find(t => t.label.includes('vận chuyển') || t.label.includes('vận chuyển'));
            if (step2) {
              step2.completed = true;
              step2.timestamp = new Date().toISOString();
              if (trackingNumber) {
                step2.description = `Hàng đã được giao cho đơn vị vận chuyển. Mã vận đơn: ${trackingNumber}`;
              }
            }
          } else if (status === 'DELIVERED') {
            order.timeline.forEach(t => {
              t.completed = true;
              if (!t.timestamp) t.timestamp = new Date().toISOString();
            });
          }
        }

        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: 'Đơn hàng được cập nhật',
          message: `Đơn hàng ${order.id} được Admin cập nhật trạng thái: ${status}.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'ORDER'
        });
        syncWithStorage(state);
      }
    },
    toggleProjectMilestone(state, action: PayloadAction<{ projectId: string; milestoneId: string }>) {
      const { projectId, milestoneId } = action.payload;
      const proj = state.projects.find(p => p.id === projectId);
      if (proj) {
        const milestone = proj.milestones.find(m => m.id === milestoneId);
        if (milestone) {
          milestone.completed = !milestone.completed;
          const completedCount = proj.milestones.filter(m => m.completed).length;
          proj.progress = Math.round((completedCount / proj.milestones.length) * 100);
          
          if (proj.progress === 100) {
            proj.status = 'COMPLETED';
          } else if (proj.progress > 0) {
            proj.status = 'IN_PROGRESS';
          } else {
            proj.status = 'PLANNING';
          }
          
          state.notifications.unshift({
            id: `n-${Date.now()}`,
            title: 'Tiến độ dự án thay đổi',
            message: `Dự án "${proj.name}" được cập nhật tiến độ lên ${proj.progress}%.`,
            read: false,
            createdAt: new Date().toISOString(),
            type: 'PROJECT'
          });
          syncWithStorage(state);
        }
      }
    },
    updateProjectStatus(state, action: PayloadAction<{ projectId: string; status: ProjectStatus }>) {
      const { projectId, status } = action.payload;
      const proj = state.projects.find(p => p.id === projectId);
      if (proj) {
        proj.status = status;
        if (status === 'COMPLETED') {
          proj.progress = 100;
          proj.milestones.forEach(m => { m.completed = true; });
        }
        syncWithStorage(state);
      }
    },
    updateMilestoneDueDate(state, action: PayloadAction<{ projectId: string; milestoneId: string; dueDate: string }>) {
      const { projectId, milestoneId, dueDate } = action.payload;
      const proj = state.projects.find(p => p.id === projectId);
      if (proj) {
        const milestone = proj.milestones.find(m => m.id === milestoneId);
        if (milestone) {
          milestone.dueDate = dueDate;
          syncWithStorage(state);
        }
      }
    },
    updateProjectManager(state, action: PayloadAction<{ projectId: string; managerId: string }>) {
      const { projectId, managerId } = action.payload;
      const proj = state.projects.find(p => p.id === projectId);
      const staffUser = state.users.find(u => u.id === managerId);
      if (proj && staffUser) {
        proj.managerId = managerId;
        proj.manager = {
          name: staffUser.name,
          email: staffUser.email,
          avatar: staffUser.avatar,
        };
        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: 'Phân công kỹ thuật viên',
          message: `Kỹ thuật viên ${staffUser.name} được phân công phụ trách dự án "${proj.name}".`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'PROJECT'
        });
        syncWithStorage(state);
      }
    },
    addUser(state, action: PayloadAction<User>) {
      const exists = state.users.some(u => u.id === action.payload.id);
      if (!exists) {
        state.users.push(action.payload);
        syncWithStorage(state);
      }
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(u => u.id !== action.payload);
      state.notifications.unshift({
        id: `n-${Date.now()}`,
        title: 'Xóa tài khoản thành viên',
        message: `Đã xóa tài khoản ID ${action.payload} khỏi hệ thống.`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'INFO'
      });
      syncWithStorage(state);
    },
    updateUserStatus(state, action: PayloadAction<{ userId: string; status: 'ACTIVE' | 'BLOCKED_7_DAYS' | 'LOCKED'; blockedUntil?: string }>) {
      const { userId, status, blockedUntil } = action.payload;
      const user = state.users.find(u => u.id === userId);
      if (user) {
        user.status = status;
        if (blockedUntil) {
          user.blockedUntil = blockedUntil;
        } else {
          delete user.blockedUntil;
        }
        
        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: `Cập nhật trạng thái thành viên`,
          message: `Tài khoản ${user.name} (${user.email}) được Admin chuyển trạng thái thành: ${status === 'ACTIVE' ? 'Kích hoạt' : status === 'BLOCKED_7_DAYS' ? 'Khóa 7 ngày' : 'Khóa vĩnh viễn'}.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'INFO'
        });
        syncWithStorage(state);
      }
    },
    updateUserRole(state, action: PayloadAction<{ userId: string; role: UserRole }>) {
      const { userId, role } = action.payload;
      const user = state.users.find(u => u.id === userId);
      if (user) {
        user.role = role;
        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: `Cập nhật quyền hạn thành viên`,
          message: `Tài khoản ${user.name} được Admin cấp quyền mới: ${role}.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'INFO'
        });
        syncWithStorage(state);
      }
    },
    changeUserPassword(state, action: PayloadAction<{ userId: string; newPassword: string }>) {
      const { userId, newPassword } = action.payload;
      const user = state.users.find(u => u.id === userId);
      if (user) {
        user.password = newPassword;
        state.notifications.unshift({
          id: `n-${Date.now()}`,
          title: `Cập nhật mật khẩu thành viên`,
          message: `Mật khẩu của tài khoản ${user.name} (${user.email}) đã được cập nhật bởi Admin.`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'INFO'
        });
        syncWithStorage(state);
      }
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        syncWithStorage(state);
      }
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach(n => { n.read = true; });
      syncWithStorage(state);
    },
    clearNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      syncWithStorage(state);
    },
    updateUserProfile(state, action: PayloadAction<{ userId: string; name: string; email: string; company?: string; avatar?: string; password?: string }>) {
      const { userId, name, email, company, avatar, password } = action.payload;
      const user = state.users.find(u => u.id === userId);
      if (user) {
        user.name = name;
        user.email = email;
        if (company !== undefined) user.company = company;
        if (avatar !== undefined) user.avatar = avatar;
        if (password !== undefined) user.password = password;
        syncWithStorage(state);
      }
    }
  }
});

export const {
  addTicket,
  addTicketMessage,
  updateTicketStatus,
  approveQuotation,
  declineQuotation,
  addQuotation,
  addOrder,
  updateOrder,
  toggleProjectMilestone,
  updateProjectStatus,
  updateProjectManager,
  updateMilestoneDueDate,
  addUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  changeUserPassword,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotification,
  updateUserProfile,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
