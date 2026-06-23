import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, CloudLightning, User, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PATHS } from '@/routes/paths';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    { name: 'Trang chủ', href: PATHS.HOME },
    { name: 'Dịch vụ', href: PATHS.SERVICES },
    { name: 'Giải pháp', href: PATHS.SOLUTIONS },
    { name: 'Dự án', href: PATHS.PORTFOLIO },
    { name: 'Báo giá', href: PATHS.PRICING },
    { name: 'Tin tức', href: PATHS.BLOG },
    { name: 'Liên hệ', href: PATHS.CONTACT },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-955 text-slate-805 dark:text-slate-200 transition-colors duration-300">
      {/* Glow effects for dark mode */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-enterprise-accent-purple/5 dark:bg-enterprise-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to={PATHS.HOME} className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-enterprise-accent-cyan flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                <CloudLightning className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight font-sans text-slate-900 dark:text-white leading-none">
                  Nguyễn Thanh Tâm
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Giải pháp Công nghệ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-brand-500 to-enterprise-accent-cyan"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              {isAuthenticated && user ? (
                <Link
                  to={PATHS.DASHBOARD.OVERVIEW}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-semibold transition-all"
                >
                  <User className="h-4 w-4" />
                  <span>Portal Khách hàng</span>
                </Link>
              ) : (
                <Link
                  to={PATHS.LOGIN}
                  className="group flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white rounded-lg shadow-md hover:shadow-brand-500/10 text-sm font-bold transition-all duration-200"
                >
                  <span>Đăng nhập</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-1 shadow-lg"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive(item.href)
                      ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                      : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 px-3">
                {isAuthenticated && user ? (
                  <Link
                    to={PATHS.DASHBOARD.OVERVIEW}
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-base font-semibold hover:bg-slate-200 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Portal Khách hàng</span>
                  </Link>
                ) : (
                  <Link
                    to={PATHS.LOGIN}
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center space-x-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-base font-bold shadow-md shadow-brand-500/10 transition-colors"
                  >
                    <span>Đăng nhập</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-enterprise-accent-cyan flex items-center justify-center text-white">
                  <CloudLightning className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Nguyễn Thanh Tâm
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Điều phối DevOps cao cấp, kiến trúc an toàn thông tin và quản trị cơ sở hạ tầng đám mây cho doanh nghiệp trên toàn cầu.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
                Dịch vụ chính
              </h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to={PATHS.SERVICES} className="hover:text-brand-500">Di trú hạ tầng Cloud</Link></li>
                <li><Link to={PATHS.SERVICES} className="hover:text-brand-500">Tự động hóa DevSecOps</Link></li>
                <li><Link to={PATHS.SERVICES} className="hover:text-brand-500">Bảo mật Zero Trust</Link></li>
                <li><Link to={PATHS.SERVICES} className="hover:text-brand-500">Thiết kế phần mềm SaaS</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
                Giải pháp doanh nghiệp
              </h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to={PATHS.SOLUTIONS} className="hover:text-brand-500">Tài chính Fintech bảo mật</Link></li>
                <li><Link to={PATHS.SOLUTIONS} className="hover:text-brand-500">Chuỗi cung ứng Logistics</Link></li>
                <li><Link to={PATHS.SOLUTIONS} className="hover:text-brand-500">E-Commerce tải trọng cao</Link></li>
                <li><Link to={PATHS.SOLUTIONS} className="hover:text-brand-500">Quản trị dịch vụ IT trọn gói</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
                Portal Khách hàng
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Theo dõi tiến độ dự án, kiểm tra báo giá kỹ thuật, đặt mua thiết bị và gửi yêu cầu hỗ trợ 24/7.
              </p>
              <Link
                to={PATHS.DASHBOARD.OVERVIEW}
                className="inline-flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500"
              >
                <span>Vào cổng thông tin</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center sm:flex sm:items-center sm:justify-between text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Nguyễn Thanh Tâm. Bảo lưu mọi quyền.</p>
            <p className="mt-2 sm:mt-0">Được thiết kế tuân thủ các tiêu chuẩn bảo mật quốc tế.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
