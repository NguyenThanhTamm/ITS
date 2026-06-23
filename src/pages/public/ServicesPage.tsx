import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addQuotation, addOrder } from '@/store/dashboardSlice';
import { PATHS } from '@/routes/paths';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  Cloud,
  ShieldAlert,
  Cpu,
  Terminal,
  ChevronDown,
  ChevronUp,
  Calculator,
  Server,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  Wifi,
  Network,
  Video,
  Database,
  Activity,
  ShoppingCart
} from 'lucide-react';

interface ServiceItem {
  id: string;
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  fullDesc: string;
  technologies: string[];
  features: string[];
  price: number;
}

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  specs: string[];
}

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Accordion active index
  const [activeId, setActiveId] = useState<string | null>('srv-1');

  // Active view tab (Directory of cards vs. Network Hardware Catalog vs. Budget Calculator)
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'HARDWARE' | 'CALCULATOR'>('DIRECTORY');

  // Order confirmation state for hardware products
  const [productOrderCreatedId, setProductOrderCreatedId] = useState<string | null>(null);

  // Quote confirmation state for individual services
  const [srvQuoteCreatedId, setSrvQuoteCreatedId] = useState<string | null>(null);

  // Quantity selector state for products
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Budget Calculator States
  const [infraSize, setInfraSize] = useState<'NONE' | 'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');
  const [maintenance, setMaintenance] = useState<'NONE' | 'BASIC' | 'PREMIUM'>('BASIC');
  const [devHours, setDevHours] = useState<number>(20);
  const [securitySuite, setSecuritySuite] = useState<boolean>(false);
  const [quoteCreated, setQuoteCreated] = useState<boolean>(false);

  const services: ServiceItem[] = [
    {
      id: 'srv-1',
      icon: Cloud,
      title: 'Kiến trúc hạ tầng Cloud & Di trú dữ liệu đa vùng',
      shortDesc: 'Thiết kế hệ thống đám mây có tính khả dụng cao sử dụng AWS, Azure, và Google Cloud với tiêu chuẩn IaC.',
      fullDesc: 'Chúng tôi xây dựng các phân vùng đáp ứng các quy chuẩn vận hành tốt nhất của doanh nghiệp. Đảm bảo nhân rộng dữ liệu liên vùng, tự động chuyển đổi dự phòng khi xảy ra sự cố lớn và quản lý tối ưu tài nguyên.',
      technologies: ['AWS Control Tower', 'Terraform', 'Azure Hub-Spoke', 'GCP Kubernetes', 'Aurora Global Database'],
      features: ['Hỗ trợ khôi phục thảm họa liên vùng (DR)', 'Báo cáo kiểm tra tối ưu hóa chi phí hàng tháng', 'Container hóa ứng dụng bằng Docker', 'Đánh giá mã nguồn IaC theo chuẩn AWS/Azure'],
      price: 3500
    },
    {
      id: 'srv-2',
      icon: ShieldAlert,
      title: 'Kiến trúc mạng Zero Trust & Bảo mật biên mạng',
      shortDesc: 'Bảo vệ cổng kết nối doanh nghiệp, nhân sự làm việc từ xa và cổng ứng dụng API sử dụng Cloudflare và Fortinet.',
      fullDesc: 'Mô hình bảo mật xác thực liên tục. Chúng tôi thay thế các cổng kết nối VPN truyền thống có nhiều rào cản bảo mật bằng chính sách xác thực SSO của Okta/EntraID, kiểm tra thiết bị đầu cuối và cấu hình tường lửa chuyên sâu.',
      technologies: ['Cloudflare Zero Trust', 'Tường lửa Fortinet UTM', 'MFA SSO (Okta, EntraID)', 'Bảo vệ WAF & Chặn tấn công DDoS'],
      features: ['Kiểm tra an toàn thiết bị liên tục', 'Cấp quyền truy cập granular ở mức API', 'Cổng proxy kết nối an toàn cho nhân sự từ xa', 'Kiểm toán đánh giá lỗ hổng định kỳ'],
      price: 2800
    },
    {
      id: 'srv-3',
      icon: Cpu,
      title: 'Xây dựng đường ống DevSecOps & Vận hành GitOps',
      shortDesc: 'Tự động hóa tích hợp và triển khai liên tục, tích hợp sẵn các lớp quét bảo mật mã nguồn tự động.',
      fullDesc: 'Quy trình triển khai mã nguồn tự động khi lập trình viên thực hiện commit. Các công cụ quét lỗ hổng thư viện và rò rỉ thông tin mật (Secrets) được kích hoạt ngay trong tiến trình build để loại bỏ lỗi sớm.',
      technologies: ['GitLab CI/CD', 'ArgoCD GitOps', 'SonarQube Quality Gates', 'Snyk & Trivy Scanners', 'GitHub Actions'],
      features: ['Chặn pipeline khi phát hiện lỗi bảo mật nghiêm trọng', 'Triển khai rolling không gián đoạn trên Kubernetes', 'Mô phỏng kiểm tra tải trọng ứng dụng', 'Hệ thống quản lý phiên bản đóng gói tập trung'],
      price: 3200
    },
    {
      id: 'srv-4',
      icon: Terminal,
      title: 'Kỹ nghệ phát triển ứng dụng SaaS Full-Stack',
      shortDesc: 'Phát triển backend hiệu năng cao và các giao diện bảng điều khiển quản trị trực quan, hiện đại.',
      fullDesc: 'Xây dựng hệ thống SaaS hoàn chỉnh từ bản vẽ thiết kế đến cơ sở dữ liệu vận hành thực tế. Chúng tôi phát triển các trang quản trị trực quan, phân tích dữ liệu chuyên sâu và kết nối API tối ưu.',
      technologies: ['React 19 / Next.js', 'Node.js Express / NestJS', 'PostgreSQL / MongoDB', 'Redis Caching', 'Docker Swarm'],
      features: ['Giao diện tương thích mọi màn hình di động/máy tính', 'Thiết kế cơ sở dữ liệu đa khách thuê (Multi-tenant)', 'Tài liệu hướng dẫn kết nối API tiêu chuẩn', 'Đồng bộ dữ liệu thời gian thực qua Websocket'],
      price: 4500
    },
    {
      id: 'srv-5',
      icon: Network,
      title: 'Triển khai Hệ thống Mạng SD-WAN & Định tuyến Router',
      shortDesc: 'Cấu hình liên kết định tuyến đa chi nhánh, tối ưu hóa đường truyền Internet và thiết lập mạng riêng VPN bảo mật.',
      fullDesc: 'Giải pháp SD-WAN giúp doanh nghiệp gộp và tối ưu băng thông của nhiều đường truyền Internet khác nhau. Tự động chuyển đổi dự phòng khi có đường truyền lỗi và mã hóa toàn bộ lưu lượng dữ liệu đi lại giữa các văn phòng chi nhánh.',
      technologies: ['Fortinet SD-WAN Orchestrator', 'Cisco Routers', 'Định tuyến động OSPF/BGP', 'IPSec VPN Tunneling'],
      features: ['Thiết lập VPN site-to-site bảo mật', 'Chính sách QoS ưu tiên cuộc gọi VoIP và họp trực tuyến', 'Tự động failover chuyển kênh dự phòng', 'Phân tích băng thông chi tiết từng chi nhánh'],
      price: 1800
    },
    {
      id: 'srv-6',
      icon: Wifi,
      title: 'Lắp đặt hạ tầng Wi-Fi doanh nghiệp mật độ cao & Cáp cấu trúc',
      shortDesc: 'Khảo sát vùng sóng, thi công đi dây cáp mạng chuẩn Cat6 và lắp đặt thiết bị phát sóng chuyên dụng hỗ trợ hàng trăm user.',
      fullDesc: 'Thiết lập vùng phủ sóng Wi-Fi liền mạch (Seamless Roaming) giúp người dùng di chuyển trong văn phòng không bị ngắt kết nối. Đi cáp mạng gọn gàng vào tủ Rack mạng trung tâm (MDF/IDF) tiêu chuẩn kỹ thuật.',
      technologies: ['UniFi Controller', 'Cisco Access Points', 'Cáp Cat6 AMP Commscope', 'Tủ Rack & Switch PoE'],
      features: ['Phủ sóng liền mạch seamless roaming', 'Phân tích mạng Wi-Fi khách hàng và nội bộ', 'Khảo sát đo đạc sóng RF chuyên sâu', 'Dán nhãn hệ thống cáp chuẩn sơ đồ kỹ thuật'],
      price: 2500
    },
    {
      id: 'srv-7',
      icon: Video,
      title: 'Hệ thống Giám sát Camera IP & Tổng đài điện thoại VoIP',
      shortDesc: 'Thiết lập camera giám sát độ nét cao, lưu trữ cloud/NAS bảo mật và giải pháp đàm thoại nội bộ chuyên nghiệp.',
      fullDesc: 'Giải pháp giám sát an ninh toàn diện tích hợp lưu trữ thông minh giúp phát hiện chuyển động lạ. Tổng đài VoIP giúp nhân viên đàm thoại nội bộ miễn phí giữa các văn phòng chi nhánh và quản trị dễ dàng qua giao diện web.',
      technologies: ['Hikvision / Dahua IP Cameras', 'Lưu trữ NAS Synology', 'Tổng đài Asterisk / Grandstream', 'Thiết bị điện thoại IP Phone'],
      features: ['Lưu trữ ghi hình camera tối thiểu 30 ngày', 'Phát hiện chuyển động thông minh bảo vệ điện thoại', 'Cấu hình lời chào tự động tổng đài IVR', 'Đàm thoại miễn phí giữa các chi nhánh liên tỉnh'],
      price: 1500
    },
    {
      id: 'srv-8',
      icon: Database,
      title: 'Quản trị Cơ sở dữ liệu & Tối ưu hóa truy vấn SQL/NoSQL',
      shortDesc: 'Thiết kế, cài đặt, sao lưu tự động và tối ưu hóa hiệu năng các hệ thống cơ sở dữ liệu lớn.',
      fullDesc: 'Chúng tôi cấu hình cụm cơ sở dữ liệu có độ tin cậy cao, phân tích đọc/ghi, lập chỉ mục tối ưu, sao lưu tự động hàng ngày lên S3/Cloud và khôi phục nhanh khi có sự cố.',
      technologies: ['PostgreSQL Replication', 'MongoDB Sharding', 'Redis Sentinel', 'PgBouncer', 'AWS RDS'],
      features: ['Cài đặt cụm cơ sở dữ liệu tự động failover', 'Tối ưu hóa chỉ mục & Giảm tải nghẽn truy vấn', 'Lập lịch sao lưu mã hóa tự động hàng ngày', 'Giám sát tài nguyên CPU/IOPS cơ sở dữ liệu 24/7'],
      price: 3000
    },
    {
      id: 'srv-9',
      icon: Activity,
      title: 'Giám sát hệ thống 24/7 & Hỗ trợ vận hành IT trọn gói',
      shortDesc: 'Giám sát hạ tầng thời gian thực, cảnh báo sự cố chủ động qua Telegram/Slack và điều phối kỹ thuật.',
      fullDesc: 'Dịch vụ MSP trọn gói giúp doanh nghiệp vận hành hệ thống an toàn. Chúng tôi thiết lập thu thập log, cảnh báo tự động khi CPU/RAM quá tải, và kỹ sư trực hỗ trợ xử lý sự cố ngay lập tức.',
      technologies: ['Prometheus & Grafana', 'ELK Stack', 'Zabbix', 'PagerDuty', 'Telegram Alert Bot'],
      features: ['Cảnh báo sự cố tức thời dưới 1 phút', 'Báo cáo hiệu năng và băng thông hàng tuần', 'Bảo trì định kỳ hệ điều hành và cập nhật bảo mật', 'Kỹ thuật viên túc trực hỗ trợ khẩn cấp 24/7'],
      price: 2000
    }
  ];

  const products: ProductItem[] = [
    {
      id: 'prod-1',
      name: 'Thiết bị Tường lửa Fortinet FortiGate 60F',
      brand: 'Fortinet',
      price: 1250,
      description: 'Thiết bị tường lửa bảo mật thế hệ mới (NGFW) bảo vệ mạng doanh nghiệp vừa và nhỏ, kiểm soát ứng dụng chuyên sâu và chống xâm nhập.',
      image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=400&auto=format&fit=crop',
      specs: ['Chống virus & Phần mềm độc hại', 'VPN IPSec mã hóa tốc độ cao', 'Kiểm soát nội dung Web & Ứng dụng']
    },
    {
      id: 'prod-2',
      name: 'Bộ phát Wi-Fi Ubiquiti UniFi AP AC Pro',
      brand: 'Ubiquiti',
      price: 220,
      description: 'Thiết bị phát sóng Wi-Fi băng tần kép ốp trần chịu tải lớn, hỗ trợ roaming không dây mượt mà cho hơn 200 người dùng đồng thời.',
      image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=400&auto=format&fit=crop',
      specs: ['Tốc độ tối đa 1750 Mbps', 'Roaming liền mạch không ngắt kết nối', 'Quản trị tập trung qua Controller']
    },
    {
      id: 'prod-3',
      name: 'Switch mạng Cisco Business CBS350-24P-4G',
      brand: 'Cisco',
      price: 850,
      description: 'Switch Layer 3 chuyên nghiệp với 24 cổng mạng tốc độ Gigabit cấp nguồn PoE+ hỗ trợ hoàn hảo cho hệ thống Camera IP và Access Point.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=400&auto=format&fit=crop',
      specs: ['24 cổng Gigabit PoE+ (195W)', '4 cổng SFP 1G Uplink', 'Quản lý nâng cao VLAN & QoS']
    },
    {
      id: 'prod-4',
      name: 'Bộ định tuyến Mikrotik RB5009UG+S+IN',
      brand: 'Mikrotik',
      price: 320,
      description: 'Router chịu tải cực mạnh cho văn phòng doanh nghiệp lớn, hỗ trợ cân bằng tải (Load Balancing) đa đường truyền WAN và định tuyến động.',
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=400&auto=format&fit=crop',
      specs: ['Cổng mạng 2.5G & SFP+ 10G', 'Chịu tải lên đến 500+ session', 'Hệ điều hành RouterOS chuyên sâu']
    },
    {
      id: 'prod-5',
      name: 'Thiết bị Lưu trữ NAS Synology DS923+',
      brand: 'Synology',
      price: 720,
      description: 'Thiết bị ổ cứng lưu trữ mạng 4 khay, giải pháp sao lưu (Backup) dữ liệu văn phòng tự động, chia sẻ file an toàn và đồng bộ hóa đám mây.',
      image: 'https://images.unsplash.com/photo-1601524589470-f7ecf50d3736?q=80&w=400&auto=format&fit=crop',
      specs: ['4 khay ổ cứng (Hỗ trợ nâng lên 9 khay)', 'Hệ điều hành DSM trực quan', 'Tích hợp backup đa nền tảng']
    },
    {
      id: 'prod-6',
      name: 'Thiết bị Tường lửa Fortinet FortiGate 40F',
      brand: 'Fortinet',
      price: 820,
      description: 'Giải pháp bảo mật mạng tối ưu cho các văn phòng chi nhánh nhỏ hoặc cửa hàng bán lẻ, hỗ trợ SD-WAN và tường lửa kiểm soát ứng dụng.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop',
      specs: ['Tích hợp bảo mật FortiGuard UTP', 'Hỗ trợ SD-WAN tối ưu hóa WAN', 'Quản lý tập trung qua Cloud']
    },
    {
      id: 'prod-7',
      name: 'Bộ phát Wi-Fi Ubiquiti UniFi U6 Pro',
      brand: 'Ubiquiti',
      price: 290,
      description: 'Access Point Wi-Fi 6 thế hệ mới hiệu năng cao, băng tần kép chịu tải cực lớn thích hợp cho môi trường văn phòng mật độ cao.',
      image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=400&auto=format&fit=crop',
      specs: ['Chuẩn Wi-Fi 6 tốc độ đến 5.3 Gbps', 'Hỗ trợ hơn 350+ thiết bị kết nối', 'Hỗ trợ cấp nguồn PoE tiện lợi']
    },
    {
      id: 'prod-8',
      name: 'Switch mạng Aruba Instant On 1930 24G 4SFP/SFP+',
      brand: 'Aruba',
      price: 460,
      description: 'Switch Gigabit quản trị thông minh (Smart Managed) với 24 cổng mạng tốc độ cao và 4 cổng SFP/SFP+ 10G uplink truyền dẫn dữ liệu cực nhanh.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=400&auto=format&fit=crop',
      specs: ['24 cổng mạng Gigabit Ethernet', '4 cổng SFP+ 10G Uplink', 'Quản trị dễ dàng qua Aruba Instant On App']
    },
    {
      id: 'prod-9',
      name: 'Thiết bị Lưu trữ NAS Synology DS224+',
      brand: 'Synology',
      price: 420,
      description: 'Giải pháp lưu trữ và sao lưu dữ liệu cá nhân/văn phòng nhỏ gọn 2 khay ổ cứng, hỗ trợ phân quyền truy cập và đồng bộ hóa đám mây.',
      image: 'https://images.unsplash.com/photo-1601524589470-f7ecf50d3736?q=80&w=400&auto=format&fit=crop',
      specs: ['2 khay ổ cứng (Tối đa 36 TB)', 'Bộ vi xử lý Intel Celeron mạnh mẽ', 'Tích hợp ứng dụng Synology Drive']
    }
  ];

  // Pricing helper calculations
  const getInfraPrice = (size: 'NONE' | 'SMALL' | 'MEDIUM' | 'LARGE') => {
    switch (size) {
      case 'SMALL': return 200;
      case 'MEDIUM': return 800;
      case 'LARGE': return 2500;
      default: return 0;
    }
  };

  const getMaintPrice = (lvl: 'NONE' | 'BASIC' | 'PREMIUM') => {
    switch (lvl) {
      case 'BASIC': return 500;
      case 'PREMIUM': return 1500;
      default: return 0;
    }
  };

  const monthlyTotal = getInfraPrice(infraSize) + getMaintPrice(maintenance) + (devHours * 100) + (securitySuite ? 450 : 0);

  // Quote Request for Services
  const handleServiceQuote = (srv: ServiceItem) => {
    if (!isAuthenticated) {
      navigate(PATHS.LOGIN);
      return;
    }
    dispatch(addQuotation({
      title: `Báo giá Dịch vụ: ${srv.title}`,
      cost: srv.price,
      details: `Yêu cầu dịch vụ kỹ thuật cho gói: ${srv.title}. Mô tả ngắn: ${srv.shortDesc}`,
      clientId: user?.id
    }));
    setSrvQuoteCreatedId(srv.id);
    setTimeout(() => setSrvQuoteCreatedId(null), 4000);
  };

  // Order Placement for Hardware Products
  const handleHardwareOrder = (prod: ProductItem) => {
    if (!isAuthenticated) {
      navigate(PATHS.LOGIN);
      return;
    }
    const qty = quantities[prod.id] || 1;
    dispatch(addOrder({
      itemName: `${prod.brand} ${prod.name}`,
      price: prod.price,
      quantity: qty,
      clientId: user?.id
    }));
    setProductOrderCreatedId(prod.id);
    setTimeout(() => setProductOrderCreatedId(null), 4000);
  };

  // Custom Quote Generation from Calculator
  const handleGenerateQuote = () => {
    if (!isAuthenticated) {
      navigate(PATHS.LOGIN);
      return;
    }
    const details = `Dự toán dịch vụ tự chọn:\n- Quy mô Cloud: ${infraSize} ($${getInfraPrice(infraSize)}/tháng)\n- Mức độ bảo trì SLA: ${maintenance} ($${getMaintPrice(maintenance)}/tháng)\n- Giờ phát triển bổ sung: ${devHours} giờ ($${devHours * 100}/tháng)\n- Gói bảo mật nâng cao: ${securitySuite ? 'Đã đăng ký' : 'Không đăng ký'} (${securitySuite ? '+$450' : '$0'})`;
    dispatch(addQuotation({
      title: 'Yêu cầu Báo giá Dự án Tùy chỉnh (Tự tính toán)',
      cost: monthlyTotal,
      details,
      clientId: user?.id
    }));
    setQuoteCreated(true);
    setTimeout(() => setQuoteCreated(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Unified Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
          Dịch vụ Kỹ thuật &{' '}
          <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-enterprise-accent-cyan bg-clip-text text-transparent">
            Thiết bị Chuyên dụng
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Chúng tôi cung cấp giải pháp đám mây, bảo mật Zero Trust, DevSecOps cùng danh mục thiết bị mạng chính hãng và công cụ tự tính toán báo giá tối ưu.
        </p>
      </div>

      {/* Unified Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/40 shadow-inner">
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
              activeTab === 'DIRECTORY'
                ? 'bg-white dark:bg-slate-950 text-brand-500 shadow-sm border border-slate-200/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4" />
            <span>Danh mục Dịch vụ</span>
          </button>
          
          <button
            onClick={() => setActiveTab('HARDWARE')}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
              activeTab === 'HARDWARE'
                ? 'bg-white dark:bg-slate-950 text-brand-500 shadow-sm border border-slate-200/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Thiết bị Mạng</span>
          </button>

          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
              activeTab === 'CALCULATOR'
                ? 'bg-white dark:bg-slate-950 text-brand-500 shadow-sm border border-slate-200/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Tự Tính Báo giá</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Directory grid */}
      {activeTab === 'DIRECTORY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {services.map((srv) => {
            const Icon = srv.icon;
            const isOpen = activeId === srv.id;
            return (
              <div
                key={srv.id}
                className={`glass-panel glass-panel-hover rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-brand-500 ring-2 ring-brand-500/10' : ''
                }`}
              >
                <div className="p-8 space-y-4 flex-1 text-left">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold font-mono text-brand-500 bg-brand-500/5 px-2 py-0.5 rounded-full shrink-0">
                      Từ ${srv.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed line-clamp-2">
                      {srv.shortDesc}
                    </p>
                  </div>

                  {/* Expandable details toggle */}
                  <button
                    onClick={() => setActiveId(isOpen ? null : srv.id)}
                    className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center space-x-1 focus:outline-none cursor-pointer"
                  >
                    <span>{isOpen ? 'Thu gọn chi tiết' : 'Xem công nghệ & bàn giao'}</span>
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {/* Expandable body */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-3.5 border-t border-slate-105/40 dark:border-slate-800/40 overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                          {srv.fullDesc}
                        </p>

                        {/* Tech badges */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Công nghệ sử dụng</h4>
                          <div className="flex flex-wrap gap-1">
                            {srv.technologies.map(t => (
                              <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[9px] font-mono text-slate-650 dark:text-slate-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Deliverables checklist */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tiêu chuẩn đi kèm</h4>
                          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                            {srv.features.map(f => (
                              <li key={f} className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-1.5 shrink-0" />
                                <span className="text-[11px] leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer price & action */}
                <div className="p-8 bg-slate-50/50 dark:bg-slate-950/10 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Dự toán chi phí</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center">
                      <DollarSign className="h-4 w-4 text-brand-500" />
                      <span>{srv.price.toLocaleString()}</span>
                    </span>
                  </div>

                  {srvQuoteCreatedId === srv.id ? (
                    <div className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 animate-bounce" />
                      <span>Đã yêu cầu!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleServiceQuote(srv)}
                      className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-[11px] shadow-sm transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>{isAuthenticated ? 'Yêu cầu Báo giá' : 'Đăng nhập'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Hardware grid */}
      {activeTab === 'HARDWARE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {products.map((prod) => {
            return (
              <div
                key={prod.id}
                className="glass-panel glass-panel-hover rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-750">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{prod.brand}</span>
                  </div>
                </div>

                <div className="p-8 space-y-4 flex-1 text-left">
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-550 dark:text-slate-455 leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  {/* Specs checklist */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Thông số nổi bật</h4>
                    <ul className="space-y-1.5 text-xs text-slate-550 dark:text-slate-405">
                      {prod.specs.map((spec, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="h-1.5 w-1.5 bg-brand-500 rounded-full shrink-0" />
                          <span className="text-[11px] leading-snug">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Số lượng đặt mua</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setQuantities({ ...quantities, [prod.id]: Math.max(1, (quantities[prod.id] || 1) - 1) })}
                        className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-all text-xs focus:outline-none cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white w-5 text-center">
                        {quantities[prod.id] || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantities({ ...quantities, [prod.id]: Math.min(99, (quantities[prod.id] || 1) + 1) })}
                        className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-all text-xs focus:outline-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer price & buy action */}
                <div className="p-8 bg-slate-50/50 dark:bg-slate-950/10 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                      {(quantities[prod.id] || 1) > 1 ? `Giá (${quantities[prod.id] || 1} cái)` : 'Giá thiết bị'}
                    </span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center">
                      <DollarSign className="h-4 w-4 text-brand-500" />
                      <span>{(prod.price * (quantities[prod.id] || 1)).toLocaleString()}</span>
                    </span>
                  </div>

                  {productOrderCreatedId === prod.id ? (
                    <div className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 animate-bounce" />
                      <span>Đặt thành công (SL: {quantities[prod.id] || 1})!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleHardwareOrder(prod)}
                      className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-[11px] shadow-sm transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>{isAuthenticated ? 'Đặt hàng ngay' : 'Đăng nhập'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Budget Calculator */}
      {activeTab === 'CALCULATOR' && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 sm:p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.04] pointer-events-none" />
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800/80 pb-4 text-left relative z-10">
              <Calculator className="h-5 w-5 text-brand-500 mr-2" />
              <span>Dự toán Chi phí Dự án Tùy chỉnh</span>
            </h2>

            {/* Cloud Infrastructure Selector */}
            <div className="space-y-2.5 text-left relative z-10">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Ngân sách vận hành Cloud hàng tháng
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['NONE', 'SMALL', 'MEDIUM', 'LARGE'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setInfraSize(size)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      infraSize === size
                        ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold">
                      {size === 'NONE' && 'Không'}
                      {size === 'SMALL' && 'Nhỏ'}
                      {size === 'MEDIUM' && 'Vừa'}
                      {size === 'LARGE' && 'Lớn'}
                    </div>
                    <div className="text-[9px] text-slate-450 mt-0.5 font-mono">
                      {size === 'NONE' && '$0'}
                      {size === 'SMALL' && '$200'}
                      {size === 'MEDIUM' && '$800'}
                      {size === 'LARGE' && '$2.5k'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance Support Level */}
            <div className="space-y-2.5 text-left relative z-10">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Mức độ cam kết hỗ trợ kỹ thuật SLA
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['NONE', 'BASIC', 'PREMIUM'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setMaintenance(lvl)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      maintenance === lvl
                        ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold">
                      {lvl === 'NONE' && 'Không'}
                      {lvl === 'BASIC' && 'Cơ bản (8x5)'}
                      {lvl === 'PREMIUM' && 'Cao cấp (24x7)'}
                    </div>
                    <div className="text-[9px] text-slate-450 mt-0.5 font-mono">
                      {lvl === 'NONE' && '$0'}
                      {lvl === 'BASIC' && '$500'}
                      {lvl === 'PREMIUM' && '$1.5k'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom dev hours slider */}
            <div className="space-y-2.5 text-left relative z-10">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                  Số giờ hỗ trợ phát triển (Dev)
                </label>
                <span className="text-xs font-bold font-mono text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full">
                  {devHours} giờ/tháng
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={devHours}
                onChange={(e) => setDevHours(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[9px] text-slate-450 font-semibold font-mono">
                <span>0 giờ</span>
                <span>40 giờ</span>
                <span>80 giờ ($8k)</span>
              </div>
            </div>

            {/* Security Suite checkbox */}
            <div className="flex items-center justify-between p-3.5 border border-slate-200/50 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 relative z-10">
              <div className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="security"
                  checked={securitySuite}
                  onChange={(e) => setSecuritySuite(e.target.checked)}
                  className="mt-1 h-4.5 w-4.5 text-brand-600 border-slate-350 dark:border-slate-800 rounded focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="security" className="select-none cursor-pointer text-left">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white leading-none">Bổ sung Gói Bảo mật Cao cấp</span>
                  <span className="block text-[10px] text-slate-500 mt-1">Hệ thống WAF và kiểm toán an ninh bảo mật hàng tuần</span>
                </label>
              </div>
              <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 shrink-0">+$450</span>
            </div>

            {/* Calculated output */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4 relative z-10">
              <div className="flex justify-between items-baseline text-left">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Chi phí Ước tính:</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center font-mono">
                  <DollarSign className="h-6 w-6 text-brand-500 shrink-0" />
                  <span>{monthlyTotal.toLocaleString()}</span>
                  <span className="text-xs text-slate-405 font-sans font-normal ml-1">/ tháng</span>
                </span>
              </div>

              {quoteCreated ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
                  <span>Đã ghi nhận yêu cầu Báo giá nháp vào Portal!</span>
                </div>
              ) : (
                <button
                  onClick={handleGenerateQuote}
                  className="w-full flex justify-center items-center py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer text-sm"
                >
                  <PlusCircle className="h-4.5 w-4.5 mr-2" />
                  <span>{isAuthenticated ? 'Yêu cầu Báo giá trong Portal' : 'Đăng nhập để nhận Báo giá'}</span>
                </button>
              )}
              <p className="text-[10px] text-slate-455 text-center font-medium leading-normal">
                Báo giá trên mang tính chất ước lượng tham khảo dựa trên quy mô hạ tầng. Chi phí thực tế sẽ dựa trên hợp đồng thỏa thuận dịch vụ.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
