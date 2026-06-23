export * from './auth';
export * from './dashboard';
export interface ServiceEstimate {
  cloudHosting: number;
  maintenanceLevel: 'NONE' | 'BASIC' | 'PREMIUM';
  customDevelopmentHours: number;
  securitySuite: boolean;
}
