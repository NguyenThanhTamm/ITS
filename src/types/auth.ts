export type UserRole = 'CLIENT' | 'SUPPORT_AGENT' | 'PROJECT_MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
  status?: 'ACTIVE' | 'BLOCKED_7_DAYS' | 'LOCKED';
  blockedUntil?: string;
  createdAt: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
