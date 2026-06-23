import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Project, ProjectStatus } from '@/types';
import { toggleProjectMilestone, updateProjectStatus, updateProjectManager, updateMilestoneDueDate } from '@/store/dashboardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckSquare, Calendar, User, ArrowRight, CheckCircle2, Circle, UserCog, Pencil, X } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

export const ProjectsPage: React.FC = () => {
  const { projects, users } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // State to track which project card is expanded to show milestones list
  const [expandedId, setExpandedId] = useState<string | null>('p-101');
  // State for inline date editing: key = `${projectId}-${milestoneId}`
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'REVIEW': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PLANNING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'IN_PROGRESS': return 'ĐANG TRIỂN KHAI';
      case 'REVIEW': return 'ĐANG NGHIỆM THU';
      case 'COMPLETED': return 'ĐÃ HOÀN THÀNH';
      case 'PLANNING': return 'ĐANG KHỞI TẠO';
      default: return status;
    }
  };

  const isPmOrAdmin = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';
  const isAdmin = user?.role === 'ADMIN';
  const isStaff = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER' || user?.role === 'SUPPORT_AGENT';

  // ADMIN: all projects. Staff (SUPPORT/PM): only assigned projects. CLIENT: only their own.
  const displayProjects = isAdmin
    ? projects
    : isStaff
      ? projects.filter(p => p.managerId === user?.id)
      : projects.filter(p => p.clientId === user?.id);

  const getClientInfo = (clientId: string | undefined) => {
    if (!clientId) return undefined;
    return users.find(u => u.id === clientId);
  };

  const handleToggleMilestone = (projId: string, milestoneId: string) => {
    if (!isStaff) return;
    dispatch(toggleProjectMilestone({ projectId: projId, milestoneId }));
  };

  const handleDateChange = (projId: string, milestoneId: string, newDate: string) => {
    if (!newDate) return;
    dispatch(updateMilestoneDueDate({ projectId: projId, milestoneId, dueDate: newDate }));
    setEditingDate(null);
  };

  // Staff users (non-CLIENT) available for assignment
  const staffUsers = users.filter(u => u.role !== 'CLIENT');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Lịch trình Triển khai & Nghiệm thu Kỹ thuật</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Theo dõi tiến độ lắp đặt thiết bị, triển khai hạ tầng và thông tin kỹ thuật viên thực hiện thực tế.
          </p>
        </div>
        {isPmOrAdmin && (
          <span className="px-3 py-1 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-lg text-xs font-bold font-mono">
            QUYỀN PM KÍCH HOẠT (Được chỉnh sửa cột mốc)
          </span>
        )}
        {user?.role === 'SUPPORT_AGENT' && (
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold font-mono">
            KỸ THUẬT VIÊN — DỰ ÁN ĐƯỢC PHÂN CÔNG
          </span>
        )}
      </div>

      {/* Projects list */}
      <div className="grid grid-cols-1 gap-6">
        {displayProjects.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800/50 py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              <Briefcase className="h-7 w-7 text-brand-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isStaff && !isAdmin ? 'Chưa có dự án nào được phân công' : 'Chưa có dự án nào'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {isStaff && !isAdmin
                  ? 'Admin sẽ phân công bạn vào các dự án. Khi được giao việc, danh sách sẽ xuất hiện tại đây.'
                  : 'Các dự án triển khai kỹ thuật sẽ hiển thị tại đây khi được khởi tạo.'
                }
              </p>
            </div>
          </div>
        ) : displayProjects.map((proj) => {
          const isExpanded = expandedId === proj.id;
          return (
            <div
              key={proj.id}
              className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-brand-500/30 shadow-lg' : 'border-slate-200/50 dark:border-slate-800/50 hover:border-slate-350'
              }`}
            >
              {/* Card Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer select-none"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">{proj.id}</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">{proj.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-2xl">{proj.description}</p>
                  {isAdmin && (
                    <div className="flex items-center space-x-1.5 pt-1">
                      {(() => {
                        const client = getClientInfo(proj.clientId);
                        return (
                          <>
                             <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-4.5 w-4.5 shrink-0" />
                             <span className="text-[10px] text-slate-500 font-bold truncate">Yêu cầu bởi: {client?.name} ({client?.company || 'Doanh nghiệp'})</span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${getStatusColor(proj.status)}`}>
                    {getStatusLabel(proj.status)}
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300">{proj.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Milestones Drawer details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-150/40 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-955/20 px-6 py-6 space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Milestones checklist */}
                      <div className="lg:col-span-8 space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                          <CheckSquare className="h-4.5 w-4.5 text-brand-500 mr-1.5" />
                          <span>Danh sách Cột mốc dự án ({proj.milestones.filter(m=>m.completed).length}/{proj.milestones.length})</span>
                        </h4>

                        <div className="grid grid-cols-1 gap-2.5">
                          {proj.milestones.map((m) => {
                            const dateKey = `${proj.id}-${m.id}`;
                            const isEditingThisDate = editingDate === dateKey;
                            return (
                              <div
                                key={m.id}
                                className={`flex items-start justify-between p-3.5 border rounded-xl transition-all ${
                                  m.completed
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                } ${isStaff ? 'select-none' : ''}`}
                              >
                                {/* Left: checkbox + title */}
                                <div
                                  onClick={() => handleToggleMilestone(proj.id, m.id)}
                                  className={`flex items-start space-x-3 pr-2 flex-1 ${isStaff ? 'cursor-pointer hover:opacity-80' : ''}`}
                                >
                                  {m.completed ? (
                                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                                  )}
                                  <span className={`text-xs sm:text-sm font-semibold ${m.completed ? 'line-through opacity-85' : ''}`}>
                                    {m.title}
                                  </span>
                                </div>

                                {/* Right: date display or inline date picker */}
                                <div className="shrink-0 flex items-center gap-1 mt-0.5">
                                  {isEditingThisDate ? (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="date"
                                        defaultValue={m.dueDate}
                                        autoFocus
                                        onBlur={(e) => handleDateChange(proj.id, m.id, e.target.value)}
                                        onChange={(e) => { if (e.target.value) handleDateChange(proj.id, m.id, e.target.value); }}
                                        className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-brand-500/50 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                                      />
                                      <button
                                        onClick={() => setEditingDate(null)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span
                                      onClick={(e) => { e.stopPropagation(); if (isStaff) setEditingDate(dateKey); }}
                                      className={`text-[10px] font-bold font-mono text-slate-400 flex items-center gap-1 ${
                                        isStaff ? 'cursor-pointer hover:text-brand-500 group' : ''
                                      }`}
                                    >
                                      <Calendar className="h-3 w-3" />
                                      {m.dueDate}
                                      {isStaff && (
                                        <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Technical Dispatch Info */}
                      <div className="lg:col-span-4 space-y-6">
                        {isAdmin && (() => {
                          const client = getClientInfo(proj.clientId);
                          if (!client) return null;
                          return (
                            <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-200/50 dark:border-slate-800/50">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center">
                                <User className="h-4 w-4 text-emerald-500 mr-1.5" />
                                <span>Khách hàng yêu cầu</span>
                              </h4>
                              <div className="flex items-center space-x-3">
                                 <Avatar
                                   avatar={client.avatar}
                                   name={client.name}
                                   className="h-10 w-10 ring-2 ring-emerald-500/20"
                                 />
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">{client.name}</div>
                                  <div className="text-[10px] text-slate-450 truncate">{client.email}</div>
                                  {client.company && (
                                    <div className="text-[9px] font-bold text-brand-500 mt-0.5">{client.company}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="glass-panel p-5 rounded-2xl space-y-5 border border-slate-200/50 dark:border-slate-800/50">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center">
                            <User className="h-4 w-4 text-brand-500 mr-1.5" />
                            <span>Kỹ thuật viên Phụ trách</span>
                          </h4>

                          <div className="flex items-center space-x-3">
                             <Avatar
                               avatar={proj.manager.avatar}
                               name={proj.manager.name}
                               className="h-10 w-10 ring-2 ring-brand-500/20"
                             />
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">{proj.manager.name}</div>
                              <div className="text-[10px] text-slate-450 truncate">{proj.manager.email}</div>
                            </div>
                          </div>

                          <div className="space-y-2.5 pt-2 text-xs border-t border-slate-100 dark:border-slate-855">
                            <div className="flex justify-between">
                              <span className="text-slate-455">Ngày khởi tạo:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{proj.startDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-455">Hoàn thành dự kiến:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{proj.endDate}</span>
                            </div>
                          </div>

                          {/* Admin: Assign Technician Dropdown */}
                          {isAdmin && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2 text-left">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <UserCog className="h-3.5 w-3.5 text-brand-500" />
                                Phân công Kỹ thuật viên
                              </label>
                              <select
                                value={proj.managerId || ''}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    dispatch(updateProjectManager({ projectId: proj.id, managerId: e.target.value }));
                                  }
                                }}
                                className="block w-full px-2.5 py-2 rounded-lg text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                              >
                                <option value="">-- Chọn kỹ thuật viên --</option>
                                {staffUsers.map(su => (
                                  <option key={su.id} value={su.id}>
                                    {su.name} ({su.role === 'ADMIN' ? 'Admin' : su.role === 'PROJECT_MANAGER' ? 'PM' : 'Kỹ thuật'})
                                  </option>
                                ))}
                              </select>
                              {proj.managerId && (() => {
                                const assigned = staffUsers.find(su => su.id === proj.managerId);
                                return assigned ? (
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-brand-500/5 border border-brand-500/20">
                                    <Avatar avatar={assigned.avatar} name={assigned.name} className="h-5 w-5 shrink-0" />
                                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 truncate">{assigned.name} — {assigned.email}</span>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}

                          {/* Admin Project Status Management Control */}
                          {isPmOrAdmin && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2 text-left">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Điều phối Trạng thái Triển khai
                              </label>
                              <select
                                value={proj.status}
                                onChange={(e) => dispatch(updateProjectStatus({ projectId: proj.id, status: e.target.value as ProjectStatus }))}
                                className="block w-full px-2.5 py-2 rounded-lg text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                              >
                                <option value="PLANNING">ĐANG KHỞI TẠO (PLANNING)</option>
                                <option value="IN_PROGRESS">ĐANG TRIỂN KHAI (IN_PROGRESS)</option>
                                <option value="REVIEW">ĐANG NGHIỆM THU (REVIEW)</option>
                                <option value="COMPLETED">ĐÃ HOÀN THÀNH (COMPLETED)</option>
                              </select>
                            </div>
                          )}

                          <div className="pt-2">
                            <a
                              href={`mailto:${proj.manager.email}?subject=Trao đổi thông tin triển khai ${proj.id}`}
                              className="w-full inline-flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-xs font-bold transition-all text-slate-700 dark:text-slate-300"
                            >
                              <span>Liên hệ Kỹ thuật viên</span>
                              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProjectsPage;
