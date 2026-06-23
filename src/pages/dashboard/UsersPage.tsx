import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { User, UserRole } from '@/types';
import { Avatar } from '@/components/Avatar';
import { deleteUser, updateUserStatus, updateUserRole, changeUserPassword } from '@/store/dashboardSlice';
import {
  Users,
  Search,
  UserX,
  Shield,
  Key,
  Trash2,
  Lock,
  Unlock,
  Briefcase,
  ShoppingCart,
  LifeBuoy,
  FileText,
  Clock,
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { users, projects, orders, tickets, quotations } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleTab, setRoleTab] = useState<'CLIENT' | 'STAFF'>('CLIENT');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const activeUserId = selectedUserId || (
    roleTab === 'CLIENT'
      ? users.find(u => u.role === 'CLIENT')?.id
      : users.find(u => u.role !== 'CLIENT')?.id
  ) || null;

  const activeUser = users.find(u => u.id === activeUserId);

  const handleTabChange = (tab: 'CLIENT' | 'STAFF') => {
    setRoleTab(tab);
    setSelectedUserId(null);
    setNewPasswordInput('');
  };

  // Search & Role filter
  const filteredUsers = users.filter(
    u => {
      const isStaff = u.role === 'ADMIN' || u.role === 'SUPPORT_AGENT' || u.role === 'PROJECT_MANAGER';
      if (roleTab === 'CLIENT' && isStaff) return false;
      if (roleTab === 'STAFF' && !isStaff) return false;

      return (
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.company || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  // Stats count for active selected user
  const userProjects = projects.filter(p => p.clientId === activeUserId);
  const userOrders = orders.filter(o => o.clientId === activeUserId);
  const userTickets = tickets.filter(t => t.clientId === activeUserId);
  const userQuotes = quotations.filter(q => q.clientId === activeUserId);

  const handleDeleteUser = (userId: string) => {
    if (userId === 'u-admin') {
      alert('Không thể xóa tài khoản Admin gốc!');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi hệ thống? Tất cả dữ liệu hồ sơ liên quan sẽ bị loại bỏ.')) {
      dispatch(deleteUser(userId));
      setSelectedUserId(users[0]?.id || null);
    }
  };

  const handleBlock7Days = (userId: string) => {
    const blockedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dispatch(updateUserStatus({ userId, status: 'BLOCKED_7_DAYS', blockedUntil }));
  };

  const handleLockAccount = (userId: string) => {
    if (userId === 'u-admin') {
      alert('Không thể khóa tài khoản Admin gốc!');
      return;
    }
    dispatch(updateUserStatus({ userId, status: 'LOCKED' }));
  };

  const handleUnlockAccount = (userId: string) => {
    dispatch(updateUserStatus({ userId, status: 'ACTIVE' }));
  };

  const handleUpdatePassword = (userId: string, userName: string) => {
    if (!newPasswordInput.trim()) return;
    dispatch(changeUserPassword({ userId, newPassword: newPasswordInput.trim() }));
    setPasswordResetSuccess(`Mật khẩu tài khoản của ${userName} đã được thay đổi thành: ${newPasswordInput.trim()}`);
    setNewPasswordInput('');
    setTimeout(() => setPasswordResetSuccess(null), 6000);
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    if (userId === 'u-admin') {
      alert('Không thể hạ cấp quyền của Admin gốc!');
      return;
    }
    dispatch(updateUserRole({ userId, role }));
  };

  const getUserStatusBadge = (user: User) => {
    switch (user.status) {
      case 'LOCKED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'BLOCKED_7_DAYS':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  const getUserStatusLabel = (user: User) => {
    switch (user.status) {
      case 'LOCKED': return 'BỊ KHÓA';
      case 'BLOCKED_7_DAYS': return 'TẠM KHÓA 7 NGÀY';
      default: return 'HOẠT ĐỘNG';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
          <Users className="h-6 w-6 text-brand-500 mr-2" />
          <span>Quản lý Tài khoản & Thành viên Portal</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Xem thông tin dịch vụ đã mua, thiết lập phân quyền vai trò, đổi mật khẩu và áp dụng các biện pháp khóa tài khoản thành viên.
        </p>
      </div>

      {passwordResetSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-pulse">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{passwordResetSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Users List & Search */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-4 flex flex-col space-y-4 max-h-[650px] overflow-hidden">
          {/* Search bar */}
          <div className="relative shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm tên, email hoặc doanh nghiệp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Role Tab Switcher */}
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-900/60 rounded-lg border border-slate-200/20 dark:border-slate-800/40 shrink-0">
            <button
              onClick={() => handleTabChange('CLIENT')}
              className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                roleTab === 'CLIENT'
                  ? 'bg-white dark:bg-slate-950 text-brand-500 shadow-sm border border-slate-200/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Khách hàng ({users.filter(u => u.role === 'CLIENT').length})
            </button>
            <button
              onClick={() => handleTabChange('STAFF')}
              className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                roleTab === 'STAFF'
                  ? 'bg-white dark:bg-slate-950 text-brand-500 shadow-sm border border-slate-200/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Kỹ thuật & Admin ({users.filter(u => u.role !== 'CLIENT').length})
            </button>
          </div>

          {/* User cards list */}
          <div className="flex-grow overflow-y-auto space-y-2 pr-1 text-left">
            {filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <UserX className="h-8 w-8 text-slate-350 dark:text-slate-700 mx-auto mb-2" />
                <span className="text-xs">Không tìm thấy thành viên nào</span>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    setNewPasswordInput('');
                  }}
                  className={`p-3.5 border rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    activeUserId === u.id
                      ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                      : 'border-slate-200/50 dark:border-slate-800/50 hover:border-slate-350 bg-white dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <Avatar
                      avatar={u.avatar}
                      name={u.name}
                      className="h-8.5 w-8.5 ring-2 ring-brand-500/10 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">{u.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono">{u.role}</span>
                    {u.status !== 'ACTIVE' && (
                      <span className={`px-1.5 py-0.25 text-[7px] font-extrabold rounded border ${getUserStatusBadge(u)}`}>
                        {getUserStatusLabel(u)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Account Actions Panel */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between max-h-[650px] overflow-y-auto text-left">
          {activeUser ? (
            <div className="space-y-6">
              {/* Profile Overview Card */}
              <div className="pb-5 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex items-start space-x-4">
                  <Avatar
                    avatar={activeUser.avatar}
                    name={activeUser.name}
                    className="h-14 w-14 ring-2 ring-brand-500/20 shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">{activeUser.id}</span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {activeUser.name}
                    </h2>
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <span>{activeUser.company || 'Doanh nghiệp cá nhân'}</span>
                      </div>
                      {activeUser.password && (
                        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold font-mono mt-0.5">
                          <Key className="h-3.5 w-3.5 text-slate-400" />
                          <span>Mật khẩu: {activeUser.password}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getUserStatusBadge(activeUser)}`}>
                    {getUserStatusLabel(activeUser)}
                  </span>
                  {activeUser.status === 'BLOCKED_7_DAYS' && activeUser.blockedUntil && (
                    <span className="text-[9px] font-semibold text-amber-500 flex items-center font-mono">
                      <Clock className="h-3 w-3 mr-0.5" /> đến {activeUser.blockedUntil}
                    </span>
                  )}
                </div>
              </div>

              {/* User Subscriptions, orders and assets breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 border border-slate-200/40 dark:border-slate-800/40 rounded-xl bg-slate-50/40 dark:bg-slate-900/10">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Dự án triển khai</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Briefcase className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white font-mono">{userProjects.length}</span>
                  </div>
                </div>
                
                <div className="p-3 border border-slate-200/40 dark:border-slate-800/40 rounded-xl bg-slate-50/40 dark:bg-slate-900/10">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Đơn hàng mua</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <ShoppingCart className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white font-mono">{userOrders.length}</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-200/40 dark:border-slate-800/40 rounded-xl bg-slate-50/40 dark:bg-slate-900/10">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Ticket kỹ thuật</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <LifeBuoy className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white font-mono">{userTickets.length}</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-200/40 dark:border-slate-800/40 rounded-xl bg-slate-50/40 dark:bg-slate-900/10">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Báo giá đề xuất</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <FileText className="h-4.5 w-4.5 text-purple-500 shrink-0" />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white font-mono">{userQuotes.length}</span>
                  </div>
                </div>
              </div>

              {/* Detail assets purchased itemized lists */}
              <div className="space-y-3.5 border-t border-slate-150/40 dark:border-slate-800/40 pt-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                  <ShoppingCart className="h-4.5 w-4.5 text-brand-500 mr-1.5" />
                  <span>Dịch vụ & Thiết bị đã sở hữu</span>
                </h3>
                
                {userOrders.length === 0 ? (
                  <p className="text-xs text-slate-455 italic">Chưa sở hữu thiết bị phần cứng hay giấy phép SaaS nào.</p>
                ) : (
                  <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                    {userOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-150/40 dark:border-slate-850/40">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{order.itemName}</span>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="font-mono text-slate-500">${order.price.toLocaleString()}</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 text-blue-500">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Administrative Actions Panel */}
              <div className="space-y-4 border-t border-slate-150/40 dark:border-slate-800/40 pt-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                  <Shield className="h-4.5 w-4.5 text-brand-500 mr-1.5" />
                  <span>Bảng Thẩm quyền & Hành động Quản trị</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account Permissions Roles control */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Thay đổi Quyền hạn thành viên</span>
                    <select
                      value={activeUser.role}
                      onChange={(e) => handleRoleChange(activeUser.id, e.target.value as UserRole)}
                      className="block w-full px-2.5 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="CLIENT">Khách hàng thông thường (CLIENT)</option>
                      <option value="PROJECT_MANAGER">Quản lý Dự án (PROJECT_MANAGER)</option>
                      <option value="SUPPORT_AGENT">Kỹ thuật viên Hỗ trợ (SUPPORT_AGENT)</option>
                      <option value="ADMIN">Quản trị viên toàn hệ thống (ADMIN)</option>
                    </select>
                  </div>

                  {/* Password update widget */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Cập nhật Mật khẩu đăng nhập</span>
                      <p className="text-[10px] text-slate-455">Thiết lập mật khẩu mới tùy ý cho thành viên này.</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mật khẩu mới..."
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="flex-grow px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdatePassword(activeUser.id, activeUser.name)}
                        disabled={!newPasswordInput.trim()}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        <Key className="h-3.5 w-3.5 mr-1" />
                        <span>Đổi</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Lock & Ban Accounts Actions */}
                <div className="p-4 bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 animate-pulse" />
                      <span>Hành động bảo an / Hạn chế truy cập</span>
                    </div>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400">Khi tài khoản bị khóa/bấm chặn, phiên hoạt động sẽ lập tức bị chấm dứt đăng nhập.</p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    {activeUser.status === 'ACTIVE' ? (
                      <>
                        <button
                          onClick={() => handleBlock7Days(activeUser.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-amber-500/35 hover:bg-amber-500/5 text-amber-500 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          <Lock className="h-3.5 w-3.5 mr-1" />
                          <span>Khóa 7 ngày</span>
                        </button>
                        <button
                          onClick={() => handleLockAccount(activeUser.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-red-650 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-500/10"
                        >
                          <UserX className="h-3.5 w-3.5 mr-1" />
                          <span>Khóa vĩnh viễn</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUnlockAccount(activeUser.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                      >
                        <Unlock className="h-3.5 w-3.5 mr-1.5" />
                        <span>Mở khóa tài khoản</span>
                      </button>
                    )}
                    
                    {activeUser.id !== 'u-admin' && (
                      <button
                        onClick={() => handleDeleteUser(activeUser.id)}
                        className="px-3 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-slate-450 flex flex-col items-center justify-center flex-grow">
              <Users className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
              <p className="text-sm">Vui lòng chọn một thành viên từ hàng bên trái để tiến hành quản trị</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default UsersPage;
