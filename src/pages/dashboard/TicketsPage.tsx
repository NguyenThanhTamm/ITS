import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { addTicket, addTicketMessage, updateTicketStatus } from '@/store/dashboardSlice';
import { Ticket, TicketPriority, TicketStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
  LifeBuoy,
  PlusCircle,
  Clock,
  Send,
  X,
  User,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadMockState } from '@/data/mock';
import { Avatar } from '@/components/Avatar';

// Schema for opening a new ticket
const newTicketSchema = zod.object({
  subject: zod.string().min(5, { message: 'Tiêu đề sự cố phải dài ít nhất 5 ký tự.' }),
  category: zod.string().min(2, { message: 'Vui lòng chọn phân loại sự cố.' }),
  priority: zod.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: zod.string().min(15, { message: 'Nội dung mô tả sự cố phải dài ít nhất 15 ký tự.' }),
});

type NewTicketForm = zod.infer<typeof newTicketSchema>;

export const TicketsPage: React.FC = () => {
  const { tickets, users } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const isAdmin = user?.role === 'ADMIN';
  const displayTickets = isAdmin ? tickets : tickets.filter(t => t.clientId === user?.id);

  const getClientInfo = (clientId: string | undefined) => {
    if (!clientId) return undefined;
    return users.find(u => u.id === clientId);
  };

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | TicketStatus>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (!activeTicketId && displayTickets.length > 0) {
      setActiveTicketId(displayTickets[0].id);
    }
  }, [displayTickets, activeTicketId]);

  const activeTicket = displayTickets.find(t => t.id === activeTicketId);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages]);

  const filteredTickets = filterStatus === 'ALL'
    ? displayTickets
    : displayTickets.filter(t => t.status === filterStatus);

  const getPriorityLabel = (priority: TicketPriority) => {
    switch (priority) {
      case 'CRITICAL': return 'KHẨN CẤP';
      case 'HIGH': return 'CAO';
      case 'MEDIUM': return 'TRUNG BÌNH';
      case 'LOW': return 'THẤP';
      default: return priority;
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return 'ĐANG MỞ';
      case 'PENDING': return 'ĐANG XỬ LÝ';
      case 'RESOLVED': return 'ĐÃ GIẢI QUYẾT';
      default: return status;
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'RESOLVED': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  // Submit new ticket
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<NewTicketForm>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: {
      subject: '',
      category: 'Cloud Access / IAM',
      priority: 'MEDIUM',
      description: '',
    }
  });

  const handleCreateTicket = (data: NewTicketForm) => {
    dispatch(addTicket({
      ...data,
      clientName: user?.name || 'Khách hàng',
      clientId: user?.id
    }));
    setIsModalOpen(false);
    reset();
    setTimeout(() => {
      const currentState = loadMockState();
      const clientTickets = isAdmin ? currentState.tickets : currentState.tickets.filter(t => t.clientId === user?.id);
      if (clientTickets.length > 0) {
        setActiveTicketId(clientTickets[0].id);
      }
    }, 150);
  };

  // Send support chat response
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeTicketId || !user) return;

    dispatch(addTicketMessage({
      ticketId: activeTicketId,
      message: chatMessage,
      sender: isAdmin ? 'SUPPORT' : 'CLIENT',
      senderName: user.name
    }));
    setChatMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hệ thống Yêu cầu Hỗ trợ kỹ thuật</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Khởi tạo các sự cố kỹ thuật, theo dõi tiến trình phản hồi SLA và hội thoại trực tiếp với đội vận hành hạ tầng.
          </p>
        </div>
        {!isAdmin ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-655 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5 mr-1.5" />
            <span>Gửi yêu cầu Hỗ trợ</span>
          </button>
        ) : (
          <span className="px-3 py-1 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-lg text-xs font-bold font-mono">
            QUYỀN PHẢN HỒI HỖ TRỢ ADMIN ĐANG HOẠT ĐỘNG
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
        
        {/* Left Panel: Ticket Queue */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 flex flex-col space-y-4 max-h-[600px] overflow-y-auto">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-855">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hàng đợi sự cố</h2>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-bold focus:outline-none"
            >
              <option value="ALL">Tất cả Trạng thái</option>
              <option value="OPEN">Đang mở (OPEN)</option>
              <option value="PENDING">Đang xử lý (PENDING)</option>
              <option value="RESOLVED">Đã giải quyết (RESOLVED)</option>
            </select>
          </div>

          <div className="space-y-2 flex-grow overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Inbox className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <span className="text-xs">Không tìm thấy yêu cầu hỗ trợ nào</span>
              </div>
            ) : (
              filteredTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTicketId(t.id);
                  }}
                  className={`p-3.5 border rounded-xl transition-all cursor-pointer text-left space-y-2.5 ${
                    activeTicketId === t.id
                      ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                      : 'border-slate-200/55 dark:border-slate-800/55 hover:border-slate-350 bg-white dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold font-mono text-slate-445">{t.id}</span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded border ${getStatusColor(t.status)}`}>
                      {getStatusLabel(t.status)}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-snug">
                    {t.subject}
                  </h3>

                  {isAdmin && (
                    <div className="flex items-center space-x-1.5 pt-0.5">
                      {(() => {
                        const client = getClientInfo(t.clientId);
                        return (
                          <>
                            <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-4 w-4 shrink-0" />
                            <span className="text-[10px] text-slate-500 font-bold truncate">{client?.name}</span>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-855">
                    <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded border ${getPriorityColor(t.priority)}`}>
                      {getPriorityLabel(t.priority)}
                    </span>
                    <span className="text-[9px] text-slate-450 flex items-center font-semibold">
                      <Clock className="h-3 w-3 mr-0.5" />
                      {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Support Message thread */}
        <div className="lg:col-span-8 glass-panel rounded-2xl flex flex-col justify-between max-h-[600px] overflow-hidden">
          {activeTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-900/10 flex justify-between items-center shrink-0">
                <div className="text-left space-y-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center">
                    <LifeBuoy className="h-4.5 w-4.5 text-brand-500 mr-1.5 shrink-0" />
                    <span>{activeTicket.subject}</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-450">
                    <span>Phân loại lỗi: <span className="font-semibold">{activeTicket.category}</span></span>
                    {isAdmin && (
                      <>
                        <span>•</span>
                        {(() => {
                          const client = getClientInfo(activeTicket.clientId);
                          return (
                            <span className="inline-flex items-center space-x-1 font-bold text-slate-600 dark:text-slate-350">
                              <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-3.5 w-3.5 shrink-0" />
                              <span>{client?.name} ({client?.company || 'Doanh nghiệp'})</span>
                            </span>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getPriorityColor(activeTicket.priority)}`}>
                    {getPriorityLabel(activeTicket.priority)}
                  </span>
                  
                  {isAdmin ? (
                    <select
                      value={activeTicket.status}
                      onChange={(e) => dispatch(updateTicketStatus({ ticketId: activeTicket.id, status: e.target.value as TicketStatus }))}
                      className="px-2 py-0.5 text-[9px] font-bold rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="OPEN">ĐANG MỞ (OPEN)</option>
                      <option value="PENDING">ĐANG XỬ LÝ (PENDING)</option>
                      <option value="RESOLVED">ĐÃ GIẢI QUYẾT (RESOLVED)</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getStatusColor(activeTicket.status)}`}>
                      {getStatusLabel(activeTicket.status)}
                    </span>
                  )}
                </div>
              </div>

              {/* Message scroll log */}
              <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
                {activeTicket.messages.map((msg) => {
                  const isSupport = msg.sender === 'SUPPORT';
                  const isMyMessage = (msg.sender === 'CLIENT' && !isAdmin) || (msg.sender === 'SUPPORT' && isAdmin);

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] flex space-x-2 items-start ${isMyMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {(() => {
                          const senderUser = users.find(u => u.name === msg.senderName);
                          return (
                            <Avatar
                              avatar={senderUser?.avatar}
                              name={msg.senderName}
                              className="h-8 w-8 shadow"
                            />
                          );
                        })()}
                        
                        <div className="space-y-1">
                          <div className={`text-[10px] font-bold text-slate-450 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                            {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border text-left ${
                            isMyMessage
                              ? 'bg-brand-500 border-brand-500/20 text-white rounded-tr-none'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-300 rounded-tl-none'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/10 dark:bg-slate-955/20 flex gap-2 shrink-0 items-center"
              >
                <input
                  type="text"
                  placeholder={isAdmin ? "Nhập tin nhắn phản hồi hỗ trợ cho Khách hàng..." : "Nhập tin nhắn phản hồi sự cố kỹ thuật..."}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="h-10 w-10 shrink-0 bg-brand-500 hover:bg-brand-600 rounded-xl text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="py-24 text-center text-slate-450 flex flex-col items-center justify-center flex-grow">
              <LifeBuoy className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2 animate-spin" />
              <p className="text-sm">Vui lòng chọn một sự cố trong danh sách hàng đợi để bắt đầu trò chuyện</p>
            </div>
          )}
        </div>

      </div>

      {/* SUBMIT TICKET MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-[70] bg-slate-955"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl z-[80] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/40 dark:border-slate-800/40 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <LifeBuoy className="h-5 w-5 text-brand-500" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Gửi Yêu cầu Hỗ trợ Kỹ thuật</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit(handleCreateTicket)} className="flex-grow overflow-y-auto p-5 space-y-4 text-left">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Tiêu đề sự cố / yêu cầu
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="Mô tả tóm tắt sự cố cần hỗ trợ"
                    className={`block w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border ${
                      errors.subject ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    } text-slate-900 dark:text-white focus:outline-none`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Phân loại Lĩnh vực
                    </label>
                    <select
                      {...register('category')}
                      className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Cloud Access / IAM">Quyền hạn IAM / Đăng nhập Cloud</option>
                      <option value="Network Engineering">Định tuyến mạng / Latency VPN</option>
                      <option value="Pipeline Build Failure">Lỗi đường ống dẫn mã CI/CD</option>
                      <option value="Billing / Invoice">Hóa đơn mua sắm / Báo giá</option>
                      <option value="Configuration">Yêu cầu thay đổi Cấu hình</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Mức độ ưu tiên SLA
                    </label>
                    <select
                      {...register('priority')}
                      className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="LOW">Thấp (Phản hồi sau 1 ngày)</option>
                      <option value="MEDIUM">Trung bình (Phản hồi sau 4 tiếng)</option>
                      <option value="HIGH">Cao (Phản hồi trong 1 tiếng)</option>
                      <option value="CRITICAL">Khẩn cấp (Xử lý sự cố trong 30 phút)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Mô tả Chi tiết sự cố
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Vui lòng cung cấp log lỗi, địa chỉ IP mạng, mã lỗi hoặc các bước tái hiện sự cố..."
                    className={`block w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border ${
                      errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    } text-slate-900 dark:text-white focus:outline-none`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-855 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow transition-colors cursor-pointer"
                  >
                    Gửi yêu cầu hỗ trợ
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TicketsPage;
