export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  manager: {
    name: string;
    email: string;
    avatar?: string;
  };
  managerId?: string;
  clientId?: string;
}

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'PENDING' | 'RESOLVED';

export interface TicketMessage {
  id: string;
  sender: 'CLIENT' | 'SUPPORT';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  clientId?: string;
}

export type QuotationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'DECLINED';

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  title: string;
  status: QuotationStatus;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  validUntil: string;
  clientId?: string;
}

export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderTimelineStep {
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  itemName: string;
  price: number;
  quantity?: number;
  status: OrderStatus;
  purchaseDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  timeline: OrderTimelineStep[];
  clientId?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'INFO' | 'PROJECT' | 'TICKET' | 'QUOTATION' | 'ORDER';
}

export interface DashboardMetrics {
  activeProjects: number;
  openTickets: number;
  pendingQuotes: number;
  totalOrders: number;
  completedProjects: number;
  resolvedTickets: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  specs: string[];
  category: 'DEVICE' | 'CABLE' | 'ACCESSORY';
  inStock: boolean;
}

