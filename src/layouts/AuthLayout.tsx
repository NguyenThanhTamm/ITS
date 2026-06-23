import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { CloudLightning, ArrowLeft } from 'lucide-react';
import { PATHS } from '@/routes/paths';
import ThemeToggle from '@/components/Theme/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-hidden bg-dot-pattern">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-brand-500/10 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-enterprise-accent-purple/10 dark:bg-enterprise-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Utilities bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <Link
          to={PATHS.HOME}
          className="inline-flex items-center space-x-1 text-sm font-semibold text-slate-505 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại Trang chủ</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to={PATHS.HOME} className="flex items-center space-x-2 mb-2 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-brand-600 to-enterprise-accent-cyan flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <CloudLightning className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nguyen Thanh Tam
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Cổng thông tin khách hàng doanh nghiệp CNTT
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
