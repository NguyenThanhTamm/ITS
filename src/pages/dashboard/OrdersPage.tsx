import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { OrderStatus, Product } from '@/types';
import { addOrder, updateOrder, addProduct, updateProduct, deleteProduct } from '@/store/dashboardSlice';
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle2,
  Plus,
  X,
  AlertCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  Grid,
  Tag,
  Eye,
  Server,
  Network,
  Printer,
  Download,
  FileText
} from 'lucide-react';
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
  const { orders, users, products } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'ADMIN';
  const displayOrders = isAdmin ? orders : orders.filter(o => o.clientId === user?.id);

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PRODUCTS' | 'ASSETS'>('ORDERS');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Order search and status filter states
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSelectedStatus, setOrderSelectedStatus] = useState<'ALL' | OrderStatus>('ALL');

  // Invoice export modal states
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<any>(null);

  // Catalog selection states
  const [catalogIndex, setCatalogIndex] = useState<number>(0);
  const [newItemName, setNewItemName] = useState(CATALOG_ITEMS[0].name);
  const [newItemPrice, setNewItemPrice] = useState(CATALOG_ITEMS[0].price);
  const [newItemQty, setNewItemQty] = useState<number>(1);

  // Product management states (Admin)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodSpecsText, setProdSpecsText] = useState('');
  const [prodCategory, setProdCategory] = useState<'DEVICE' | 'CABLE' | 'ACCESSORY'>('DEVICE');
  const [prodInStock, setProdInStock] = useState(true);

  // Filters for Admin Products tab
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodSelectedCategory, setProdSelectedCategory] = useState<'ALL' | 'DEVICE' | 'CABLE' | 'ACCESSORY'>('ALL');

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

  const adminUser = users.find(u => u.role === 'ADMIN');
  const adminPhone = adminUser?.phone || '033 693 0692';
  const adminEmail = adminUser?.email || 'ngthanhtam.it@gmail.com';

  // Filtered orders list based on search query and status dropdown
  const filteredOrdersList = displayOrders.filter(o => {
    const matchesStatus = orderSelectedStatus === 'ALL' || o.status === orderSelectedStatus;
    const query = orderSearchQuery.trim().toLowerCase();
    if (!query) return matchesStatus;

    const matchesSearch =
      o.itemName.toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query) ||
      (isAdmin && (() => {
        const client = users.find(u => u.id === o.clientId);
        return client?.name.toLowerCase().includes(query) || client?.company?.toLowerCase().includes(query);
      })());

    return matchesStatus && matchesSearch;
  });

  const activeOrderId = selectedOrderId || (filteredOrdersList.length > 0 ? filteredOrdersList[0].id : null);
  const activeOrder = displayOrders.find(o => o.id === activeOrderId);

  // Print to PDF workflow
  const handleDownloadPDF = (order: any) => {
    alert("Để tải hóa đơn dạng PDF sắc nét nhất, vui lòng chọn máy in là 'Lưu dưới dạng PDF' (Save as PDF) hoặc 'Microsoft Print to PDF' trong hộp thoại in sắp hiển thị.");
    window.print();
  };

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

  const getBrandFromItemName = (name: string) => {
    const brands = ['Fortinet', 'FortiGate', 'Cisco', 'Ubiquiti', 'UniFi', 'Synology', 'Mikrotik', 'Aruba', 'CommScope', 'Golden Link', 'AMP', 'Dahua', 'Hikvision'];
    for (const b of brands) {
      if (name.toLowerCase().includes(b.toLowerCase())) {
        return b === 'FortiGate' ? 'Fortinet' : b === 'UniFi' ? 'Ubiquiti' : b;
      }
    }
    return 'ITS Custom';
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('');
    setProdPrice(0);
    setProdDescription('');
    setProdImage('');
    setProdSpecsText('');
    setProdCategory('DEVICE');
    setProdInStock(true);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdBrand(prod.brand);
    setProdPrice(prod.price);
    setProdDescription(prod.description);
    setProdImage(prod.image);
    setProdSpecsText(prod.specs.join('\n'));
    setProdCategory(prod.category);
    setProdInStock(prod.inStock);
    setIsProductModalOpen(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodBrand.trim() || prodPrice <= 0) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    const specs = prodSpecsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodName.trim(),
      brand: prodBrand.trim(),
      price: prodPrice,
      description: prodDescription.trim(),
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=400&auto=format&fit=crop',
      specs,
      category: prodCategory,
      inStock: prodInStock
    };

    if (editingProduct) {
      dispatch(updateProduct(productData));
    } else {
      dispatch(addProduct(productData));
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Kích thước hình ảnh vượt quá 1.5MB. Vui lòng chọn ảnh nhỏ hơn!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered products list for admin management tab
  const filteredAdminProducts = products.filter(prod => {
    const matchesCategory = prodSelectedCategory === 'ALL' || prod.category === prodSelectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(prodSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Client infrastructure assets list
  const clientAssets = orders.filter(o => o.clientId === user?.id && o.status === 'DELIVERED');

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
            onClick={() => {
              setActiveTab('ORDERS');
              setIsOrderModalOpen(true);
            }}
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

      {/* Tab Switcher */}
      <div className="flex space-x-1 border-b border-slate-200/50 dark:border-slate-800/60 pb-px">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'ORDERS'
            ? 'border-brand-500 text-brand-500'
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          {isAdmin ? 'Quản lý Đơn hàng' : 'Đơn hàng của tôi'}
        </button>
        {isAdmin ? (
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'PRODUCTS'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            Quản lý Sản phẩm
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('ASSETS')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'ASSETS'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            Thiết bị hạ tầng
          </button>
        )}
      </div>

      {/* Tab 1: Orders (Standard list and timeline) */}
      {activeTab === 'ORDERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left column: Orders list with Search & Filters */}
          <div className="lg:col-span-5 space-y-4 max-h-[600px] flex flex-col pr-1 text-left">
            {/* Filters area */}
            <div className="flex flex-col gap-2.5 shrink-0 bg-white dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder={isAdmin ? "Tìm ID, tên thiết bị, khách hàng..." : "Tìm ID, tên thiết bị..."}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner"
                />
              </div>
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'ALL', label: 'Tất cả' },
                    { id: 'PROCESSING', label: 'Đang xử lý' },
                    { id: 'SHIPPED', label: 'Vận chuyển' },
                    { id: 'DELIVERED', label: 'Đã giao' },
                    { id: 'CANCELLED', label: 'Đã hủy' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOrderSelectedStatus(tab.id as any)}
                      className={`px-2 py-1 rounded-md text-[9px] font-extrabold transition-all shrink-0 cursor-pointer border ${orderSelectedStatus === tab.id
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

            {/* Orders scrollable area */}
            <div className="flex-grow space-y-3 overflow-y-auto pr-0.5">
              {filteredOrdersList.length === 0 ? (
                <div className="py-16 text-center text-slate-450 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
                  <ShoppingCart className="h-8 w-8 text-slate-350 dark:text-slate-700 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-semibold">Không tìm thấy đơn hàng nào.</p>
                </div>
              ) : (
                filteredOrdersList.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`p-4 border rounded-2xl transition-all cursor-pointer text-left space-y-3.5 relative overflow-hidden group ${activeOrderId === o.id
                      ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/10'
                      : 'border-slate-200/55 dark:border-slate-800/55 hover:border-slate-350 bg-white dark:bg-slate-900/40'
                      }`}
                  >
                    {activeOrderId === o.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold font-mono text-slate-455">{o.id}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded border ${getStatusColor(o.status)}`}>
                        {getStatusLabel(o.status)}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-brand-500 transition-colors">
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

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-855">
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
          </div>

          {/* Right column: Delivery Tracking Timeline & Details */}
          <div className="lg:col-span-7 flex flex-col max-h-[600px] overflow-y-auto space-y-4 pr-1 text-left">
            {activeOrder ? (
              <div className="space-y-4 text-left">

                {/* CARD 1: Thông tin chung đơn hàng */}
                <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold font-mono text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {activeOrder.id}
                      </span>
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                        {activeOrder.itemName}
                      </h2>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border ${getStatusColor(activeOrder.status)}`}>
                      {getStatusLabel(activeOrder.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Ngày đặt hàng:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{activeOrder.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Bàn giao dự kiến:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{activeOrder.estimatedDelivery}</span>
                      </div>
                      {activeOrder.trackingNumber && (
                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-sans">
                          <span>Mã vận đơn:</span>
                          <strong className="font-mono text-brand-500 select-all">{activeOrder.trackingNumber}</strong>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800/40 sm:pl-4">
                      {isAdmin ? (
                        <div className="space-y-1.5 font-sans">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Khách hàng đặt mua:</span>
                          {(() => {
                            const client = getClientInfo(activeOrder.clientId);
                            return (
                              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-150/40 dark:border-slate-850">
                                <Avatar avatar={client?.avatar} name={client?.name || ''} className="h-6 w-6 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-850 dark:text-slate-200 truncate">{client?.name}</p>
                                  <p className="text-[10px] text-slate-500 truncate">{client?.company || 'Doanh nghiệp'}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="space-y-1 text-slate-500 dark:text-slate-400 font-sans">
                          <span>Đơn vị cung cấp:</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200">ITS Nguyễn Thanh Tâm</p>
                          <p className="text-[10px]">Email: contact@tamnguyen.dev</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 2: Tiến trình giao nhận & Triển khai */}
                <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center border-b pb-2 border-slate-100 dark:border-slate-800/40">
                    <Truck className="h-4.5 w-4.5 text-brand-500 mr-2" />
                    <span>Lịch trình Giao nhận & Triển khai</span>
                  </h3>

                  <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3.5 space-y-6 pb-2 pt-1">
                    {activeOrder.timeline.map((step) => (
                      <div key={step.label} className="relative pl-6">
                        {/* Dot indicator */}
                        <div className="absolute -left-[9px] top-0">
                          {step.completed ? (
                            <span className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md">
                              <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                            </span>
                          ) : (
                            <span className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-450 flex items-center justify-center border-2 border-white dark:border-slate-900" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                            <h4 className={`text-xs font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-450'}`}>
                              {step.label}
                            </h4>
                            {step.timestamp && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(step.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD 3: Chi tiết thanh toán & Xuất hóa đơn */}
                <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800/40">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                      <FileText className="h-4.5 w-4.5 text-brand-500 mr-2" />
                      <span>Chi tiết Thanh toán & Hóa đơn</span>
                    </h3>
                    <span className="text-[10px] text-slate-450 font-bold bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded font-sans">
                      Số lượng: {activeOrder.quantity || 1}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Tạm tính (chưa VAT):</span>
                      <span className="font-mono font-semibold">${Math.round(activeOrder.price / 1.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Thuế giá trị gia tăng VAT (10%):</span>
                      <span className="font-mono font-semibold">${(activeOrder.price - Math.round(activeOrder.price / 1.1)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-sm border-t border-slate-100 dark:border-slate-800/40 pt-2.5">
                      <span>Tổng cộng thanh toán:</span>
                      <span className="font-mono text-brand-500 dark:text-brand-400">${activeOrder.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceOrder(activeOrder);
                        setIsInvoiceModalOpen(true);
                      }}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <Printer className="h-4 w-4 mr-1.5" />
                      <span>Xuất hóa đơn điện tử</span>
                    </button>
                  </div>
                </div>

                {/* CARD 4: Điều phối Đơn hàng (Quyền Admin) */}
                {isAdmin && (
                  <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-brand-500/20 dark:border-brand-500/20 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center border-b pb-2 border-slate-100 dark:border-slate-800/40">
                      <Package className="h-4.5 w-4.5 text-brand-500 mr-2 animate-pulse" />
                      <span>Điều phối Đơn hàng (Quyền Admin)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Status Select */}
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trạng thái đơn hàng</label>
                        <select
                          value={activeOrder.status}
                          onChange={(e) => dispatch(updateOrder({ orderId: activeOrder.id, status: e.target.value as OrderStatus }))}
                          className="block w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                          className="block w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    {/* Add Timeline Step Form */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-3 text-left">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Cập nhật cột mốc tiến trình</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Tiêu đề (ví dụ: Đã thông quan)"
                          id="custom-step-label"
                          className="px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả chi tiết..."
                          id="custom-step-desc"
                          className="px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <div className="flex justify-end pt-1">
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
                          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Thêm Cột mốc
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center text-slate-450 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex flex-col items-center justify-center flex-grow">
                <ShoppingCart className="h-10 w-10 text-slate-355 dark:text-slate-700 mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Vui lòng chọn một đơn hàng từ danh sách</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Product management (Admin only) */}
      {activeTab === 'PRODUCTS' && isAdmin && (
        <div className="space-y-6 text-left animate-fadeIn">

          {/* Admin Product Management Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {[
                { id: 'ALL', label: 'Tất cả sản phẩm', icon: Grid },
                { id: 'DEVICE', label: 'Thiết bị mạng', icon: Server },
                { id: 'CABLE', label: 'Cáp & Đầu bấm', icon: Network },
                { id: 'ACCESSORY', label: 'Phụ kiện tủ rack', icon: Tag }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = prodSelectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setProdSelectedCategory(cat.id as any)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                      ? 'bg-brand-500 text-white shadow-sm scale-102 border border-brand-600'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 border border-transparent'
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex w-full md:w-auto gap-2 items-center">
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-455">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  value={prodSearchQuery}
                  onChange={(e) => setProdSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm, hãng..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner"
                />
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center px-4 py-2.5 bg-emerald-605 hover:bg-emerald-700 bg-emerald-600 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Thêm sản phẩm</span>
              </button>
            </div>
          </div>

          {/* Admin Products List Grid */}
          {filteredAdminProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
              <ShoppingCart className="h-8 w-8 text-slate-350 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs">Không tìm thấy sản phẩm nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdminProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="glass-panel rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 flex flex-col justify-between space-y-4 group relative transition-all hover:border-slate-350 dark:hover:border-slate-700"
                >
                  {/* Image area */}
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 z-10 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded border border-slate-700 shadow-sm text-[9px] font-bold text-white uppercase">
                      {prod.brand}
                    </div>
                    <div className={`absolute top-2 right-2 z-10 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm text-white ${prod.inStock ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}>
                      {prod.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-1.5 flex-1 text-left">
                    <span className="text-[9px] font-bold text-brand-500 uppercase tracking-wider block">
                      {prod.category === 'DEVICE' ? 'Thiết bị mạng' : prod.category === 'CABLE' ? 'Cáp & Đầu bấm' : 'Phụ kiện tủ rack'}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                    <div className="text-sm font-extrabold text-brand-500 dark:text-brand-400 font-mono mt-1">
                      ${prod.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Specs Count & Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-450 font-bold">
                      {prod.specs.length} thông số kỹ thuật
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-500 hover:text-amber-600 rounded-lg transition-colors border border-slate-200/50 dark:border-slate-800/60 cursor-pointer"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 rounded-lg transition-colors border border-slate-200/50 dark:border-slate-800/60 cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Deployed Infrastructure Assets (Client only) */}
      {activeTab === 'ASSETS' && !isAdmin && (
        <div className="space-y-6 text-left animate-fadeIn">

          <div className="bg-gradient-to-r from-brand-500/10 via-brand-400/5 to-slate-900/10 dark:from-brand-500/10 p-5 rounded-2xl border border-brand-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-brand-500" />
                <span>Hạ tầng mạng & Thiết bị đã triển khai</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Quản lý các thiết bị phần cứng vật lý và giấy phép bản quyền phần mềm đã được kỹ sư bàn giao vận hành trực tuyến.
              </p>
            </div>
            <div className="bg-brand-500/10 text-brand-500 border border-brand-500/20 px-3 py-1 rounded-xl text-xs font-bold font-mono">
              Tổng số thiết bị: {clientAssets.length}
            </div>
          </div>

          {/* Client Assets Grid */}
          {clientAssets.length === 0 ? (
            <div className="py-20 text-center text-slate-450 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Server className="h-10 w-10 text-slate-350 dark:text-slate-700 animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Không có thiết bị hạ tầng nào đang hoạt động</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-sans">Các thiết bị sẽ xuất hiện tại đây khi các đơn hàng phần cứng hoặc dịch vụ được chuyển sang trạng thái <strong>ĐÃ BÀN GIAO</strong> (DELIVERED).</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientAssets.map((asset) => {
                const brand = getBrandFromItemName(asset.itemName);
                return (
                  <div
                    key={asset.id}
                    className="glass-panel rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-brand-500/50 hover:shadow-lg transition-all text-left"
                  >
                    {/* Top status bar */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700 uppercase font-mono">
                        {brand}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        ONLINE & ACTIVE
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-brand-500/10 text-brand-500 flex items-center justify-center rounded-xl">
                        <Server className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {asset.itemName}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 font-sans">Hệ thống: {brand} Enterprise Solution</p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-[11px] space-y-1.5 font-sans">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Mã Serial:</span>
                          <strong className="font-mono text-slate-800 dark:text-slate-200 select-all">{asset.trackingNumber || `SN-${asset.id.toUpperCase()}`}</strong>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Ngày kích hoạt:</span>
                          <span className="font-semibold text-slate-855 dark:text-slate-300">{asset.purchaseDate}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Số lượng thiết bị:</span>
                          <span className="font-bold text-slate-855 dark:text-slate-300 font-mono">{asset.quantity || 1} chiếc</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/30 dark:border-slate-800/30">
                          <span>Tổng trị giá đầu tư:</span>
                          <span className="font-extrabold text-brand-500 font-mono">${asset.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => {
                        setSelectedOrderId(asset.id);
                        setActiveTab('ORDERS');
                      }}
                      className="w-full inline-flex justify-center items-center py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200/40 dark:border-slate-800/40"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>Xem lịch trình bàn giao</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
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
                    min="1"
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
                    className="block w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
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

      {/* ADD / EDIT PRODUCT MODAL (ADMIN ONLY) */}
      <AnimatePresence>
        {isProductModalOpen && isAdmin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 z-[70] bg-slate-955"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl z-[80] overflow-hidden flex flex-col text-left"
            >
              <div className="p-4 sm:p-5 border-b border-slate-200/40 dark:border-slate-800/40 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-brand-500" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="p-5 space-y-4 flex-grow overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">

                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Thiết bị Tường lửa FortiGate 60F"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="block w-full px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Hãng sản xuất *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Fortinet"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      className="block w-full px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Đơn giá ($ USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="1250"
                      value={prodPrice || ''}
                      onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                      className="block w-full px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Danh mục *
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="block w-full px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="DEVICE">Thiết bị mạng (DEVICE)</option>
                      <option value="CABLE">Cáp & Đầu bấm (CABLE)</option>
                      <option value="ACCESSORY">Phụ kiện tủ rack (ACCESSORY)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 flex items-center pt-5">
                    <label className="inline-flex items-center cursor-pointer space-x-2">
                      <input
                        type="checkbox"
                        checked={prodInStock}
                        onChange={(e) => setProdInStock(e.target.checked)}
                        className="rounded border-slate-350 text-brand-500 focus:ring-brand-500 h-4 w-4"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Còn hàng trong kho</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Mô tả ngắn
                  </label>
                  <textarea
                    placeholder="Mô tả tóm tắt tính năng sản phẩm..."
                    rows={2}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="block w-full px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Thông số kỹ thuật (Mỗi thông số trên 1 dòng)
                  </label>
                  <textarea
                    placeholder="Ví dụ:&#13;VPN IPSec tốc độ 6.5 Gbps&#13;Chống virus & Phần mềm độc hại&#13;Kiểm soát ứng dụng chuyên sâu"
                    rows={3}
                    value={prodSpecsText}
                    onChange={(e) => setProdSpecsText(e.target.value)}
                    className="block w-full px-3 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-left">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hình ảnh sản phẩm</span>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-3 h-24 bg-slate-100 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                      {prodImage ? (
                        <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      )}
                    </div>

                    <div className="sm:col-span-9 space-y-2">
                      <div className="space-y-1">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Tải tệp ảnh lên (Tối đa 1.5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-brand-500/10 file:text-brand-500 hover:file:bg-brand-500/20 file:cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Hoặc nhập link hình ảnh trực tiếp</span>
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={prodImage.startsWith('data:image') ? '' : prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="block w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-855 flex justify-end space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow transition-colors cursor-pointer"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {isInvoiceModalOpen && invoiceOrder && (
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
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Xuất Hóa đơn điện tử</h2>
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
                    onClick={() => handleDownloadPDF(invoiceOrder)}
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
                  <div className="space-y-1">
                    <h1 className="text-xl font-extrabold tracking-tight text-brand-900">ITS NGUYỄN THANH TÂM</h1>
                    <p className="text-xs text-slate-500">Cung cấp Giải pháp Công nghệ & Điều phối Kỹ thuật IT</p>
                    <p className="text-[10px] text-slate-455">Địa chỉ: Quận 1, Thành phố Hồ Chí Minh, Việt Nam</p>
                    <p className="text-[10px] text-slate-455">Email: {adminEmail} | Hotline: {adminPhone}</p>
                  </div>
                  <div className="text-right space-y-1 text-slate-900">
                    <h2 className="text-base font-bold uppercase">Hóa Đơn Thanh Toán</h2>
                    <p className="text-xs font-mono font-bold text-slate-700">Mã hóa đơn: INV-{invoiceOrder.id.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">Ngày đặt hàng: {invoiceOrder.purchaseDate}</p>
                    <p className="text-[10px] text-slate-500">Ngày xuất bản: {new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {/* Buyer / Seller Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-650">
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <h3 className="font-extrabold text-slate-900 border-b pb-1.5 uppercase tracking-wider text-[9px]">ĐƠN VỊ CUNG CẤP</h3>
                    <p className="font-semibold text-slate-800">Nguyễn Thanh Tâm IT Enterprise Solutions</p>
                    <p className="text-slate-500">Mã số thuế: 1234567890 (Mô phỏng)</p>
                    <p className="text-slate-500">Số tài khoản: 010765 - MBBANK</p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <h3 className="font-extrabold text-slate-900 border-b pb-1.5 uppercase tracking-wider text-[9px]">ĐƠN VỊ MUA HÀNG</h3>
                    {(() => {
                      const client = getClientInfo(invoiceOrder.clientId);
                      return (
                        <>
                          <p className="font-semibold text-slate-800">{client?.name || 'Khách hàng cá nhân'}</p>
                          <p className="text-slate-500">Doanh nghiệp: {client?.company || 'N/A'}</p>
                          <p className="text-slate-500">Email: {client?.email || 'N/A'}</p>
                          <p className="text-slate-500">Thanh toán: <span className="font-extrabold text-emerald-600">Đã thanh toán (Trả trước)</span></p>
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
                        <th className="p-3.5">Mô tả sản phẩm / dịch vụ</th>
                        <th className="p-3.5 text-right w-24 border-l border-slate-200">Đơn giá</th>
                        <th className="p-3.5 text-center w-20 border-l border-slate-200">Số lượng</th>
                        <th className="p-3.5 text-right w-28 border-l border-slate-200">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-650">
                      <tr>
                        <td className="p-3.5 text-center font-mono border-r border-slate-100">1</td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-800">{invoiceOrder.itemName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Trạng thái bàn nhận: {getStatusLabel(invoiceOrder.status)}</p>
                        </td>
                        <td className="p-3.5 text-right font-mono font-semibold border-l border-slate-100">
                          ${(invoiceOrder.price / (invoiceOrder.quantity || 1)).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-center font-mono font-semibold border-l border-slate-100">
                          {invoiceOrder.quantity || 1}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-slate-800 border-l border-slate-100">
                          ${invoiceOrder.price.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Calculation breakdown */}
                <div className="flex justify-end text-xs pt-1">
                  <div className="w-72 space-y-2 border-t border-slate-250 pt-3.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Tạm tính (chưa thuế):</span>
                      <span className="font-mono font-semibold text-slate-700">${Math.round(invoiceOrder.price / 1.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Thuế giá trị gia tăng (VAT 10%):</span>
                      <span className="font-mono font-semibold text-slate-700">${(invoiceOrder.price - Math.round(invoiceOrder.price / 1.1)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-300 pt-2.5">
                      <span>Tổng cộng thanh toán:</span>
                      <span className="font-mono text-brand-700">${invoiceOrder.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Seals and Signatures */}
                <div className="border-t pt-6 text-center text-[10px] text-slate-450 space-y-2">
                  <p className="font-medium italic text-slate-500">Chân thành cảm ơn quý khách hàng đã đồng hành cùng dịch vụ IT của ITS Nguyễn Thanh Tâm!</p>
                  <p className="text-slate-450">Hóa đơn điện tử được lưu trữ trực tuyến và xác nhận giao dịch thành công.</p>

                  <div className="grid grid-cols-2 gap-8 pt-8">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Người mua hàng</p>
                      <p className="text-[9px] text-slate-400 italic">(Ký xác nhận qua hệ thống)</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="px-2.5 py-0.5 border border-slate-250 bg-slate-50 text-slate-550 rounded text-[9px] font-bold font-mono uppercase">
                          ĐÃ KÝ ĐIỆN TỬ
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">{getClientInfo(invoiceOrder.clientId)?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Đại diện nhà cung cấp</p>
                      <p className="text-[9px] text-slate-400 italic">(Ký điện tử & đóng dấu số)</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="px-3.5 py-1.5 border-2 border-dashed border-emerald-500 text-emerald-500 bg-emerald-500/5 rounded text-[9px] font-black rotate-2 font-mono uppercase tracking-wider shadow-sm">
                          ĐÃ XÁC NHẬN THANH TOÁN
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

export default OrdersPage;
