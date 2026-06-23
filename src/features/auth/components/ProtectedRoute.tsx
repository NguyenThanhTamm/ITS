import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types';
import { ShieldAlert } from 'lucide-react';
import { PATHS } from '@/routes/paths';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Truy cập bị hạn chế</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Vai trò tài khoản của bạn (<span className="font-mono text-brand-500 dark:text-brand-400 font-semibold">{user.role}</span>) không có đủ quyền truy cập để vào phân hệ này.
        </p>
        <a
          href={PATHS.DASHBOARD.OVERVIEW}
          className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-lg hover:shadow-brand-500/20 transition-all duration-200"
        >
          Quay lại Tổng quan Portal
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
