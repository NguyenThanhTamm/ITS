import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addQuotation, addOrder } from '@/store/dashboardSlice';
import { PATHS } from '@/routes/paths';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  Cloud,
  ShieldAlert,
  Cpu,
  Terminal,
  ChevronDown,
  ChevronUp,
  Server,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  Wifi,
  Network,
  Video,
  Database,
  Activity,
  ShoppingCart,
  Search,
  Grid,
  Tag
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

type ProductItem = Product;

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'HARDWARE'>('DIRECTORY');

  // Accordion active index for services
  const [activeId, setActiveId] = useState<string | null>('srv-1');

  // Quotation confirmation state for services
  const [srvQuoteCreatedId, setSrvQuoteCreatedId] = useState<string | null>(null);

  // Order confirmation state for hardware products
  const [productOrderCreatedId, setProductOrderCreatedId] = useState<string | null>(null);

  // Quantity selector state for products
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Product Catalog search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DEVICE' | 'CABLE' | 'ACCESSORY'>('ALL');

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
      features: ['Kiểm tra an toàn thiết bị liên tục', 'Cổng proxy kết nối an toàn cho nhân sự từ xa', 'Kiểm toán đánh giá lỗ hổng định kỳ'],
      price: 2800
    },
    {
      id: 'srv-3',
      icon: Cpu,
      title: 'Xây dựng đường ống DevSecOps & Vận hành GitOps',
      shortDesc: 'Tự động hóa tích hợp và triển khai liên tục, tích hợp sẵn các lớp quét bảo mật mã nguồn tự động.',
      fullDesc: 'Quy trình triển khai mã nguồn tự động khi lập trình viên thực hiện commit. Các công cụ quét lỗ hổng thư viện và rò rỉ thông tin mật (Secrets) được kích hoạt ngay trong tiến trình build để loại bỏ lỗi sớm.',
      technologies: ['GitLab CI/CD', 'ArgoCD GitOps', 'SonarQube Quality Gates', 'Snyk & Trivy Scanners', 'GitHub Actions'],
      features: ['Chặn pipeline khi phát hiện lỗi bảo mật nghiêm trọng', 'Triển khai rolling không gián đoạn trên Kubernetes', 'Mô phỏng kiểm tra tải trọng ứng dụng'],
      price: 3200
    },
    {
      id: 'srv-4',
      icon: Terminal,
      title: 'Kỹ nghệ phát triển ứng dụng SaaS Full-Stack',
      shortDesc: 'Phát triển backend hiệu năng cao và các giao diện bảng điều khiển quản trị trực quan, hiện đại.',
      fullDesc: 'Xây dựng hệ thống SaaS hoàn chỉnh từ bản vẽ thiết kế đến cơ sở dữ liệu vận hành thực tế. Chúng tôi phát triển các trang quản trị trực quan, phân tích dữ liệu chuyên sâu và kết nối API tối ưu.',
      technologies: ['React 19 / Next.js', 'Node.js Express / NestJS', 'PostgreSQL / MongoDB', 'Redis Caching', 'Docker Swarm'],
      features: ['Giao diện tương thích mọi màn hình di động/máy tính', 'Thiết kế cơ sở dữ liệu đa khách thuê (Multi-tenant)', 'Tài liệu hướng dẫn kết nối API tiêu chuẩn'],
      price: 4500
    },
    {
      id: 'srv-5',
      icon: Network,
      title: 'Triển khai Hệ thống Mạng SD-WAN & Định tuyến Router',
      shortDesc: 'Cấu hình liên kết định tuyến đa chi nhánh, tối ưu hóa đường truyền Internet và thiết lập mạng riêng VPN bảo mật.',
      fullDesc: 'Giải pháp SD-WAN giúp doanh nghiệp gộp và tối ưu băng thông của nhiều đường truyền Internet khác nhau. Tự động chuyển đổi dự phòng khi có đường truyền lỗi và mã hóa toàn bộ lưu lượng dữ liệu đi lại giữa các văn phòng chi nhánh.',
      technologies: ['Fortinet SD-WAN Orchestrator', 'Cisco Routers', 'Định tuyến động OSPF/BGP', 'IPSec VPN Tunneling'],
      features: ['Thiết lập VPN site-to-site bảo mật', 'Chính sách QoS ưu tiên cuộc gọi VoIP', 'Tự động failover chuyển kênh dự phòng'],
      price: 1800
    },
    {
      id: 'srv-6',
      icon: Wifi,
      title: 'Lắp đặt hạ tầng Wi-Fi doanh nghiệp mật độ cao & Cáp cấu trúc',
      shortDesc: 'Khảo sát vùng sóng, thi công đi dây cáp mạng chuẩn Cat6 và lắp đặt thiết bị phát sóng chuyên dụng hỗ trợ hàng trăm user.',
      fullDesc: 'Thiết lập vùng phủ sóng Wi-Fi liền mạch (Seamless Roaming) giúp người dùng di chuyển trong văn phòng không bị ngắt kết nối. Đi cáp mạng gọn gàng vào tủ Rack mạng trung tâm (MDF/IDF) tiêu chuẩn kỹ thuật.',
      technologies: ['UniFi Controller', 'Cisco Access Points', 'Cáp Cat6 AMP Commscope', 'Tủ Rack & Switch PoE'],
      features: ['Phủ sóng liền mạch seamless roaming', 'Phân tích mạng Wi-Fi khách hàng và nội bộ', 'Khảo sát đo đạc sóng RF chuyên sâu'],
      price: 2500
    },
    {
      id: 'srv-7',
      icon: Video,
      title: 'Hệ thống Giám sát Camera IP & Tổng đài điện thoại VoIP',
      shortDesc: 'Thiết lập camera giám sát độ nét cao, lưu trữ cloud/NAS bảo mật và giải pháp đàm thoại nội bộ chuyên nghiệp.',
      fullDesc: 'Giải pháp giám sát an ninh toàn diện tích hợp lưu trữ thông minh giúp phát hiện chuyển động lạ. Tổng đài VoIP giúp nhân viên đàm thoại nội bộ miễn phí giữa các văn phòng chi nhánh và quản trị dễ dàng qua giao diện web.',
      technologies: ['Hikvision / Dahua IP Cameras', 'Lưu trữ NAS Synology', 'Tổng đài Asterisk / Grandstream', 'Thiết bị điện thoại IP Phone'],
      features: ['Lưu trữ ghi hình camera tối thiểu 30 ngày', 'Phát hiện chuyển động thông minh', 'Cấu hình lời chào tự động tổng đài IVR'],
      price: 1500
    },
    {
      id: 'srv-8',
      icon: Database,
      title: 'Quản trị Cơ sở dữ liệu & Tối ưu hóa truy vấn SQL/NoSQL',
      shortDesc: 'Thiết kế, cài đặt, sao lưu tự động và tối ưu hóa hiệu năng các hệ thống cơ sở dữ liệu lớn.',
      fullDesc: 'Chúng tôi cấu hình cụm cơ sở dữ liệu có độ tin cậy cao, phân tích đọc/ghi, lập chỉ mục tối ưu, sao lưu tự động hàng ngày lên S3/Cloud và khôi phục nhanh khi có sự cố.',
      technologies: ['PostgreSQL Replication', 'MongoDB Sharding', 'Redis Sentinel', 'PgBouncer', 'AWS RDS'],
      features: ['Cài đặt cụm cơ sở dữ liệu tự động failover', 'Tối ưu hóa chỉ mục & Giảm tải nghẽn truy vấn', 'Lập lịch sao lưu dữ liệu tự động'],
      price: 3000
    },
    {
      id: 'srv-9',
      icon: Activity,
      title: 'Giám sát hệ thống 24/7 & Hỗ trợ vận hành IT trọn gói',
      shortDesc: 'Giám sát hạ tầng thời gian thực, cảnh báo sự cố chủ động qua Telegram/Slack và điều phối kỹ thuật.',
      fullDesc: 'Dịch vụ MSP trọn gói giúp doanh nghiệp vận hành hệ thống an toàn. Chúng tôi thiết lập thu thập log, cảnh báo tự động khi CPU/RAM quá tải, và kỹ sư trực hỗ trợ xử lý sự cố ngay lập tức.',
      technologies: ['Prometheus & Grafana', 'ELK Stack', 'Zabbix', 'PagerDuty', 'Telegram Alert Bot'],
      features: ['Cảnh báo sự cố tức thời dưới 1 phút', 'Báo cáo hiệu năng và băng thông hàng tuần', 'Bảo trì định kỳ hệ điều hành và cập nhật bảo mật'],
      price: 2000
    }
  ];

  const products_old: any[] = [
    {
      id: 'prod-1',
      name: 'Thiết bị Tường lửa Fortinet FortiGate 60F',
      brand: 'Fortinet',
      price: 1250,
      description: 'Thiết bị tường lửa bảo mật thế hệ mới (NGFW) bảo vệ mạng doanh nghiệp vừa và nhỏ, kiểm soát ứng dụng chuyên sâu và chống xâm nhập.',
      image: 'https://viettuans.vn/uploads/2022/11/fg-60f.jpg',
      specs: ['Chống virus & Phần mềm độc hại', 'VPN IPSec tốc độ 6.5 Gbps', 'Kiểm soát nội dung Web & Ứng dụng'],
      category: 'DEVICE'
    },
    {
      id: 'prod-2',
      name: 'Bộ phát Wi-Fi Ubiquiti UniFi AP AC Pro',
      brand: 'Ubiquiti',
      price: 220,
      description: 'Thiết bị phát sóng Wi-Fi băng tần kép ốp trần chịu tải lớn, hỗ trợ roaming không dây mượt mà cho hơn 200 người dùng đồng thời.',
      image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=400&auto=format&fit=crop',
      specs: ['Tốc độ tối đa 1750 Mbps', 'Roaming liền mạch không ngắt kết nối', 'Quản trị tập trung qua Controller'],
      category: 'DEVICE'
    },
    {
      id: 'prod-3',
      name: 'Switch mạng Cisco Business CBS350-24P-4G',
      brand: 'Cisco',
      price: 850,
      description: 'Switch Layer 3 chuyên nghiệp với 24 cổng mạng tốc độ Gigabit cấp nguồn PoE+ hỗ trợ hoàn hảo cho hệ thống Camera IP và Access Point.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=400&auto=format&fit=crop',
      specs: ['24 cổng Gigabit PoE+ (195W)', '4 cổng SFP 1G Uplink', 'Quản lý nâng cao VLAN & QoS'],
      category: 'DEVICE'
    },
    {
      id: 'prod-4',
      name: 'Bộ định tuyến Mikrotik RB5009UG+S+IN',
      brand: 'Mikrotik',
      price: 320,
      description: 'Router chịu tải cực mạnh cho văn phòng doanh nghiệp lớn, hỗ trợ cân bằng tải (Load Balancing) đa đường truyền WAN và định tuyến động.',
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=400&auto=format&fit=crop',
      specs: ['Cổng mạng 2.5G & SFP+ 10G', 'Chịu tải lên đến 500+ session', 'Hệ điều hành RouterOS chuyên sâu'],
      category: 'DEVICE'
    },
    {
      id: 'prod-5',
      name: 'Thiết bị Lưu trữ NAS Synology DS923+',
      brand: 'Synology',
      price: 720,
      description: 'Thiết bị ổ cứng lưu trữ mạng 4 khay, giải pháp sao lưu (Backup) dữ liệu văn phòng tự động, chia sẻ file an toàn và đồng bộ hóa đám mây.',
      image: 'https://images.unsplash.com/photo-1601524589470-f7ecf50d3736?q=80&w=400&auto=format&fit=crop',
      specs: ['4 khay ổ cứng (Hỗ trợ tối đa 9 khay)', 'Hệ điều hành DSM trực quan', 'Tích hợp backup đa nền tảng'],
      category: 'DEVICE'
    },
    {
      id: 'prod-6',
      name: 'Thiết bị Tường lửa Fortinet FortiGate 40F',
      brand: 'Fortinet',
      price: 820,
      description: 'Giải pháp bảo mật mạng tối ưu cho các văn phòng chi nhánh nhỏ hoặc cửa hàng bán lẻ, hỗ trợ SD-WAN và tường lửa kiểm soát ứng dụng.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop',
      specs: ['Tích hợp bảo mật FortiGuard UTP', 'Hỗ trợ SD-WAN tối ưu hóa WAN', 'Quản lý tập trung qua Cloud'],
      category: 'DEVICE'
    },
    {
      id: 'prod-7',
      name: 'Bộ phát Wi-Fi Ubiquiti UniFi U6 Pro',
      brand: 'Ubiquiti',
      price: 290,
      description: 'Access Point Wi-Fi 6 thế hệ mới hiệu năng cao, băng tần kép chịu tải cực lớn thích hợp cho môi trường văn phòng mật độ cao.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
      specs: ['Chuẩn Wi-Fi 6 tốc độ đến 5.3 Gbps', 'Hỗ trợ hơn 350+ thiết bị kết nối', 'Hỗ trợ cấp nguồn PoE tiện lợi'],
      category: 'DEVICE'
    },
    {
      id: 'prod-8',
      name: 'Switch mạng Aruba Instant On 1930 24G 4SFP/SFP+',
      brand: 'Aruba',
      price: 460,
      description: 'Switch Gigabit quản trị thông minh (Smart Managed) với 24 cổng mạng tốc độ cao và 4 cổng SFP/SFP+ 10G uplink truyền dẫn dữ liệu cực nhanh.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop',
      specs: ['24 cổng mạng Gigabit Ethernet', '4 cổng SFP+ 10G Uplink', 'Quản trị dễ dàng qua Aruba Instant On App'],
      category: 'DEVICE'
    },
    {
      id: 'prod-9',
      name: 'Thiết bị Lưu trữ NAS Synology DS224+',
      brand: 'Synology',
      price: 420,
      description: 'Giải pháp lưu trữ và sao lưu dữ liệu cá nhân/văn phòng nhỏ gọn 2 khay ổ cứng, hỗ trợ phân quyền truy cập và đồng bộ hóa đám mây.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      specs: ['2 khay ổ cứng (Tối đa 36 TB)', 'Bộ vi xử lý Intel Celeron mạnh mẽ', 'Tích hợp ứng dụng Synology Drive'],
      category: 'DEVICE'
    },
    {
      id: 'prod-10',
      name: 'Cuộn Cáp mạng CommScope AMP Cat6 UTP 305m',
      brand: 'CommScope',
      price: 145,
      description: 'Cáp mạng Cat6 UTP chính hãng CommScope lõi đồng nguyên chất truyền dẫn Gigabit ổn định, chuyên dụng đi dây văn phòng và dự án.',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=400&auto=format&fit=crop',
      specs: ['Chiều dài tiêu chuẩn 305 mét', 'Băng thông đạt chuẩn 250 MHz', 'Độ dày lõi 23 AWG đồng nguyên chất'],
      category: 'CABLE'
    },
    {
      id: 'prod-11',
      name: 'Hộp 100 đầu bấm mạng RJ45 CommScope Cat6 bọc kim',
      brand: 'CommScope',
      price: 48,
      description: 'Đầu bấm mạng RJ45 Cat6 bọc kim loại chống nhiễu cao cấp, chân tiếp điểm mạ vàng chống oxy hóa tăng hiệu suất kết nối.',
      image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=400&auto=format&fit=crop',
      specs: ['Hộp 100 hạt mạng RJ45', 'Thiết kế sắt bọc kim chống nhiễu', 'Phù hợp cáp Cat6 và Cat6A'],
      category: 'CABLE'
    },
    {
      id: 'prod-12',
      name: 'Cuộn Cáp mạng Cat6A SFTP Golden Link chống nhiễu 305m',
      brand: 'Golden Link',
      price: 185,
      description: 'Cáp mạng SFTP Cat6A chống nhiễu kép (lưới nhôm + lá bạc), lõi đồng pha hợp kim cao cấp đạt chuẩn truyền dữ liệu 10Gbps.',
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=400&auto=format&fit=crop',
      specs: ['Lớp chống nhiễu kép SFTP', 'Băng thông tối đa 500 MHz', 'Phù hợp chạy ngoài trời và âm tường'],
      category: 'CABLE'
    },
    {
      id: 'prod-13',
      name: 'Hộp 100 đầu bấm mạng RJ45 AMP Cat5e nhựa dẻo',
      brand: 'AMP / CommScope',
      price: 22,
      description: 'Hạt mạng RJ45 Cat5e chất lượng cao, nhựa dẻo dai chống gãy lẫy khi cắm rút nhiều lần, tiếp điểm lá đồng dẫn điện tốt.',
      image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=400&auto=format&fit=crop',
      specs: ['Hộp 100 hạt mạng Cat5e', 'Nhựa dẻo chịu lực đàn hồi', 'Tiếp điểm lá đồng nguyên chất'],
      category: 'CABLE'
    },
    {
      id: 'prod-14',
      name: 'Thanh quản lý Cáp Patch Panel 24-Port Cat6 CommScope',
      brand: 'CommScope',
      price: 85,
      description: 'Thanh Patch Panel 24 cổng RJ45 chuẩn rack 19 inch giúp gom gọn và quản lý sơ đồ đấu nối cáp mạng tập trung trong tủ Rack.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=200&auto=format&fit=crop',
      specs: ['Độ cao tiêu chuẩn 1U Rackmount', 'Gồm 24 cổng Cat6 RJ45', 'Nhãn đấu nối số thứ tự rõ ràng'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-15',
      name: 'Vòng cao su đánh dấu số dây mạng từ 0-9 Cat6',
      brand: 'OEM',
      price: 6,
      description: 'Bộ vòng đánh số cao su từ 0 đến 9 nhiều màu sắc phân biệt giúp định danh các đường dây mạng trong phòng máy Server dễ dàng.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      specs: ['Gồm 10 cuộn đánh số 0-9', 'Màu sắc phân biệt tiêu chuẩn', 'Dùng chung cáp Cat5e và Cat6'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-16',
      name: 'Kìm bấm mạng đa năng CommScope Pro-Crimper',
      brand: 'CommScope',
      price: 95,
      description: 'Kìm chuyên dụng cho kỹ thuật viên mạng, tích hợp bấm đầu RJ45/RJ11, tuốt vỏ cáp mạng và cắt dây gọn gàng, trợ lực bấm nhẹ nhàng.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop',
      specs: ['Chất liệu thép cacbon siêu bền', 'Bấm RJ45 Cat5e/Cat6 và RJ11', 'Tay cầm bọc cao su chống mỏi'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-17',
      name: 'Tủ Rack Mạng Treo Tường 9U D500 cửa lưới',
      brand: 'VietRack',
      price: 115,
      description: 'Tủ đựng thiết bị mạng 9U sâu 500mm treo tường chắc chắn, cửa lưới thông thoáng khí, sơn tĩnh điện đen chống han gỉ.',
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=200&auto=format&fit=crop',
      specs: ['Kích thước H480 x W550 x D500', 'Mặt trước cửa lưới sắt tổ ong', 'Tích hợp quạt tản nhiệt & nguồn 6 port'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-18',
      name: 'Dây nhảy cáp mạng đúc sẵn Patch Cord Cat6 CommScope 3m',
      brand: 'CommScope',
      price: 9,
      description: 'Dây cáp mạng nhảy đúc sẵn hai đầu RJ45 Cat6 chất lượng cao dài 3m màu xanh dương, lõi đồng nguyên chất kết nối ổn định.',
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=200&auto=format&fit=crop',
      specs: ['Độ dài dây 3 mét', 'Hai đầu đúc nhựa bảo vệ đầu bấm', 'Chuẩn cáp Cat6 đồng nguyên chất'],
      category: 'CABLE'
    },
    {
      id: 'prod-19',
      name: 'Bộ phát Wi-Fi 6 Aruba Instant On AP22 Cloud Managed',
      brand: 'Aruba',
      price: 195,
      description: 'Thiết bị phát sóng Wi-Fi 6 chuyên nghiệp chịu tải hơn 75 user hoạt động đồng thời, cấu hình qua Cloud và App di động miễn phí.',
      image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=200&auto=format&fit=crop',
      specs: ['Chuẩn Wi-Fi 6 tốc độ 1.7 Gbps', 'Hỗ trợ Mesh mạng không dây', 'Tích hợp bảo mật WPA2/WPA3 tối tân'],
      category: 'DEVICE'
    },
    {
      id: 'prod-20',
      name: 'Switch mạng PoE Ubiquiti UniFi USW-24-POE Smart Managed',
      brand: 'Ubiquiti',
      price: 495,
      description: 'Switch POE quản trị 24 cổng Gigabit, cấp nguồn POE+ tổng công suất 95W tương thích tốt với camera IP và AP Wifi UniFi.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=200&auto=format&fit=crop',
      specs: ['16 cổng PoE+ Gigabit & 8 cổng Gigabit', '2 cổng SFP 1G Uplink', 'Quản trị UniFi Controller tập trung'],
      category: 'DEVICE'
    },
    {
      id: 'prod-21',
      name: 'Thiết bị Tường lửa Sophos XGS 116 Security Gateway',
      brand: 'Sophos',
      price: 980,
      description: 'Tường lửa Sophos thế hệ mới tích hợp chip xử lý Xstream bảo vệ mạng chống phần mềm tống tiền ransomware và tấn công đa lớp.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop',
      specs: ['Chip bảo mật Xstream chuyên biệt', 'Băng thông tường lửa lên tới 7.7 Gbps', 'Hỗ trợ VPN SSL/IPSec an toàn cao'],
      category: 'DEVICE'
    },
    {
      id: 'prod-22',
      name: 'Router định tuyến DrayTek Vigor2927 Dual-WAN',
      brand: 'DrayTek',
      price: 190,
      description: 'Router cân bằng tải Dual-WAN chuyên dụng cho doanh nghiệp vừa và nhỏ, chạy mượt mà ổn định VPN site-to-site và dịch vụ IP tĩnh.',
      image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=200&auto=format&fit=crop',
      specs: ['2 cổng WAN Gigabit cân bằng tải', 'Khả năng chịu tải tối đa 150 user', 'Quản lý băng thông QoS chi tiết'],
      category: 'DEVICE'
    },
    {
      id: 'prod-23',
      name: 'Bộ phát Wi-Fi 6 Ruckus ZoneFlex R550 cao cấp',
      brand: 'Ruckus',
      price: 650,
      description: 'Thiết bị phát sóng Wifi 6 thuộc phân khúc doanh nghiệp cao cấp, anten thích ứng BeamFlex+ giúp mở rộng phủ sóng tối đa và lọc nhiễu tốt.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop',
      specs: ['Ăng-ten thích ứng BeamFlex+', 'Chịu tải lý thuyết đến 512 thiết bị', 'Tốc độ tối đa đạt 1.8 Gbps'],
      category: 'DEVICE'
    },
    {
      id: 'prod-24',
      name: 'Switch mạng Cisco Catalyst C9200L-24T-4G-E',
      brand: 'Cisco',
      price: 2100,
      description: 'Switch Layer 3 Catalyst cao cấp dòng doanh nghiệp lớn, tích hợp quản lý thông qua Cisco DNA Center bảo mật thông tin an toàn.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=300&auto=format&fit=crop',
      specs: ['24 cổng mạng Gigabit Ethernet', '4 cổng 1G Uplink cố định', 'Hỗ trợ StackWise liên kết các switch'],
      category: 'DEVICE'
    },
    {
      id: 'prod-25',
      name: 'Thùng Cáp mạng Alantek Cat6 UTP 305m lõi đồng',
      brand: 'Alantek',
      price: 125,
      description: 'Cáp mạng Cat6 lõi đồng đặc nguyên chất chính hãng Alantek Mỹ, khoảng cách truyền tải lên đến 100m không suy hao tín hiệu.',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=200&auto=format&fit=crop',
      specs: ['Chiều dài tiêu chuẩn 305 mét', 'Lõi đồng 23 AWG chống nhiễu chữ thập', 'Đạt chứng nhận tiêu chuẩn UL quốc tế'],
      category: 'CABLE'
    },
    {
      id: 'prod-26',
      name: 'Hộp 50 đầu bấm mạng RJ45 Cat6A Golden Link',
      brand: 'Golden Link',
      price: 35,
      description: 'Đầu bấm mạng RJ45 chuẩn Cat6A bọc kim loại chống nhiễu, đi kèm kẹp kim loại giữ đuôi cáp chắc chắn khi đi dây Server 10Gbps.',
      image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=300&auto=format&fit=crop',
      specs: ['Hộp 50 hạt mạng cao cấp', 'Vỏ sắt mạ niken chống gỉ chống nhiễu', 'Tiếp điểm mạ vàng chống oxy hóa dày'],
      category: 'CABLE'
    },
    {
      id: 'prod-27',
      name: 'Tủ mạng Rack 15U D600 tự đứng chuyên nghiệp',
      brand: 'VietRack',
      price: 195,
      description: 'Tủ mạng tự đứng Rack 15U chiều sâu 600mm, sơn tĩnh điện, tích hợp bánh xe di chuyển và khóa bảo vệ 2 bên hông chắc chắn.',
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=300&auto=format&fit=crop',
      specs: ['Kích thước H800 x W600 x D600', 'Cửa lưới mắt tổ ong thông gió trước sau', 'Kèm 2 quạt thông gió tủ & ổ cắm PDU 6 port'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-28',
      name: 'Bộ vòng đánh số dây mạng loại kẹp dẹt Cat6',
      brand: 'OEM',
      price: 8,
      description: 'Vòng nhựa kẹp đánh số từ 0 đến 9 dạng cài mở bên hông tiện lợi, gá trực tiếp vào dây cáp mạng đã bấm đầu mà không cần luồn dây trước.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=300&auto=format&fit=crop',
      specs: ['Dạng kẹp mở bên tiện lợi', 'Đầy đủ bộ ký tự từ số 0-9', 'Phù hợp dây mạng Cat5e/Cat6/Cat6A'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-29',
      name: 'Thiết bị kiểm tra đo test cáp mạng Noyafa NF-308',
      brand: 'Noyafa',
      price: 65,
      description: 'Thiết bị đo thông mạch cáp mạng thông minh, tìm vị trí sợi dây mạng bị đứt, đo khoảng cách chiều dài cáp mạng chuẩn xác.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200&auto=format&fit=crop',
      specs: ['Màn hình LCD hiển thị kết quả đo', 'Định vị điểm đứt và lỗi đấu đầu hạt mạng', 'Kèm bộ dò tín hiệu không dây'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-30',
      name: 'Dây cáp mạng nhảy Patch Cord Cat6 CommScope 1.5m',
      brand: 'CommScope',
      price: 7,
      description: 'Dây mạng nhảy đúc sẵn hai đầu RJ45 Cat6 dài 1.5m màu xanh dương chính hãng, dùng kết nối thiết bị từ Switch sang Patch panel.',
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=300&auto=format&fit=crop',
      specs: ['Độ dài cáp mạng nhảy 1.5 mét', 'Lõi đồng 24 AWG truyền tải Gigabit', 'Vỏ bọc nhựa bảo vệ chốt RJ45'],
      category: 'CABLE'
    },
    {
      id: 'prod-31',
      name: 'Bộ phát Wi-Fi 6 Linksys Atlas Pro 6 MX5501 Mesh',
      brand: 'Linksys',
      price: 165,
      description: 'Router phát sóng Wi-Fi Mesh 6 tốc độ cao phủ sóng diện rộng, kết nối ổn định không chập chờn cho căn hộ chung cư lớn hoặc nhà phố.',
      image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=300&auto=format&fit=crop',
      specs: ['Chuẩn Wi-Fi 6 tốc độ 5.4 Gbps', 'Phủ sóng rộng đến 250m2', 'Công nghệ Velop Intelligent Mesh tự tối ưu'],
      category: 'DEVICE'
    },
    {
      id: 'prod-32',
      name: 'Switch mạng PoE Cisco Catalyst CBS250-8P-E-2G',
      brand: 'Cisco',
      price: 410,
      description: 'Switch PoE thông minh 8 cổng mạng hỗ trợ cấp nguồn cho camera IP hoặc Wifi, dòng Cisco Business CBS250 vận hành mát mẻ và bền bỉ.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=200&auto=format&fit=crop',
      specs: ['8 cổng PoE+ Gigabit & 2 cổng SFP 1G', 'Công suất nguồn POE đạt 67W', 'Hệ điều hành quản trị Web GUI đơn giản'],
      category: 'DEVICE'
    },
    {
      id: 'prod-33',
      name: 'Thiết bị Tường lửa Palo Alto Networks PA-440',
      brand: 'Palo Alto',
      price: 2900,
      description: 'Tường lửa thế hệ mới (NGFW) bảo mật cao cấp hàng đầu thế giới từ Palo Alto, ngăn chặn đe dọa mạng thời gian thực dựa trên học máy AI/ML.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=300&auto=format&fit=crop',
      specs: ['Tường lửa thế hệ mới dựa trên AI/ML', 'Băng thông kiểm soát App-ID tới 2.4 Gbps', 'Nhận diện đe dọa chủ động Zero-Day'],
      category: 'DEVICE'
    },
    {
      id: 'prod-34',
      name: 'Router định tuyến cân bằng tải Mikrotik hEX gr3',
      brand: 'Mikrotik',
      price: 75,
      description: 'Router cân bằng tải nhỏ gọn với 5 cổng mạng tốc độ 1Gbps, chịu tải tốt tới 80 user đồng thời phù hợp cho văn phòng nhỏ và hộ gia đình.',
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=300&auto=format&fit=crop',
      specs: ['5 cổng mạng Gigabit Ethernet', 'Cân bằng tải đa cổng WAN linh hoạt', 'Hệ điều hành RouterOS level 4 đầy đủ'],
      category: 'DEVICE'
    },
    {
      id: 'prod-35',
      name: 'Thùng Cáp mạng Cat5e UTP CommScope 305m',
      brand: 'CommScope',
      price: 110,
      description: 'Dây cáp mạng Cat5e UTP chính hãng CommScope lõi đồng đặc truyền dữ liệu lên tới 1Gbps ổn định ở cự ly ngắn dưới 80 mét.',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=300&auto=format&fit=crop',
      specs: ['Chiều dài thùng 305 mét', 'Lõi đồng nguyên chất 24 AWG', 'Phù hợp thi công văn phòng vừa và nhỏ'],
      category: 'CABLE'
    },
    {
      id: 'prod-36',
      name: 'Hộp 100 đầu bấm mạng RJ45 Cat5e bọc sắt',
      brand: 'OEM',
      price: 18,
      description: 'Đầu bấm mạng hạt mạng RJ45 Cat5e vỏ sắt bảo vệ chống nhiễu điện từ tốt, chân tiếp điểm mạ vàng tăng tiếp xúc điện và truyền tín hiệu.',
      image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=250&auto=format&fit=crop',
      specs: ['Hộp 100 hạt mạng RJ45', 'Thiết kế vỏ sắt chống nhiễu tĩnh điện', 'Hỗ trợ cáp mạng Cat5e lõi mềm/lõi đặc'],
      category: 'CABLE'
    },
    {
      id: 'prod-37',
      name: 'Tủ mạng Rack 6U D400 treo tường nhỏ gọn',
      brand: 'VietRack',
      price: 65,
      description: 'Tủ Rack mạng treo tường mini 6U sâu 400mm màu đen sơn tĩnh điện, cửa trước lưới thoáng khí phù hợp bảo vệ router switch tại gia đình.',
      image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=250&auto=format&fit=crop',
      specs: ['Kích thước H320 x W550 x D400', 'Cửa trước dạng lưới thông khí tốt', 'Trang bị quạt tản nhiệt treo tường'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-38',
      name: 'Thanh ổ cắm nguồn PDU 6 cổng bắt tủ rack',
      brand: 'OEM',
      price: 25,
      description: 'Thanh ổ cắm phân phối nguồn PDU 6 ổ cắm đa năng có aptomat bảo vệ quá tải chập cháy, vỏ sắt sơn tĩnh điện bắt rack tiêu chuẩn 19 inch.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=300&auto=format&fit=crop',
      specs: ['Ổ cắm 6 cổng đa năng tiêu chuẩn', 'Aptomat 16A bảo vệ tự ngắt quá tải', 'Kích thước lắp tủ rack 1U chuẩn ngang'],
      category: 'ACCESSORY'
    },
    {
      id: 'prod-39',
      name: 'Dây cáp mạng nhảy Patch Cord Cat6 CommScope 5m',
      brand: 'CommScope',
      price: 12,
      description: 'Dây nhảy mạng Cat6 hai đầu đúc sẵn RJ45 cao cấp dài 5m, thích hợp nối từ Switch sang các server tủ rack hoặc máy trạm làm việc.',
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=250&auto=format&fit=crop',
      specs: ['Độ dài dây nhảy 5 mét', 'Hai đầu đúc nhựa bảo vệ lẫy cắm bền bỉ', 'Tín hiệu đạt chuẩn Gigabit Cat6 đồng đặc'],
      category: 'CABLE'
    },
    {
      id: 'prod-40',
      name: 'Cuộn dây buộc cáp mạng dán nhám Velcro 5m',
      brand: 'OEM',
      price: 5,
      description: 'Cuộn dây buộc cáp dạng nhám dán dính Velcro dài 5m, dễ dàng cắt nhỏ tùy chỉnh để gom bó các dây cáp mạng gọn gàng và thẩm mỹ.',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=150&auto=format&fit=crop',
      specs: ['Độ dài cuộn dính nhám 5 mét', 'Chất liệu dính nhám Velcro chắc chắn', 'Cắt rời tự do tái sử dụng nhiều lần'],
      category: 'ACCESSORY'
    }
  ];

  const { products } = useSelector((state: RootState) => state.dashboard);

  // Pricing helper calculations (Required for backward compatibility/Redux, but hidden in UI)
  const monthlyTotal = 0;

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

  // Filtered products list based on search and category
  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Unified Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
          Giải pháp Dịch vụ &{' '}
          <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-enterprise-accent-cyan bg-clip-text text-transparent">
            Thiết bị Mạng chuyên dụng
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Chúng tôi cung cấp các gói dịch vụ đám mây, bảo mật Zero Trust cùng danh mục thiết bị mạng, cáp phụ kiện chính hãng phục vụ xây dựng hạ tầng CNTT toàn diện.
        </p>
      </div>

      {/* Unified Tab Switcher (Removed Budget Calculator) */}
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
            <span>Sản phẩm & Thiết bị</span>
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
                        className="space-y-4 pt-3.5 border-t border-slate-150/40 dark:border-slate-800/40 overflow-hidden"
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

      {/* Tab 2: Hardware grid (Standard Online Shop layout with 40 items, Search, and Category Filtering) */}
      {activeTab === 'HARDWARE' && (
        <div className="space-y-8">
          
          {/* Filter Toolbar & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {[
                { id: 'ALL', label: 'Tất cả sản phẩm', icon: Grid },
                { id: 'DEVICE', label: 'Thiết bị mạng', icon: Server },
                { id: 'CABLE', label: 'Cáp & Đầu bấm', icon: Network },
                { id: 'ACCESSORY', label: 'Phụ kiện tủ rack', icon: Tag }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
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

            {/* Live Search input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm, hãng sản xuất..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner"
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="glass-panel py-24 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <ShoppingCart className="h-7 w-7 text-brand-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Không tìm thấy thiết bị mạng nào</p>
                <p className="text-xs text-slate-450 max-w-xs mx-auto">Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển danh mục lọc.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredProducts.map((prod) => {
                const qty = quantities[prod.id] || 1;
                return (
                  <div
                    key={prod.id}
                    className="glass-panel glass-panel-hover rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 border border-slate-200/60 dark:border-slate-800/60 relative group"
                  >
                    {/* Brand/Logo Float Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 shadow-sm">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{prod.brand}</span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className={`absolute top-4 right-4 z-10 ${prod.inStock ? 'bg-emerald-500/90' : 'bg-red-500/90'} text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg`}>
                      {prod.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </div>

                    {/* Image Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                      />
                    </div>

                    {/* Details content */}
                    <div className="p-6 space-y-4 flex-1 text-left flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-brand-500 uppercase tracking-wider">
                          {prod.category === 'DEVICE' ? 'Thiết bị mạng' : prod.category === 'CABLE' ? 'Cáp & Đầu bấm' : 'Phụ kiện tủ rack'}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {prod.description}
                        </p>
                      </div>

                      {/* Specs badges list */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                        <h4 className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-brand-500 rounded-full shrink-0" />
                          <span>Thông số kỹ thuật</span>
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {prod.specs.map((spec, i) => (
                            <span key={i} className="text-[11px] text-slate-600 dark:text-slate-350 leading-tight block">
                              • {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quantity Selector controls */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800/40 mt-auto">
                        <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider">Số lượng đặt</span>
                        <div className={`flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/60 ${!prod.inStock ? 'opacity-50' : ''}`}>
                          <button
                            type="button"
                            disabled={!prod.inStock}
                            onClick={() => setQuantities({ ...quantities, [prod.id]: Math.max(1, qty - 1) })}
                            className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 font-bold transition-all text-xs focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold font-mono text-slate-900 dark:text-white w-6 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={!prod.inStock}
                            onClick={() => setQuantities({ ...quantities, [prod.id]: Math.min(99, qty + 1) })}
                            className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 font-bold transition-all text-xs focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer pricing & Buy Action button */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-950/10 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4 mt-auto">
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                          {qty > 1 ? `Tổng (${qty} cái)` : 'Đơn giá'}
                        </span>
                        <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center">
                          <DollarSign className="h-4 w-4 text-brand-500" />
                          <span>{(prod.price * qty).toLocaleString()}</span>
                        </span>
                      </div>

                      {productOrderCreatedId === prod.id ? (
                        <div className="px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 animate-bounce" />
                          <span>Đặt hàng thành công!</span>
                        </div>
                      ) : !prod.inStock ? (
                        <button
                          disabled
                          className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-[11px] cursor-not-allowed flex items-center space-x-1.5 shrink-0 border border-slate-300/20"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>Hết hàng</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleHardwareOrder(prod)}
                          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-[11px] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
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
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
