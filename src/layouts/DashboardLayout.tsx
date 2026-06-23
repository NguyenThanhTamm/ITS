import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import { markNotificationRead, markAllNotificationsRead, clearNotification } from '@/store/dashboardSlice';
import { PATHS } from '@/routes/paths';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { Avatar } from '@/components/Avatar';
import {
  LayoutDashboard,
  Briefcase,
  LifeBuoy,
  FileText,
  ShoppingCart,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  CloudLightning,
  ChevronRight,
  CheckCircle,
  Inbox,
  AlertCircle,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.dashboard);

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems: Array<{ name: string; href: string; icon: typeof LayoutDashboard }> = [
    { name: 'Tổng quan', href: PATHS.DASHBOARD.OVERVIEW, icon: LayoutDashboard },
    { name: 'Triển khai Kỹ thuật', href: PATHS.DASHBOARD.PROJECTS, icon: Briefcase },
    { name: 'Hỗ trợ kỹ thuật', href: PATHS.DASHBOARD.TICKETS, icon: LifeBuoy },
    { name: 'Báo giá Dịch vụ', href: PATHS.DASHBOARD.QUOTATIONS, icon: FileText },
    { name: 'Đơn hàng thiết bị', href: PATHS.DASHBOARD.ORDERS, icon: ShoppingCart },
    { name: 'Hồ sơ cá nhân', href: PATHS.DASHBOARD.PROFILE, icon: User },
  ];

  const displayMenuItems = [...menuItems];
  if (user?.role === 'ADMIN') {
    displayMenuItems.push({ name: 'Khách hàng & Kỹ thuật', href: PATHS.DASHBOARD.USERS, icon: Users });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATHS.LOGIN);
  };

  const isActive = (path: string) => {
    if (path === PATHS.DASHBOARD.OVERVIEW) {
      return location.pathname === PATHS.DASHBOARD.OVERVIEW;
    }
    return location.pathname.startsWith(path);
  };

  // Vietnamese translation map for breadcrumbs paths
  const pathLabelMap: Record<string, string> = {
    dashboard: 'Bảng điều khiển',
    projects: 'Triển khai Kỹ thuật',
    tickets: 'Yêu cầu hỗ trợ',
    quotations: 'Báo giá Dịch vụ',
    orders: 'Theo dõi đơn hàng',
    profile: 'Cài đặt tài khoản',
    users: 'Khách hàng & Kỹ thuật'
  };

  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(p => p);
    return pathParts.map((part, index) => {
      const href = '/' + pathParts.slice(0, index + 1).join('/');
      const isLast = index === pathParts.length - 1;
      const cleanPart = part.toLowerCase();
      const label = pathLabelMap[cleanPart] || part.charAt(0).toUpperCase() + part.slice(1);
      
      return (
        <span key={href} className="flex items-center text-xs sm:text-sm">
          {index > 0 && <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-slate-400" />}
          {isLast ? (
            <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
          ) : (
            <Link to={href} className="text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400">
              {label}
            </Link>
          )}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-955 text-slate-805 dark:text-slate-200 transition-colors duration-300">
      
      {/* 1. Large Screen Collapsible Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-250/50 dark:border-slate-800/50">
          <Link to={PATHS.HOME} className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-enterprise-accent-cyan flex items-center justify-center text-white shadow-md shadow-brand-500/10">
              <CloudLightning className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">Nguyễn Thanh Tâm</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Cổng thông tin</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {displayMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group ${
                  active
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card info footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <Avatar
                avatar={user?.avatar}
                name={user?.name || ''}
                className="h-9 w-9 ring-2 ring-brand-500/20"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</span>
                <span className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-enterprise-accent-cyan flex items-center justify-center text-white">
                    <CloudLightning className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Nguyễn Thanh Tâm</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-slate-450 hover:bg-slate-105 rounded-md dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {displayMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        active
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                          : 'text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      avatar={user?.avatar}
                      name={user?.name || ''}
                      className="h-9 w-9 ring-2 ring-brand-500/20"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-slate-400 text-sm font-semibold">Portal</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
              {getBreadcrumbs()}
            </div>
            <div className="sm:hidden font-bold text-slate-900 dark:text-white text-base">
              {location.pathname.split('/').pop()?.toUpperCase() || 'BẢNG ĐIỀU KHIỂN'}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />
            
            {/* Notification center */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserDropdownOpen(false);
                }}
                className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:text-brand-500 dark:hover:text-brand-400 focus:outline-none transition-colors ${notifOpen ? 'bg-slate-200 dark:bg-slate-800 text-brand-500' : ''}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Thông báo mới ({unreadCount})</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => dispatch(markAllNotificationsRead())}
                            className="text-xs text-brand-500 hover:text-brand-600 font-semibold"
                          >
                            Đọc tất cả
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center flex flex-col items-center justify-center">
                            <Inbox className="h-8 w-8 text-slate-350 dark:text-slate-600 mb-2" />
                            <p className="text-xs text-slate-400 font-medium">Hộp thư trống!</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => dispatch(markNotificationRead(notif.id))}
                              className={`p-4 transition-colors cursor-pointer text-left ${notif.read ? 'hover:bg-slate-50 dark:hover:bg-slate-900/40' : 'bg-brand-500/5 hover:bg-brand-500/10'}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  {notif.type === 'TICKET' && <LifeBuoy className="h-4 w-4 text-emerald-500" />}
                                  {notif.type === 'PROJECT' && <Briefcase className="h-4 w-4 text-blue-500" />}
                                  {notif.type === 'QUOTATION' && <FileText className="h-4 w-4 text-purple-500" />}
                                  {notif.type === 'ORDER' && <ShoppingCart className="h-4 w-4 text-amber-500" />}
                                  {notif.type === 'INFO' && <AlertCircle className="h-4 w-4 text-slate-400" />}
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                                {notif.message}
                              </p>
                              {!notif.read && (
                                <div className="flex justify-end mt-1">
                                  <span className="text-[10px] font-bold text-brand-500 flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-0.5" /> Đánh dấu đã đọc
                                  </span>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none transition-colors"
              >
                <Avatar
                  avatar={user?.avatar}
                  name={user?.name || ''}
                  className="h-7 w-7 ring-1 ring-brand-500/20"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-350">{user?.name}</span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 glass-panel rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                    >
                      <div className="px-4 py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                      </div>
                      <Link
                        to={PATHS.DASHBOARD.PROFILE}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900/60"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Cài đặt Hồ sơ</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/5 text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </header>

        {/* Dashboard Pages Scroll Container */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
