import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { PATHS } from './paths';

// Lazy load components to optimize bundling
const HomePage = React.lazy(() => import('@/pages/public/HomePage'));
const ServicesPage = React.lazy(() => import('@/pages/public/ServicesPage'));
const SolutionsPage = React.lazy(() => import('@/pages/public/SolutionsPage'));
const PortfolioPage = React.lazy(() => import('@/pages/public/PortfolioPage'));
const PricingPage = React.lazy(() => import('@/pages/public/PricingPage'));
const BlogPage = React.lazy(() => import('@/pages/public/BlogPage'));
const ContactPage = React.lazy(() => import('@/pages/public/ContactPage'));

const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));

const OverviewPage = React.lazy(() => import('@/pages/dashboard/OverviewPage'));
const ProjectsPage = React.lazy(() => import('@/pages/dashboard/ProjectsPage'));
const TicketsPage = React.lazy(() => import('@/pages/dashboard/TicketsPage'));
const QuotationsPage = React.lazy(() => import('@/pages/dashboard/QuotationsPage'));
const OrdersPage = React.lazy(() => import('@/pages/dashboard/OrdersPage'));
const ProfilePage = React.lazy(() => import('@/pages/dashboard/ProfilePage'));
const UsersPage = React.lazy(() => import('@/pages/dashboard/UsersPage'));

// Loader spinner overlay for code-splitting lazy routes
const LoaderScreen = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="relative">
      <div className="h-10 w-10 border-4 border-slate-200 dark:border-slate-800 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 h-10 w-10 border-t-4 border-brand-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoaderScreen />}>
      <Routes>
        {/* Marketing/Public routes */}
        <Route element={<PublicLayout />}>
          <Route path={PATHS.HOME} element={<HomePage />} />
          <Route path={PATHS.SERVICES} element={<ServicesPage />} />
          <Route path={PATHS.SOLUTIONS} element={<SolutionsPage />} />
          <Route path={PATHS.PORTFOLIO} element={<PortfolioPage />} />
          <Route path={PATHS.PRICING} element={<PricingPage />} />
          <Route path={PATHS.BLOG} element={<BlogPage />} />
          <Route path={PATHS.CONTACT} element={<ContactPage />} />
        </Route>

        {/* Authenticated routes */}
        <Route element={<AuthLayout />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Dashboard/Client Gateway routes */}
        <Route
          path={PATHS.DASHBOARD.OVERVIEW}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path={PATHS.DASHBOARD.PROJECTS} element={<ProjectsPage />} />
          <Route path={PATHS.DASHBOARD.TICKETS} element={<TicketsPage />} />
          <Route path={PATHS.DASHBOARD.QUOTATIONS} element={<QuotationsPage />} />
          <Route path={PATHS.DASHBOARD.ORDERS} element={<OrdersPage />} />
          <Route path={PATHS.DASHBOARD.PROFILE} element={<ProfilePage />} />
          <Route path={PATHS.DASHBOARD.USERS} element={<ProtectedRoute allowedRoles={['ADMIN']}><UsersPage /></ProtectedRoute>} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
