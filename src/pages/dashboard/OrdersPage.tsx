import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { OrderStatus } from '@/types';
import { addOrder, updateOrder } from '@/store/dashboardSlice';
import { ShoppingCart, Package, Truck, CheckCircle2, Plus, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadMockState } from '@/data/mock';
import { Avatar } from '@/components/Avatar';

const CATALOG_ITEMS = [
  { name: 'Thiết bị Tường lửa Fortinet FortiGate 40F', price: 950 },
  { name: 'Thiết bị Tường lửa Fortinet FortiGate 60F', price: 1450 },
  { name: 'Thiết bị Định tuyến EdgeRouter 12 Ubiquiti', price: 450 },
  { name: 'Bộ phát Wi-Fi chuyên dụng UniFi AP AC Pro', price: 250 },
  { name: 'Switch 24-Port Gigabit Cisco Business 250', price: 650 },
  { name: 'Thiết bị lưu trữ NAS Synology DS923+', price: 850 },
  { name: 'Bản quyền Cloudflare Enterprise (1 năm)', price: 1200 },
  { name: 'Gói bảo trì hệ thống mạng nội bộ (Hàng tháng)', price: 500 },
  { name: 'Thiết bị / Dịch vụ khác (Nhập thủ công)', price: 0 }
];

export const OrdersPage: React.FC = () => {
  const { orders, users } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'ADMIN';
  const displayOrders = isAdmin ? orders : orders.filter(o => o.clientId === user?.id);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Catalog selection states
  const [catalogIndex, setCatalogIndex] = useState<number>(0);
  const [newItemName, setNewItemName] = useState(CATALOG_ITEMS[0].name);
  const [newItemPrice, setNewItemPrice] = useState(CATALOG_ITEMS[0].price);
  const [newItemQty, setNewItemQty] = useState<number>(1);

  const handleCatalogChange = (index: number) => {
    setCatalogIndex(index);
    const item = CATALOG_ITEMS[index];
    if (item.name.includes('Khác (Nhập thủ công)')) {
      setNewItemName('');
      setNewItemPrice(100);
    } else {
      setNewItemName(item.name);
      setNewItemPrice(item.price);
    }
  };

  const getClientInfo = (clientId: string | undefined) => {
    if (!clientId) return undefined;
    return users.find(u => u.id === clientId);
  };

  const activeOrderId = selectedOrderId || (displayOrders.length > 0 ? displayOrders[0].id : null);
  const activeOrder = displayOrders.find(o => o.id === activeOrderId);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PROCESSING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED': return 'ĐÃ BÀN GIAO';
      case 'SHIPPED': return 'ĐANG VẬN CHUYỂN';
      case 'PROCESSING': return 'ĐANG XỬ LÝ';
      case 'CANCELLED': return 'ĐÃ HỦY';
      default: return status;
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    dispatch(addOrder({
      itemName: newItemName.trim(),
      price: newItemPrice,
      quantity: newItemQty,
      clientId: user?.id
    }));

    setNewItemName('');
    setNewItemPrice(1200);
    setNewItemQty(1);
    setIsOrderModalOpen(false);

    // Auto-select the newly created order
    setTimeout(() => {
      const currentState = loadMockState();
      const clientOrders = isAdmin ? currentState.orders : currentState.orders.filter(o => o.clientId === user?.id);
      if (clientOrders.length > 0) {
        setSelectedOrderId(clientOrders[0].id);
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Theo dõi Đơn hàng & Tài sản hạ tầng</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kiểm soát lịch trình bàn giao thiết bị tường lửa vật lý và trạng thái kích hoạt bản quyền phần mềm SaaS doanh nghiệp.
          </p>
        </div>
        {!isAdmin ? (
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 mr-1.5" />
            <span>Đặt dịch vụ / Thiết bị mới</span>
          </button>
        ) : (
          <span className="px-3 py-1 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-lg text-xs font-bold font-mono">
            QUYỀN ĐIỀU PHỐI ADMIN ĐANG HOẠT ĐỘNG
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Orders list */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {displayOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
              <ShoppingCart className="h-8 w-8 text-slate-350 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs">Không có đơn hàng nào.</p>
            </div>
          ) : (
            displayOrders.map((o) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrderId(o.id)}
                 className={`p-4 border rounded-2xl transition-all cursor-pointer text-left space-y-3.5 ${
                   activeOrderId === o.id
                     ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                     : 'border-slate-200/55 dark:border-slate-800/55 hover:border-slate-350 bg-white dark:bg-slate-900/40'
                 }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-mono text-slate-450">{o.id}</span>
                  <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded border ${getStatusColor(o.status)}`}>
                    {getStatusLabel(o.status)}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {o.itemName}
                </h3>

                {isAdmin && (
                   <div className="flex items-center space-x-1.5 pt-0.5">
                     {(() => {
                       const client = getClientInfo(o.clientId);
                       return (
                         <>
                            <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-4.5 w-4.5 shrink-0" />
                            <span className="text-[10px] text-slate-500 font-bold truncate">{client?.name} ({client?.company || 'Doanh nghiệp'})</span>
                         </>
                       );
                     })()}
                   </div>
                 )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-855">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">${o.price.toLocaleString()}</span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold font-sans">
                      SL: {o.quantity || 1}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-455 font-semibold">Ngày đặt: {o.purchaseDate}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column: Delivery Tracking Timeline */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between max-h-[600px] overflow-y-auto space-y-6">
          {activeOrder ? (
            <div className="space-y-6 text-left">
              
              {/* Info details */}
              <div className="pb-4 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold font-mono text-slate-450 uppercase tracking-wider">{activeOrder.id}</span>
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {activeOrder.itemName}
                    </h2>
                    <span className="text-[10px] bg-brand-500/10 text-brand-500 border border-brand-500/20 px-2 py-0.5 rounded-full font-bold">
                      Số lượng: {activeOrder.quantity || 1}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center space-x-2 bg-slate-100/55 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800/45 w-fit">
                      {(() => {
                        const client = getClientInfo(activeOrder.clientId);
                        return (
                          <>
                            <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-5 w-5 shrink-0" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{client?.name} ({client?.company || 'Doanh nghiệp'})</span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                {activeOrder.trackingNumber && (
                  <div className="text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-3 py-1.5 rounded-lg">
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Mã vận đơn tracking</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200 mt-0.5 block">{activeOrder.trackingNumber}</strong>
                  </div>
                )}
              </div>

              {/* Timeline Steps visualization */}
              <div className="space-y-6 pt-2 pl-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center mb-6">
                  <Truck className="h-4.5 w-4.5 text-brand-500 mr-1.5" />
                  <span>Tiến độ Giao nhận & Triển khai</span>
                </h3>

                <div className="relative border-l-2 border-slate-200 dark:border-slate-850 ml-3 space-y-8 pb-4">
                  {activeOrder.timeline.map((step) => {
                    return (
                      <div key={step.label} className="relative pl-8">
                        {/* Dot indicator */}
                        <div className="absolute -left-[11px] top-0">
                          {step.completed ? (
                            <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-slate-50 dark:border-slate-955 shadow-md">
                              <CheckCircle2 className="h-3 w-3 shrink-0" />
                            </span>
                          ) : (
                            <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center border-4 border-slate-50 dark:border-slate-955" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className={`text-xs sm:text-sm font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-450'}`}>
                              {step.label}
                            </h4>
                            {step.timestamp && (
                              <span className="text-[10px] text-slate-400 font-semibold font-mono">
                                {new Date(step.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-555 dark:text-slate-400 leading-normal max-w-md">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin Coordination Control Box */}
              {isAdmin && (
                <div className="p-4 bg-brand-500/5 dark:bg-brand-500/10 rounded-xl border border-brand-500/20 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                    <Package className="h-4.5 w-4.5 text-brand-500 mr-1.5 animate-pulse" />
                    <span>Điều phối Đơn hàng (Quyền Admin)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status Select */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trạng thái đơn hàng</label>
                      <select
                        value={activeOrder.status}
                        onChange={(e) => dispatch(updateOrder({ orderId: activeOrder.id, status: e.target.value as OrderStatus }))}
                        className="block w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="PROCESSING">ĐANG XỬ LÝ (PROCESSING)</option>
                        <option value="SHIPPED">ĐANG VẬN CHUYỂN (SHIPPED)</option>
                        <option value="DELIVERED">ĐÃ BÀN GIAO (DELIVERED)</option>
                        <option value="CANCELLED">ĐÃ HỦY (CANCELLED)</option>
                      </select>
                    </div>

                    {/* Tracking Number Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mã vận đơn tracking</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: FTN-8947-VN"
                        value={activeOrder.trackingNumber || ''}
                        onChange={(e) => dispatch(updateOrder({ orderId: activeOrder.id, status: activeOrder.status, trackingNumber: e.target.value }))}
                        className="block w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {/* Add Timeline Step Form */}
                  <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3 text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cập nhật cột mốc tiến trình</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Tiêu đề (ví dụ: Đã thông quan)"
                        id="custom-step-label"
                        className="px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Mô tả chi tiết..."
                        id="custom-step-desc"
                        className="px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const labelInput = document.getElementById('custom-step-label') as HTMLInputElement;
                        const descInput = document.getElementById('custom-step-desc') as HTMLInputElement;
                        if (labelInput && descInput && labelInput.value.trim() && descInput.value.trim()) {
                          dispatch(updateOrder({
                            orderId: activeOrder.id,
                            status: activeOrder.status,
                            timelineLabel: labelInput.value.trim(),
                            timelineDesc: descInput.value.trim()
                          }));
                          labelInput.value = '';
                          descInput.value = '';
                        }
                      }}
                      className="px-3 py-1.5 bg-brand-500 hover:bg-brand-655 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Thêm Cột mốc
                    </button>
                  </div>
                </div>
              )}

              {/* Invoicing info */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-150/40 dark:border-slate-800/40 text-xs text-slate-500 flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="h-4 w-4 text-brand-500 mr-2 shrink-0" />
                  <span>Tổng tiền thanh toán (Số lượng: {activeOrder.quantity || 1}):</span>
                </span>
                <span className="font-bold text-slate-855 dark:text-slate-200 font-mono text-sm">${activeOrder.price.toLocaleString()}</span>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-slate-450 flex flex-col items-center justify-center flex-grow">
              <ShoppingCart className="h-10 w-10 text-slate-305 dark:text-slate-700 mb-2 animate-pulse" />
              <p className="text-sm">Vui lòng chọn một đơn hàng từ danh sách để xem tiến trình vận chuyển</p>
            </div>
          )}
        </div>

      </div>

      {/* NEW ORDER MODAL */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="fixed inset-0 z-[70] bg-slate-955"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl z-[80] overflow-hidden flex flex-col text-left"
            >
              <div className="p-4 sm:p-5 border-b border-slate-200/40 dark:border-slate-800/40 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-brand-500" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Đặt thiết bị / Dịch vụ mới</h2>
                </div>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-5 space-y-4 flex-grow overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Chọn Thiết bị / Dịch vụ từ Danh mục
                  </label>
                  <select
                    value={catalogIndex}
                    onChange={(e) => handleCatalogChange(parseInt(e.target.value))}
                    className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    {CATALOG_ITEMS.map((item, idx) => (
                      <option key={idx} value={idx}>
                        {item.name.includes('Khác (Nhập thủ công)') ? item.name : `${item.name} ($${item.price.toLocaleString()})`}
                      </option>
                    ))}
                  </select>
                </div>

                {CATALOG_ITEMS[catalogIndex].name.includes('Khác (Nhập thủ công)') && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tên thiết bị / Dịch vụ tự chọn
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Thiết bị tường lửa Fortigate 40F"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    Định mức chi phí ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="100000"
                    disabled={!CATALOG_ITEMS[catalogIndex].name.includes('Khác (Nhập thủ công)')}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(parseInt(e.target.value) || 0)}
                    className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none disabled:opacity-65 disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="99"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 rounded-lg text-[11px] text-slate-550 dark:text-slate-400 flex items-start space-x-2 border border-blue-500/10">
                  <AlertCircle className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>Đơn hàng mới tạo sẽ xuất hiện ở trạng thái <strong>ĐANG XỬ LÝ</strong>. Kỹ sư Nguyễn Thanh Tâm sẽ tiến hành xác nhận và cập nhật lịch trình giao hàng cụ thể.</span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-855 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow transition-colors cursor-pointer"
                  >
                    Đặt mua ngay
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

export default OrdersPage;
