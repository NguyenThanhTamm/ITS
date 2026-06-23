import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PATHS } from '@/routes/paths';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  Briefcase,
  LifeBuoy,
  FileText,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { projects, tickets, quotations, orders } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  const isClient = user?.role === 'CLIENT';

  const filteredProjects = isClient ? projects.filter(p => p.clientId === user?.id) : projects;
  const filteredTickets = isClient ? tickets.filter(t => t.clientId === user?.id) : tickets;
  const filteredQuotations = isClient ? quotations.filter(q => q.clientId === user?.id) : quotations;
  const filteredOrders = isClient ? orders.filter(o => o.clientId === user?.id) : orders;

  // Compute metrics
  const activeProjects = filteredProjects.filter(p => p.status !== 'COMPLETED').length;
  const openTickets = filteredTickets.filter(t => t.status !== 'RESOLVED').length;
  const pendingQuotes = filteredQuotations.filter(q => q.status === 'PENDING').length;
  const totalSpend = filteredOrders.reduce((sum, o) => sum + o.price, 0) + filteredQuotations.filter(q => q.status === 'APPROVED').reduce((sum, q) => sum + q.total, 0);

  // Generate dynamic trafficData based on filtered data dates
  const generateTrafficData = () => {
    const months = [
      { name: 'Tháng 1', monthNum: '01' },
      { name: 'Tháng 2', monthNum: '02' },
      { name: 'Tháng 3', monthNum: '03' },
      { name: 'Tháng 4', monthNum: '04' },
      { name: 'Tháng 5', monthNum: '05' },
      { name: 'Tháng 6', monthNum: '06' }
    ];

    return months.map(m => {
      const quotesCount = filteredQuotations.filter(q => q.createdAt && q.createdAt.includes(`-` + m.monthNum + `-`)).length;
      const ordersCount = filteredOrders.filter(o => o.purchaseDate && o.purchaseDate.includes(`-` + m.monthNum + `-`)).length;
      const ticketsCount = filteredTickets.filter(t => t.createdAt && t.createdAt.includes(`-` + m.monthNum)).length;
      
      const projectsCompleted = filteredProjects.filter(p => p.status === 'COMPLETED' && p.endDate && p.endDate.includes(`-` + m.monthNum + `-`)).length;
      const ordersDelivered = filteredOrders.filter(o => o.status === 'DELIVERED' && o.purchaseDate && o.purchaseDate.includes(`-` + m.monthNum + `-`)).length;
      const ticketsResolved = filteredTickets.filter(t => t.status === 'RESOLVED' && t.createdAt && t.createdAt.includes(`-` + m.monthNum)).length;

      const baseIngress = isClient ? 0 : 5;
      const baseEgress = isClient ? 0 : 3;

      return {
        name: m.name,
        ingress: baseIngress + quotesCount + ordersCount + ticketsCount,
        egress: baseEgress + projectsCompleted + ordersDelivered + ticketsResolved
      };
    });
  };

  const trafficData = generateTrafficData();

  // Generate SLA velocity (resolved vs opened tickets) per week of June 2026 dynamically
  const generateTicketData = () => {
    const weeks = [
      { name: 'Tuần 22', weekNum: 22 },
      { name: 'Tuần 23', weekNum: 23 },
      { name: 'Tuần 24', weekNum: 24 },
      { name: 'Tuần 25', weekNum: 25 }
    ];

    return weeks.map(w => {
      let rangeStart = 1;
      let rangeEnd = 7;
      if (w.weekNum === 23) { rangeStart = 8; rangeEnd = 14; }
      else if (w.weekNum === 24) { rangeStart = 15; rangeEnd = 21; }
      else if (w.weekNum === 25) { rangeStart = 22; rangeEnd = 28; }

      const ticketsInWeek = filteredTickets.filter(t => {
        if (!t.createdAt) return false;
        const day = parseInt(t.createdAt.substring(8, 10));
        const month = parseInt(t.createdAt.substring(5, 7));
        return month === 6 && day >= rangeStart && day <= rangeEnd;
      });

      const opened = ticketsInWeek.filter(t => t.status !== 'RESOLVED').length;
      const resolved = ticketsInWeek.filter(t => t.status === 'RESOLVED').length;

      const baseOpened = isClient ? 0 : 2;
      const baseResolved = isClient ? 0 : 3;

      return {
        week: w.name,
        opened: baseOpened + opened,
        resolved: baseResolved + resolved
      };
    });
  };

  const ticketData = generateTicketData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'REVIEW': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gradient-to-r from-brand-900 to-indigo-950 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Chào mừng trở lại, {user?.name}!</h1>
          <p className="text-xs text-slate-300">Cổng thông tin Cung cấp Dịch vụ & Điều phối Kỹ thuật ITS Nguyễn Thanh Tâm hoạt động ổn định.</p>
        </div>
        <div className="mt-4 sm:mt-0 relative z-10">
          <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold font-mono flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span>SLA ĐANG CHẠY</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Triển khai Kỹ thuật</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{activeProjects}</div>
          </div>
          <div className="h-10 w-10 bg-brand-500/10 text-brand-500 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* Support Tickets */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Sự cố đang xử lý</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{openTickets}</div>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <LifeBuoy className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Proposals */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Thẩm định Dịch vụ</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{pendingQuotes}</div>
          </div>
          <div className="h-10 w-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Total contract value */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">
              {isClient ? 'Tổng Chi Tiêu Dịch vụ' : 'Doanh số Dịch vụ'}
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">${totalSpend.toLocaleString()}</div>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IT Services Dispatch & Completion Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isClient ? 'Tiến độ Triển khai Dịch vụ của bạn' : 'Điều phối & Hoàn thành Dịch vụ kỹ thuật'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-450">
                {isClient
                  ? 'Theo dõi số lượng dịch vụ đã yêu cầu và tỷ lệ kỹ thuật viên hoàn tất bàn giao cho doanh nghiệp của bạn.'
                  : 'Theo dõi số lượng công việc điều phối và tỷ lệ hoàn thành dịch vụ kỹ thuật của tất cả khách hàng.'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Cập nhật hàng tháng</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070f3" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0070f3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="ingress" stroke="#0070f3" strokeWidth={2} fillOpacity={1} fill="url(#colorIngress)" name={isClient ? "Dịch vụ đã yêu cầu" : "Yêu cầu tiếp nhận"} />
                <Area type="monotone" dataKey="egress" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEgress)" name={isClient ? "Đã bàn giao" : "Đã triển khai xong"} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small bar chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Thống kê Vận tốc xử lý SLA</h2>
            <p className="text-[10px] sm:text-xs text-slate-455 font-medium">Tỷ lệ mở mới và đóng yêu cầu hỗ trợ.</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Đã giải quyết" />
                <Bar dataKey="opened" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Đang mở" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-400 font-medium bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
            Thời gian phản hồi sự cố trung bình tuần này là <strong className="text-slate-800 dark:text-white font-semibold">14 phút</strong>, đáp ứng cam kết hỗ trợ tối đa 30 phút đối với sự cố nghiêm trọng.
          </div>
        </div>
      </div>

      {/* Active Work items list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Projects list */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Tiến độ Triển khai Kỹ thuật</h2>
            <Link to={PATHS.DASHBOARD.PROJECTS} className="text-xs font-bold text-brand-500 hover:text-brand-655 flex items-center">
              <span>Xem chi tiết boards</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-850 space-y-3.5">
            {filteredProjects.slice(0, 2).map(proj => (
              <div key={proj.id} className="pt-3.5 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{proj.name}</h3>
                    <p className="text-[10px] text-slate-450 mt-0.5">Hạn bàn giao: {proj.endDate}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getStatusColor(proj.status)}`}>
                    {proj.status === 'IN_PROGRESS' ? 'ĐANG CHẠY' : proj.status === 'REVIEW' ? 'ĐANG DUYỆT' : proj.status === 'COMPLETED' ? 'HOÀN THÀNH' : 'PHÁC THẢO'}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-455 font-semibold font-mono">
                    <span>Mức độ hoàn thành các cột mốc</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support feed */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Yêu cầu Hỗ trợ Mới nhất</h2>
            <Link to={PATHS.DASHBOARD.TICKETS} className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center">
              <span>Hộp thư hỗ trợ</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {filteredTickets.slice(0, 2).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 border border-slate-150/40 dark:border-slate-800/40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/10">
                <div className="space-y-1 overflow-hidden pr-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.subject}</h3>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-450">
                    <span className="font-mono">{t.id}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-0.5" />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded border ${getPriorityColor(t.priority)}`}>
                    {t.priority === 'CRITICAL' ? 'KHẨN CẤP' : t.priority === 'HIGH' ? 'CAO' : t.priority === 'MEDIUM' ? 'TRUNG BÌNH' : 'THẤP'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default OverviewPage;
