import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { approveQuotation, declineQuotation } from '@/store/dashboardSlice';
import { QuotationStatus } from '@/types';
import { FileText, CheckCircle, XCircle, Info, DollarSign, Calendar, Clock } from 'lucide-react';

export const QuotationsPage: React.FC = () => {
  const { quotations } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const isAdmin = user?.role === 'ADMIN';
  const displayQuotes = isAdmin ? quotations : quotations.filter(q => q.clientId === user?.id);

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedQuoteId && displayQuotes.length > 0) {
      setSelectedQuoteId(displayQuotes[0].id);
    }
  }, [displayQuotes, selectedQuoteId]);

  const activeQuote = displayQuotes.find(q => q.id === selectedQuoteId);

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
        
        {/* Left Side: Quotes List */}
        <div className="lg:col-span-4 space-y-3 max-h-[550px] overflow-y-auto pr-1">
          {displayQuotes.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelectedQuoteId(q.id)}
              className={`p-4 border rounded-2xl transition-all cursor-pointer text-left space-y-3 ${
                selectedQuoteId === q.id
                  ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                  : 'border-slate-200/50 dark:border-slate-800/50 hover:border-slate-350 bg-white dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-slate-450">{q.id}</span>
                <span className={`px-2 py-0.5 text-[8px] font-bold rounded border ${getStatusColor(q.status)}`}>
                  {getStatusLabel(q.status)}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                {q.title}
              </h3>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-855">
                <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-350">${q.total.toLocaleString()}</span>
                <span className="text-[9px] text-slate-450 font-semibold">{q.createdAt}</span>
              </div>
            </div>
          ))}
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

              {/* Date information */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Ngày lập: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{activeQuote.createdAt}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Hạn hiệu lực: <strong className="text-slate-750 dark:text-slate-300 font-semibold">{activeQuote.validUntil}</strong></span>
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
                        onClick={() => handleApprove(activeQuote.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer inline-flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        <span>Phê duyệt & Điều phối</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500 italic flex items-center bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                      <Clock className="h-4 w-4 mr-1.5 text-amber-500 animate-pulse" />
                      <span>Báo giá đang chờ kỹ sư Nguyễn Thanh Tâm khảo sát và phản hồi phương án điều phối.</span>
                    </div>
                  )}
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

    </div>
  );
};

export default QuotationsPage;
