import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { approveQuotation, declineQuotation } from '@/store/dashboardSlice';
import { QuotationStatus } from '@/types';
import { FileText, CheckCircle, XCircle, Info, DollarSign, Calendar, Clock, Printer, Download, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/Avatar';

export const QuotationsPage: React.FC = () => {
  const { quotations, users } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const isAdmin = user?.role === 'ADMIN';
  const displayQuotes = isAdmin ? quotations : quotations.filter(q => q.clientId === user?.id);

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceQuotation, setInvoiceQuotation] = useState<any>(null);

  const getClientInfo = (clientId: string | undefined) => {
    if (!clientId) return undefined;
    return users.find(u => u.id === clientId);
  };

  const adminUser = users.find(u => u.role === 'ADMIN');
  const adminPhone = adminUser?.phone || '033 693 0692';
  const adminEmail = adminUser?.email || 'ngthanhtam.it@gmail.com';

  const handleDownloadPDF = () => {
    alert("Để tải hóa đơn dạng PDF sắc nét nhất, vui lòng chọn máy in là 'Lưu dưới dạng PDF' (Save as PDF) hoặc 'Microsoft Print to PDF' trong hộp thoại in sắp hiển thị.");
    window.print();
  };

  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');
  const [quoteSelectedStatus, setQuoteSelectedStatus] = useState<'ALL' | QuotationStatus>('ALL');

  const filteredQuotesList = displayQuotes.filter(q => {
    const matchesStatus = quoteSelectedStatus === 'ALL' || q.status === quoteSelectedStatus;
    const query = quoteSearchQuery.trim().toLowerCase();
    if (!query) return matchesStatus;

    const client = getClientInfo(q.clientId);
    const matchesSearch =
      q.title.toLowerCase().includes(query) ||
      q.id.toLowerCase().includes(query) ||
      (client && (
        client.name.toLowerCase().includes(query) ||
        client.company?.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      ));

    return matchesStatus && matchesSearch;
  });

  const activeQuoteId = selectedQuoteId && filteredQuotesList.some(q => q.id === selectedQuoteId)
    ? selectedQuoteId
    : (filteredQuotesList.length > 0 ? filteredQuotesList[0].id : null);

  React.useEffect(() => {
    if (!selectedQuoteId && filteredQuotesList.length > 0) {
      setSelectedQuoteId(filteredQuotesList[0].id);
    }
  }, [filteredQuotesList, selectedQuoteId]);

  const activeQuote = displayQuotes.find(q => q.id === activeQuoteId);

  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'DECLINED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: QuotationStatus) => {
    switch (status) {
      case 'APPROVED': return 'ĐÃ DUYỆT';
      case 'DECLINED': return 'ĐÃ TỪ CHỐI';
      case 'PENDING': return 'ĐANG CHỜ';
      default: return status;
    }
  };

  const handleApprove = (id: string) => {
    dispatch(approveQuotation(id));
  };

  const handleDecline = (id: string) => {
    dispatch(declineQuotation(id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Yêu cầu Báo giá Dịch vụ</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Xem xét phạm vi công việc, bảng giá chi tiết và phê duyệt bản đề xuất để tiến hành lập lịch điều phối kỹ thuật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Quotes List & Filter */}
        <div className="lg:col-span-4 flex flex-col space-y-4 max-h-[550px]">
          {/* Filters area */}
          <div className="flex flex-col gap-2.5 shrink-0 bg-white dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-left">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={quoteSearchQuery}
                onChange={(e) => setQuoteSearchQuery(e.target.value)}
                placeholder={isAdmin ? "Tìm ID, tiêu đề, khách..." : "Tìm ID, tiêu đề..."}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner"
              />
            </div>
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'PENDING', label: 'Đang chờ' },
                  { id: 'APPROVED', label: 'Đã duyệt' },
                  { id: 'DECLINED', label: 'Từ chối' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setQuoteSelectedStatus(tab.id as any)}
                    className={`px-2 py-1 rounded-md text-[9px] font-extrabold transition-all shrink-0 cursor-pointer border ${quoteSelectedStatus === tab.id
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/40'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-grow space-y-3 overflow-y-auto pr-0.5">
            {filteredQuotesList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
                <FileText className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-semibold">Không tìm thấy yêu cầu nào.</p>
              </div>
            ) : (
              filteredQuotesList.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuoteId(q.id)}
                  className={`p-4 border rounded-2xl transition-all cursor-pointer text-left space-y-3 relative overflow-hidden group ${
                    activeQuoteId === q.id
                      ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                      : 'border-slate-200/50 dark:border-slate-800/50 hover:border-slate-350 bg-white dark:bg-slate-900/40'
                  }`}
                >
                  {activeQuoteId === q.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-slate-450">{q.id}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded border ${getStatusColor(q.status)}`}>
                      {getStatusLabel(q.status)}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug group-hover:text-brand-500 transition-colors">
                    {q.title}
                  </h3>

                  {isAdmin && (
                    <div className="flex items-center space-x-1.5 pt-1.5 border-t border-slate-100/50 dark:border-slate-800/50">
                      {(() => {
                        const client = getClientInfo(q.clientId);
                        return (
                          <>
                            <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-4.5 w-4.5 shrink-0" />
                            <span className="text-[10px] text-slate-500 font-bold truncate">
                              {client?.name} ({client?.company || 'Cá nhân'})
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-855">
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-355">${q.total.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-450 font-semibold">{q.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Invoice breakdown sheet */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col justify-between max-h-[550px] overflow-y-auto">
          {activeQuote ? (
            <div className="space-y-6">
              
              {/* Sheet header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <span className="text-[10px] font-bold font-mono text-slate-450 uppercase tracking-wider">{activeQuote.id}</span>
                  <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    {activeQuote.title}
                  </h2>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${getStatusColor(activeQuote.status)}`}>
                    {getStatusLabel(activeQuote.status)}
                  </span>
                </div>
              </div>

              {/* Date and Client information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/40 text-xs">
                <div className="space-y-2 text-left flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Ngày lập: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{activeQuote.createdAt}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Hạn hiệu lực: <strong className="text-slate-750 dark:text-slate-300 font-semibold">{activeQuote.validUntil}</strong></span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/50 md:pl-4 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Khách hàng yêu cầu:</span>
                  {(() => {
                    const client = getClientInfo(activeQuote.clientId);
                    return (
                      <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-900/30 p-2 rounded-xl border border-slate-150/40 dark:border-slate-805">
                        <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-7 w-7 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-xs">{client?.name}</p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {client?.company || 'Cá nhân'} • {client?.email}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Table items */}
              <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-xl overflow-hidden bg-white/50 dark:bg-slate-950/20">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50">
                      <th className="p-3 font-semibold">Hạng mục công việc</th>
                      <th className="p-3 text-center font-semibold">SL</th>
                      <th className="p-3 text-right font-semibold">Đơn giá</th>
                      <th className="p-3 text-right font-semibold">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {activeQuote.items.map((item) => (
                      <tr key={item.id} className="text-slate-650 dark:text-slate-350">
                        <td className="p-3 font-semibold leading-relaxed max-w-xs">{item.description}</td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">${item.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoicing summary metrics */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2.5 text-xs text-slate-650 dark:text-slate-400 font-medium">
                  <div className="flex justify-between">
                    <span>Tổng phụ chi phí:</span>
                    <span className="font-mono text-slate-905 dark:text-slate-200">${activeQuote.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10% VAT):</span>
                    <span className="font-mono text-slate-905 dark:text-slate-200">${activeQuote.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-2.5 text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>Tổng cộng thanh toán:</span>
                    <span className="font-mono text-brand-500">${activeQuote.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {activeQuote.notes && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-150/40 dark:border-slate-800/40 text-xs text-slate-500 leading-normal flex items-start space-x-2">
                  <Info className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{activeQuote.notes}</span>
                </div>
              )}

              {/* Action buttons (only displayed when quote is PENDING and user is ADMIN) */}
              {activeQuote.status === 'PENDING' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-855 flex justify-end space-x-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleDecline(activeQuote.id)}
                        className="px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        <span>Từ chối Báo giá</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInvoiceQuotation(activeQuote);
                          setIsInvoiceModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center border border-slate-200/50 dark:border-slate-800/50"
                      >
                        <Printer className="h-4 w-4 mr-1.5" />
                        <span>Xuất hóa đơn (Nháp)</span>
                      </button>
                      <button
                        onClick={() => handleApprove(activeQuote.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer inline-flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        <span>Phê duyệt & Điều phối</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 text-left">
                      <div className="text-xs text-slate-500 italic flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-amber-500 animate-pulse shrink-0" />
                        <span>Báo giá đang chờ kỹ sư Nguyễn Thanh Tâm khảo sát và phản hồi phương án điều phối.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setInvoiceQuotation(activeQuote);
                          setIsInvoiceModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer inline-flex items-center shrink-0"
                      >
                        <Printer className="h-3.5 w-3.5 mr-1" />
                        <span>Xuất hóa đơn (Nháp)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeQuote.status === 'APPROVED' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-855 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceQuotation(activeQuote);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="inline-flex justify-center items-center px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4 mr-1.5" />
                    <span>Xuất hóa đơn điện tử</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center flex-grow">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
              <p className="text-sm">Vui lòng chọn một báo giá từ danh sách để xem chi tiết</p>
            </div>
          )}
        </div>

      </div>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {isInvoiceModalOpen && invoiceQuotation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceModalOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-955 print:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl z-[110] overflow-hidden flex flex-col text-left print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none print:left-0 print:top-0 print:translate-x-0 print:translate-y-0 print:rounded-none print:absolute bg-white"
            >
              {/* Actions Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/45 dark:border-slate-800/45 flex justify-between items-center shrink-0 print:hidden bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-brand-500" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {invoiceQuotation.status === 'APPROVED' ? 'Xuất Hóa đơn điện tử' : 'Xuất Hóa đơn dự thảo (Draft)'}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1" />
                    <span>In hóa đơn</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    <span>Tải PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Area */}
              <div
                id="invoice-print-area"
                className="p-8 flex-grow overflow-y-auto bg-white text-slate-850 space-y-6 print:p-0 print:overflow-visible print:bg-white print:text-black font-sans"
              >
                {/* Print media overlay script */}
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    #invoice-print-area, #invoice-print-area * {
                      visibility: visible;
                    }
                    #invoice-print-area {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      padding: 40px !important;
                      margin: 0;
                      background: white !important;
                      color: black !important;
                    }
                  }
                `}</style>

                {/* Header info */}
                <div className="flex justify-between items-start border-b pb-6 border-slate-200">
                  <div className="space-y-1 text-left">
                    <h1 className="text-xl font-extrabold tracking-tight text-brand-900">ITS NGUYỄN THANH TÂM</h1>
                    <p className="text-xs text-slate-500">Cung cấp Giải pháp Công nghệ & Điều phối Kỹ thuật IT</p>
                    <p className="text-[10px] text-slate-455">Địa chỉ: Quận 1, Thành phố Hồ Chí Minh, Việt Nam</p>
                    <p className="text-[10px] text-slate-455">Email: {adminEmail} | Hotline: {adminPhone}</p>
                  </div>
                  <div className="text-right space-y-1 text-slate-900">
                    <h2 className="text-base font-bold uppercase">
                      {invoiceQuotation.status === 'APPROVED' ? 'Hóa Đơn Thanh Toán' : 'Hóa Đơn Dự Thảo'}
                    </h2>
                    <p className="text-xs font-mono font-bold text-slate-700">Mã hóa đơn: INV-{invoiceQuotation.id.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">Ngày lập: {invoiceQuotation.createdAt}</p>
                    <p className="text-[10px] text-slate-500">Ngày xuất bản: {new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {/* Buyer / Seller Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-650">
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-left">
                    <h3 className="font-extrabold text-slate-900 border-b pb-1.5 uppercase tracking-wider text-[9px]">ĐƠN VỊ CUNG CẤP</h3>
                    <p className="font-semibold text-slate-800">Nguyễn Thanh Tâm IT Enterprise Solutions</p>
                    <p className="text-slate-500">Mã số thuế: 1234567890 (Mô phỏng)</p>
                    <p className="text-slate-500">Số tài khoản: 010765 - MBBANK</p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-left">
                    <h3 className="font-extrabold text-slate-900 border-b pb-1.5 uppercase tracking-wider text-[9px]">ĐƠN VỊ MUA HÀNG</h3>
                    {(() => {
                      const client = getClientInfo(invoiceQuotation.clientId);
                      return (
                        <>
                          <p className="font-semibold text-slate-800">{client?.name || 'Khách hàng cá nhân'}</p>
                          <p className="text-slate-500">Doanh nghiệp: {client?.company || 'N/A'}</p>
                          <p className="text-slate-500">Email: {client?.email || 'N/A'}</p>
                          <p className="text-slate-500">
                            Trạng thái duyệt: {' '}
                            <span className={`font-extrabold ${invoiceQuotation.status === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {invoiceQuotation.status === 'APPROVED' ? 'Đã duyệt báo giá' : 'Đang chờ duyệt'}
                            </span>
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Invoice Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[9px]">
                        <th className="p-3.5 text-center w-12 border-r border-slate-200">STT</th>
                        <th className="p-3.5">Mô tả sản phẩm / dịch vụ triển khai</th>
                        <th className="p-3.5 text-right w-24 border-l border-slate-200">Đơn giá</th>
                        <th className="p-3.5 text-center w-20 border-l border-slate-200">Số lượng</th>
                        <th className="p-3.5 text-right w-28 border-l border-slate-200">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-650">
                      {invoiceQuotation.items.map((item: any, idx: number) => (
                        <tr key={item.id}>
                          <td className="p-3.5 text-center font-mono border-r border-slate-100">{idx + 1}</td>
                          <td className="p-3.5 text-left">
                            <p className="font-bold text-slate-800">{item.description}</p>
                            {idx === 0 && (
                              <p className="text-[10px] text-slate-400 mt-0.5">Tiêu đề: {invoiceQuotation.title}</p>
                            )}
                          </td>
                          <td className="p-3.5 text-right font-mono font-semibold border-l border-slate-100">
                            ${item.unitPrice.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-center font-mono font-semibold border-l border-slate-100">
                            {item.quantity}
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-slate-800 border-l border-slate-100">
                            ${item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation breakdown */}
                <div className="flex justify-end text-xs pt-1">
                  <div className="w-72 space-y-2 border-t border-slate-250 pt-3.5 text-left">
                    <div className="flex justify-between text-slate-500">
                      <span>Tạm tính (chưa thuế):</span>
                      <span className="font-mono font-semibold text-slate-700">${invoiceQuotation.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Thuế giá trị gia tăng (VAT 10%):</span>
                      <span className="font-mono font-semibold text-slate-700">${invoiceQuotation.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-300 pt-2.5">
                      <span>Tổng cộng thanh toán:</span>
                      <span className="font-mono text-brand-700">${invoiceQuotation.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Seals and Signatures */}
                <div className="border-t pt-6 text-center text-[10px] text-slate-455 space-y-2">
                  <p className="font-medium italic text-slate-500">Chân thành cảm ơn quý khách hàng đã đồng hành cùng dịch vụ IT của ITS Nguyễn Thanh Tâm!</p>
                  <p className="text-slate-450">Hóa đơn điện tử được lưu trữ trực tuyến và xác nhận giao dịch thành công.</p>

                  <div className="grid grid-cols-2 gap-8 pt-8">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Người mua hàng</p>
                      <p className="text-[9px] text-slate-400 italic">(Ký xác nhận qua hệ thống)</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="px-2.5 py-0.5 border border-slate-250 bg-slate-50 text-slate-550 rounded text-[9px] font-bold font-mono uppercase">
                          {invoiceQuotation.status === 'APPROVED' ? 'ĐÃ KÝ ĐIỆN TỬ' : 'DỰ THẢO - CHỜ KÝ'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">{getClientInfo(invoiceQuotation.clientId)?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Đại diện nhà cung cấp</p>
                      <p className="text-[9px] text-slate-400 italic">(Ký điện tử & đóng dấu số)</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className={`px-3.5 py-1.5 border-2 border-dashed rounded text-[9px] font-black rotate-2 font-mono uppercase tracking-wider shadow-sm ${
                          invoiceQuotation.status === 'APPROVED' 
                            ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' 
                            : 'border-amber-500 text-amber-500 bg-amber-500/5'
                        }`}>
                          {invoiceQuotation.status === 'APPROVED' ? 'ĐÃ PHÊ DUYỆT' : 'ĐỀ XUẤT BÁO GIÁ'}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">Nguyễn Thanh Tâm</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default QuotationsPage;
