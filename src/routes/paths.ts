export const PATHS = {
  // Public Paths
  HOME: '/',
  SERVICES: '/services',
  SOLUTIONS: '/solutions',
  PORTFOLIO: '/portfolio',
  PRICING: '/pricing',
  BLOG: '/blog',
  CONTACT: '/contact',

  // Auth Paths
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard Paths (Protected)
  DASHBOARD: {
    OVERVIEW: '/dashboard',
    PROJECTS: '/dashboard/projects',
    TICKETS: '/dashboard/tickets',
    QUOTATIONS: '/dashboard/quotations',
    ORDERS: '/dashboard/orders',
    PROFILE: '/dashboard/profile',
    USERS: '/dashboard/users',
  }
} as const;
