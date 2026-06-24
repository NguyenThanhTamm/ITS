import { User, Project, Ticket, Quotation, Order, SystemNotification, Product } from '@/types';

// Standard User Mocks
export const MOCK_ADMIN: User = {
  id: 'u-admin',
  name: 'Nguyễn Thanh Tâm',
  email: 'ngthanhtam.it@gmail.com',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  company: 'TamNguyen Enterprise IT Solutions',
  phone: '033 693 0692',
  status: 'ACTIVE',
  createdAt: '2025-01-01T00:00:00Z',
  password: 'admin123',
};

export const MOCK_CLIENT: User = {
  id: 'u-client',
  name: 'Phạm Minh Đức',
  email: 'duc.pham@apexcorp.com',
  role: 'CLIENT',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  company: 'Tập đoàn Công nghệ ApexCorp',
  status: 'ACTIVE',
  createdAt: '2026-02-15T08:30:00Z',
  password: 'client123',
};

// Marketing Showcase Portfolio Projects (public page)
export const PORTFOLIO_PROJECTS = [
  {
    id: 'port-1',
    title: 'Di trú Cơ sở hạ tầng Cloud AWS đa vùng',
    category: 'Cloud Architecture',
    client: 'Fintech Global Ltd',
    description: 'Thiết kế và triển khai cơ sở hạ tầng đám mây AWS có tính khả dụng cao, đa vùng sử dụng Terraform, đạt tỷ lệ cam kết SLA 99.99% và giảm 32% chi phí hạ tầng hàng tháng.',
    tech: ['AWS', 'Terraform', 'Kubernetes', 'Cloudflare', 'GitHub Actions'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    metrics: 'Giảm 32% chi phí, SLA hoạt động 99.99%',
    challenge: 'Độ trễ cao và sự cố đồng bộ hóa cơ sở dữ liệu giữa các văn phòng Hoa Kỳ/Châu Âu.',
    solution: 'Triển khai Cơ sở dữ liệu toàn cầu Aurora, CDN Cloudflare và các dịch vụ vi mô được container hóa trong EKS với các chính sách tự động mở rộng.'
  },
  {
    id: 'port-2',
    title: 'Tích hợp đường ống tự động DevSecOps CI/CD',
    category: 'DevOps & Security',
    client: 'CyberShield Health',
    description: 'Tích hợp quét bảo mật tự động, quét lỗ hổng bảo mật container và phân tích mã nguồn tĩnh vào một đường ống GitLab CI/CD thống nhất, giảm thời gian phê duyệt bảo mật từ nhiều ngày xuống còn vài phút.',
    tech: ['GitLab CI', 'SonarQube', 'Snyk', 'Docker', 'Trivy'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    metrics: 'Đánh giá tuân thủ nhanh hơn 95%, không cần phê duyệt thủ công',
    challenge: 'Trì hoãn triển khai phần mềm thường xuyên do hàng đợi kiểm tra bảo mật thủ công.',
    solution: 'Thiết kế và nhúng tính năng quét tự động SAST, DAST và quét thư viện phụ thuộc trực tiếp vào mã nguồn của lập trình viên khi có commit.'
  },
  {
    id: 'port-3',
    title: 'Triển khai và Quản trị Kubernetes Doanh nghiệp',
    category: 'Cloud Engineering',
    client: 'LogiChain Logistics',
    description: 'Thiết kế, xây dựng và quản trị cụm Kubernetes đám mây lai quy mô lớn phục vụ hơn 120 dịch vụ vi mô, sử dụng ArgoCD để triển khai liên tục theo mô hình GitOps.',
    tech: ['Kubernetes', 'Helm', 'ArgoCD', 'Prometheus', 'Grafana'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    metrics: 'Nâng cấp hệ thống không gián đoạn, hơn 120 dịch vụ vi mô',
    challenge: 'Mô hình triển khai không nhất quán và chi phí vận hành thủ công cao.',
    solution: 'Thiết lập quy trình triển khai GitOps sử dụng Helm charts được quản lý bởi ArgoCD, đi kèm hệ thống giám sát Prometheus và Grafana.'
  },
  {
    id: 'port-4',
    title: 'Triển khai Kiến trúc Mạng Bảo mật Zero Trust',
    category: 'Cybersecurity',
    client: 'Tập đoàn ApexCorp',
    description: 'Xây dựng mô hình truy cập Zero Trust cho doanh nghiệp tích hợp Cloudflare Access, Tường lửa Fortinet và xác thực đa yếu tố, bảo vệ an toàn cho hơn 1200 nhân sự làm việc từ xa.',
    tech: ['Cloudflare Zero Trust', 'Fortinet Gateways', 'Okta SSO', 'WireGuard'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
    metrics: '100% nhân sự làm việc từ xa được bảo vệ, 0% sự cố truy cập trái phép',
    challenge: 'Lỗ hổng bảo mật phát sinh từ nhân sự làm việc từ xa sử dụng kết nối VPN truyền thống.',
    solution: 'Thay thế kết nối VPN tiêu chuẩn bằng các chính sách truy cập Cloudflare Access, buộc xác thực danh tính liên tục và kiểm tra trạng thái thiết bị.'
  }
];

// Mock Client Portal Projects
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p-101',
    name: 'Thiết lập AWS Landing Zone & Rào chắn bảo mật cho ApexCorp',
    description: 'Thiết lập môi trường AWS đa tài khoản bảo mật tuân theo các tiêu chuẩn vận hành tốt nhất của AWS Control Tower, cấu hình các Đơn vị Tổ chức (OU), chính sách SCP và theo dõi lịch sử kiểm tra tự động.',
    status: 'IN_PROGRESS',
    progress: 75,
    startDate: '2026-05-01',
    endDate: '2026-07-15',
    milestones: [
      { id: 'm-1', title: 'Kích hoạt AWS Control Tower', completed: true, dueDate: '2026-05-10' },
      { id: 'm-2', title: 'Phác thảo chính sách các đơn vị tổ chức & SCP', completed: true, dueDate: '2026-05-25' },
      { id: 'm-3', title: 'Tích hợp Okta Single Sign-On (SSO)', completed: true, dueDate: '2026-06-15' },
      { id: 'm-4', title: 'Kích hoạt lịch sử kiểm soát & Chuyển tiếp SIEM', completed: false, dueDate: '2026-07-02' },
      { id: 'm-5', title: 'Bàn giao sản phẩm & Hướng dẫn sử dụng cho khách hàng', completed: false, dueDate: '2026-07-15' }
    ],
    manager: {
      name: 'Nguyễn Thanh Tâm',
      email: 'pm@tamnguyen.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    clientId: 'u-client'
  },
  {
    id: 'p-102',
    name: 'Triển khai mạng diện rộng Fortinet SD-WAN Doanh nghiệp',
    description: 'Thiết kế và triển khai mô hình mạng kết nối SD-WAN tại 4 văn phòng chi nhánh khu vực của ApexCorp nhằm tối ưu hóa lưu lượng truy cập và nâng cao tốc độ làm việc đám mây.',
    status: 'REVIEW',
    progress: 90,
    startDate: '2026-04-10',
    endDate: '2026-06-30',
    milestones: [
      { id: 'm-6', title: 'Mua sắm thiết bị phần cứng & Cấp phép bản quyền', completed: true, dueDate: '2026-04-20' },
      { id: 'm-7', title: 'Hoạch định IP chi nhánh & Quy tắc tường lửa', completed: true, dueDate: '2026-05-05' },
      { id: 'm-8', title: 'Thiết lập trung tâm điều phối SD-WAN Orchestrator', completed: true, dueDate: '2026-05-20' },
      { id: 'm-9', title: 'Đánh giá hiệu năng và nghiệm thu người dùng', completed: true, dueDate: '2026-06-10' },
      { id: 'm-10', title: 'Phát hành tài liệu nghiệm thu kỹ thuật cuối cùng', completed: false, dueDate: '2026-06-30' }
    ],
    manager: {
      name: 'Sarah Connor',
      email: 'sarah.connor@tamnguyen.dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    },
    clientId: 'u-client'
  },
  {
    id: 'p-103',
    name: 'Gia cố bảo mật đường ống tự động CI/CD',
    description: 'Triển khai phân tích mã tĩnh, quét lỗ hổng phụ thuộc và xác minh tuân thủ giấy phép nguồn mở trong các kho lưu trữ mã nguồn chính.',
    status: 'COMPLETED',
    progress: 100,
    startDate: '2026-02-20',
    endDate: '2026-04-15',
    milestones: [
      { id: 'm-11', title: 'Kiểm toán bảo mật các kho chứa mã nguồn hiện tại', completed: true, dueDate: '2026-03-01' },
      { id: 'm-12', title: 'Cấu hình GitLab Runner cô lập bằng Docker', completed: true, dueDate: '2026-03-15' },
      { id: 'm-13', title: 'Tích hợp công cụ quét mã tĩnh SAST và Secrets detection', completed: true, dueDate: '2026-04-01' },
      { id: 'm-14', title: 'Kích hoạt chính sách chặn pipeline khi có lỗi bảo mật', completed: true, dueDate: '2026-04-15' }
    ],
    manager: {
      name: 'Nguyễn Thanh Tâm',
      email: 'pm@tamnguyen.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    clientId: 'u-client'
  },
  {
    id: 'p-104',
    name: 'Thiết kế Cổng thông tin Khách hàng cho VinaTech',
    description: 'Xây dựng cổng thông tin quản lý dự án, báo giá dịch vụ tự động cho đối tác VinaTech Solutions sử dụng React và TailwindCSS.',
    status: 'IN_PROGRESS',
    progress: 40,
    startDate: '2026-05-15',
    endDate: '2026-08-01',
    milestones: [
      { id: 'm-21', title: 'Phác thảo UI/UX Figma', completed: true, dueDate: '2026-06-01' },
      { id: 'm-22', title: 'Xây dựng giao diện tĩnh React', completed: false, dueDate: '2026-07-01' },
      { id: 'm-23', title: 'Tích hợp cơ sở dữ liệu và REST API', completed: false, dueDate: '2026-08-01' }
    ],
    manager: {
      name: 'Nguyễn Thanh Tâm',
      email: 'pm@tamnguyen.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    clientId: 'u-client-2'
  }
];

// Mock Client Tickets
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 't-901',
    subject: 'Không thể truy cập Tài khoản AWS Sandbox qua Okta SSO',
    description: 'Khi cố gắng đăng nhập vào tài khoản AWS Sandbox mới tạo thông qua Okta, tôi gặp thông báo lỗi: "SAML assertion invalid". Các tài khoản khác vẫn hoạt động bình thường.',
    priority: 'HIGH',
    status: 'OPEN',
    category: 'Cloud Access / IAM',
    createdAt: '2026-06-21T09:15:00Z',
    updatedAt: '2026-06-22T10:30:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'CLIENT',
        senderName: 'Phạm Minh Đức',
        message: 'Chào anh Tâm, tôi đang cố gắng truy cập tài khoản AWS Sandbox để thử nghiệm, nhưng SSO báo lỗi xác thực SAML. Anh có thể kiểm tra giúp không?',
        timestamp: '2026-06-21T09:15:00Z'
      },
      {
        id: 'msg-2',
        sender: 'SUPPORT',
        senderName: 'Nguyễn Thanh Tâm',
        message: 'Chào Đức, tôi đã thấy lỗi. Có vẻ như chính sách SAML ánh xạ vai trò của tài khoản Sandbox đang bị thiếu một số thuộc tính. Tôi đang cập nhật lại cấu hình SAML trên Okta ngay bây giờ. Sẽ phản hồi lại bạn sau 1 tiếng nhé.',
        timestamp: '2026-06-22T10:30:00Z'
      }
    ],
    clientId: 'u-client'
  },
  {
    id: 't-902',
    subject: 'Nghẽn băng thông cổng mạng chi nhánh Singapore',
    description: 'Nhân viên tại chi nhánh Singapore báo cáo ứng dụng tải chậm. Bảng điều khiển phân tích WAN Cloudflare chỉ ra cổng giao tiếp tường lửa đang chạm ngưỡng 98% hiệu suất tối đa.',
    priority: 'CRITICAL',
    status: 'PENDING',
    category: 'Network Engineering',
    createdAt: '2026-06-20T14:00:00Z',
    updatedAt: '2026-06-21T16:00:00Z',
    messages: [
      {
        id: 'msg-3',
        sender: 'CLIENT',
        senderName: 'Phạm Minh Đức',
        message: 'Đang có hiện tượng trễ mạng nghiêm trọng. Đội ngũ không thể thao tác các ứng dụng SaaS.',
        timestamp: '2026-06-20T14:00:00Z'
      },
      {
        id: 'msg-4',
        sender: 'SUPPORT',
        senderName: 'Jane Smith',
        message: 'Chúng tôi đã phân tích gói tin. Hiện tại có tiến trình đồng bộ dữ liệu tải xuống bản sao lưu rất lớn từ bộ nhớ cục bộ lên kho chứa S3 bên ngoài. Chúng tôi đã kích hoạt giới hạn băng thông trong giờ làm việc để tránh ảnh hưởng. Hãy theo dõi xem tốc độ mạng đã ổn định chưa nhé.',
        timestamp: '2026-06-21T16:00:00Z'
      }
    ],
    clientId: 'u-client'
  },
  {
    id: 't-903',
    subject: 'Yêu cầu tạo Khóa API mới cho hệ thống kế toán',
    description: 'Chúng tôi cần tạo một khóa API mới có quyền truy xuất dữ liệu hóa đơn báo cáo tài chính tích hợp vào ứng dụng nội bộ.',
    priority: 'LOW',
    status: 'RESOLVED',
    category: 'Configuration',
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-06-16T12:00:00Z',
    messages: [
      {
        id: 'msg-5',
        sender: 'CLIENT',
        senderName: 'Phạm Minh Đức',
        message: 'Hệ thống có hỗ trợ cấp khóa API cho phần mềm hóa đơn bên ngoài không?',
        timestamp: '2026-06-15T08:00:00Z'
      },
      {
        id: 'msg-6',
        sender: 'SUPPORT',
        senderName: 'Nguyễn Thanh Tâm',
        message: 'Chào bạn, tính năng quản lý API key đã được kích hoạt trong phần cài đặt Hồ sơ của bạn. Bạn đã có thể tự quản lý tạo, xóa các khóa API một cách an toàn. Hãy kiểm tra mục Hồ sơ nhé.',
        timestamp: '2026-06-16T12:00:00Z'
      }
    ],
    clientId: 'u-client'
  },
  {
    id: 't-904',
    subject: 'Lỗi đồng bộ VPN IPSec chi nhánh Hà Nội',
    description: 'Tường lửa báo lỗi liên kết Phase 2 Security Association không khớp thuật toán mã hóa AES-256.',
    priority: 'HIGH',
    status: 'OPEN',
    category: 'Network Engineering',
    createdAt: '2026-06-22T08:00:00Z',
    updatedAt: '2026-06-22T08:00:00Z',
    messages: [
      {
        id: 'msg-21',
        sender: 'CLIENT',
        senderName: 'Nguyễn Văn B',
        message: 'Tôi cấu hình cổng VPN IPSec nối về Cloud AWS nhưng Phase 2 không chuyển sang màu xanh. Báo lỗi IKEv2.',
        timestamp: '2026-06-22T08:00:00Z'
      }
    ],
    clientId: 'u-client-2'
  }
];

// Mock Quotations
export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'q-401',
    title: 'Đề xuất dịch vụ Di trú Cloud & Gia cố Bảo mật hạ tầng',
    status: 'PENDING',
    items: [
      { id: 'qi-1', description: 'Triển khai di trú hạ tầng AWS (Sử dụng Terraform + AWS Control Tower)', quantity: 1, unitPrice: 4500, total: 4500 },
      { id: 'qi-2', description: 'Tích hợp bảo mật DevSecOps tự động vào luồng CI/CD', quantity: 1, unitPrice: 2800, total: 2800 },
      { id: 'qi-3', description: 'Số giờ hướng dẫn vận hành & Bàn giao hệ thống', quantity: 15, unitPrice: 120, total: 1800 }
    ],
    subtotal: 9100,
    tax: 910,
    total: 10010,
    notes: 'Báo giá có hiệu lực trong 30 ngày. Đã bao gồm 3 tháng hỗ trợ kỹ thuật ưu tiên sau khi bàn giao.',
    createdAt: '2026-06-18',
    validUntil: '2026-07-18',
    clientId: 'u-client'
  },
  {
    id: 'q-402',
    title: 'Báo giá nâng cấp Thiết bị Tường lửa & Mạng VPN doanh nghiệp',
    status: 'APPROVED',
    items: [
      { id: 'qi-4', description: 'Thiết bị phần cứng tường lửa Fortinet FortiGate FG-80F', quantity: 2, unitPrice: 1250, total: 2500 },
      { id: 'qi-5', description: 'Bản quyền bảo mật FortiGuard Unified Threat Protection 1 năm', quantity: 2, unitPrice: 750, total: 1500 },
      { id: 'qi-6', description: 'Chi phí nhân công cấu hình & Lắp đặt tận nơi', quantity: 2, unitPrice: 800, total: 1600 }
    ],
    subtotal: 5600,
    tax: 560,
    total: 6160,
    notes: 'Khách hàng đã duyệt báo giá vào ngày 19-06-2026. Đơn hàng phần cứng đang được xử lý.',
    createdAt: '2026-06-12',
    validUntil: '2026-07-12',
    clientId: 'u-client'
  },
  {
    id: 'q-403',
    title: 'Báo giá Web Hosting & Bản quyền Cloudflare Enterprise cho VinaTech',
    status: 'PENDING',
    items: [
      { id: 'qi-10', description: 'Gói tối ưu hóa CDN biên & Chống DDoS Cloudflare', quantity: 1, unitPrice: 1200, total: 1200 },
      { id: 'qi-11', description: 'Thiết lập VPC hosting trên Google Cloud Platform', quantity: 1, unitPrice: 800, total: 800 }
    ],
    subtotal: 2000,
    tax: 200,
    total: 2200,
    notes: 'Được đề xuất cho VinaTech.',
    createdAt: '2026-06-19',
    validUntil: '2026-07-19',
    clientId: 'u-client-2'
  }
];

// Mock Purchase Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-801',
    itemName: 'Thiết bị phần cứng tường lửa Fortinet FortiGate FG-80F',
    price: 3100,
    status: 'SHIPPED',
    purchaseDate: '2026-06-14',
    estimatedDelivery: '2026-06-25',
    trackingNumber: 'FTN-89472390-VN',
    timeline: [
      { label: 'Xác nhận đơn hàng', timestamp: '2026-06-14T09:00:00Z', description: 'Đã thanh toán hóa đơn phần cứng.', completed: true },
      { label: 'Cấu hình thiết bị', timestamp: '2026-06-16T14:30:00Z', description: 'Nạp hệ điều hành và cập nhật giấy phép bản quyền.', completed: true },
      { label: 'Đã gửi hàng', timestamp: '2026-06-18T11:00:00Z', description: 'Đơn hàng đã bàn giao cho FedEx chuyển phát nhanh.', completed: true },
      { label: 'Đang vận chuyển', timestamp: '', description: 'Hàng đang trên đường tới chi nhánh Singapore.', completed: false },
      { label: 'Đã nhận & Triển khai', timestamp: '', description: 'Kỹ sư tới hiện trường hỗ trợ lắp ráp kết nối mạng.', completed: false }
    ],
    clientId: 'u-client'
  },
  {
    id: 'ord-802',
    itemName: 'Bản quyền tài khoản Atlassian Jira Cloud Enterprise (50 người dùng)',
    price: 3750,
    status: 'DELIVERED',
    purchaseDate: '2026-05-10',
    estimatedDelivery: '2026-05-12',
    trackingNumber: 'ATL-9382103',
    timeline: [
      { label: 'Đăng ký bản quyền', timestamp: '2026-05-10T08:00:00Z', description: 'Khởi tạo yêu cầu cấp phát bản quyền.', completed: true },
      { label: 'Kích hoạt tài khoản', timestamp: '2026-05-11T10:15:00Z', description: 'Hệ thống Atlassian đã đồng bộ xong không gian làm việc.', completed: true },
      { label: 'Bàn giao thông tin', timestamp: '2026-05-11T12:00:00Z', description: 'Gửi tài khoản quản trị viên và mật khẩu đăng nhập.', completed: true }
    ],
    clientId: 'u-client'
  },
  {
    id: 'ord-803',
    itemName: 'Thiết bị định tuyến Fortinet FortiGate FG-40F',
    price: 950,
    status: 'PROCESSING',
    purchaseDate: '2026-06-20',
    estimatedDelivery: '2026-06-30',
    timeline: [
      { label: 'Xác nhận đơn hàng', timestamp: '2026-06-20T10:00:00Z', description: 'Đơn hàng mới đã được tiếp nhận thành công trên hệ thống và chuyển cho Admin điều phối.', completed: true },
      { label: 'Cấu hình thiết bị', timestamp: '', description: 'Chuẩn bị bản quyền và nạp cấu hình bảo mật trước khi đóng gói gửi đi.', completed: false },
      { label: 'Đang vận chuyển', timestamp: '', description: 'Đơn hàng đang được đối tác vận chuyển giao nhận.', completed: false },
      { label: 'Đã nhận & Kích hoạt', timestamp: '', description: 'Khách hàng nhận thiết bị/bản quyền và tiến hành tích hợp vận hành.', completed: false }
    ],
    clientId: 'u-client-2'
  }
];

// Mock Notifications
export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    title: 'Đề xuất dịch vụ đang chờ duyệt',
    message: 'Bản đề xuất dịch vụ di trú cơ sở hạ tầng đám mây đã sẵn sàng để bạn phản hồi.',
    read: false,
    createdAt: '2026-06-18T10:00:00Z',
    type: 'QUOTATION'
  },
  {
    id: 'n-2',
    title: 'Yêu cầu hỗ trợ nhận được câu trả lời',
    message: 'Yêu cầu t-901 về sự cố đăng nhập AWS Sandbox đã có phản hồi mới từ kỹ sư Nguyễn Thanh Tâm.',
    read: false,
    createdAt: '2026-06-22T10:30:00Z',
    type: 'TICKET'
  },
  {
    id: 'n-3',
    title: 'Cột mốc dự án đã hoàn thành',
    message: 'Cột mốc "Tích hợp Okta Single Sign-On" trong dự án AWS Landing Zone được đánh dấu hoàn thành.',
    read: true,
    createdAt: '2026-06-15T15:00:00Z',
    type: 'PROJECT'
  },
  {
    id: 'n-4',
    title: 'Thiết bị phần cứng đã xuất kho',
    message: 'Thiết bị tường lửa Fortigate (Đơn hàng ord-801) đã được gửi qua dịch vụ vận chuyển nhanh.',
    read: true,
    createdAt: '2026-06-18T11:00:00Z',
    type: 'ORDER'
  }
];

// Mock Products List (40 items)
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Thiết bị Tường lửa Fortinet FortiGate 60F',
    brand: 'Fortinet',
    price: 1250,
    description: 'Thiết bị tường lửa bảo mật thế hệ mới (NGFW) bảo vệ mạng doanh nghiệp vừa và nhỏ, kiểm soát ứng dụng chuyên sâu và chống xâm nhập.',
    image: 'https://viettuans.vn/uploads/2022/11/fg-60f.jpg',
    specs: ['Chống virus & Phần mềm độc hại', 'VPN IPSec tốc độ 6.5 Gbps', 'Kiểm soát nội dung Web & Ứng dụng'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Bộ phát Wi-Fi Ubiquiti UniFi AP AC Pro',
    brand: 'Ubiquiti',
    price: 220,
    description: 'Thiết bị phát sóng Wi-Fi băng tần kép ốp trần chịu tải lớn, hỗ trợ roaming không dây mượt mà cho hơn 200 người dùng đồng thời.',
    image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=400&auto=format&fit=crop',
    specs: ['Tốc độ tối đa 1750 Mbps', 'Roaming liền mạch không ngắt kết nối', 'Quản trị tập trung qua Controller'],
    category: 'DEVICE',
    inStock: false
  },
  {
    id: 'prod-3',
    name: 'Switch mạng Cisco Business CBS350-24P-4G',
    brand: 'Cisco',
    price: 850,
    description: 'Switch Layer 3 chuyên nghiệp với 24 cổng mạng tốc độ Gigabit cấp nguồn PoE+ hỗ trợ hoàn hảo cho hệ thống Camera IP và Access Point.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=400&auto=format&fit=crop',
    specs: ['24 cổng Gigabit PoE+ (195W)', '4 cổng SFP 1G Uplink', 'Quản lý nâng cao VLAN & QoS'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Bộ định tuyến Mikrotik RB5009UG+S+IN',
    brand: 'Mikrotik',
    price: 320,
    description: 'Router chịu tải cực mạnh cho văn phòng doanh nghiệp lớn, hỗ trợ cân bằng tải (Load Balancing) đa đường truyền WAN và định tuyến động.',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=400&auto=format&fit=crop',
    specs: ['Cổng mạng 2.5G & SFP+ 10G', 'Chịu tải lên đến 500+ session', 'Hệ điều hành RouterOS chuyên sâu'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-5',
    name: 'Thiết bị Lưu trữ NAS Synology DS923+',
    brand: 'Synology',
    price: 720,
    description: 'Thiết bị ổ cứng lưu trữ mạng 4 khay, giải pháp sao lưu (Backup) dữ liệu văn phòng tự động, chia sẻ file an toàn và đồng bộ hóa đám mây.',
    image: 'https://images.unsplash.com/photo-1601524589470-f7ecf50d3736?q=80&w=400&auto=format&fit=crop',
    specs: ['4 khay ổ cứng (Hỗ trợ tối đa 9 khay)', 'Hệ điều hành DSM trực quan', 'Tích hợp backup đa nền tảng'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-6',
    name: 'Thiết bị Tường lửa Fortinet FortiGate 40F',
    brand: 'Fortinet',
    price: 820,
    description: 'Giải pháp bảo mật mạng tối ưu cho các văn phòng chi nhánh nhỏ hoặc cửa hàng bán lẻ, hỗ trợ SD-WAN và tường lửa kiểm soát ứng dụng.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop',
    specs: ['Tích hợp bảo mật FortiGuard UTP', 'Hỗ trợ SD-WAN tối ưu hóa WAN', 'Quản lý tập trung qua Cloud'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-7',
    name: 'Bộ phát Wi-Fi Ubiquiti UniFi U6 Pro',
    brand: 'Ubiquiti',
    price: 290,
    description: 'Access Point Wi-Fi 6 thế hệ mới hiệu năng cao, băng tần kép chịu tải cực lớn thích hợp cho môi trường văn phòng mật độ cao.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
    specs: ['Chuẩn Wi-Fi 6 tốc độ đến 5.3 Gbps', 'Hỗ trợ hơn 350+ thiết bị kết nối', 'Hỗ trợ cấp nguồn PoE tiện lợi'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-8',
    name: 'Switch mạng Aruba Instant On 1930 24G 4SFP/SFP+',
    brand: 'Aruba',
    price: 460,
    description: 'Switch Gigabit quản trị thông minh (Smart Managed) với 24 cổng mạng tốc độ cao và 4 cổng SFP/SFP+ 10G uplink truyền dẫn dữ liệu cực nhanh.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop',
    specs: ['24 cổng mạng Gigabit Ethernet', '4 cổng SFP+ 10G Uplink', 'Quản trị dễ dàng qua Aruba Instant On App'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-9',
    name: 'Thiết bị Lưu trữ NAS Synology DS224+',
    brand: 'Synology',
    price: 420,
    description: 'Giải pháp lưu trữ và sao lưu dữ liệu cá nhân/văn phòng nhỏ gọn 2 khay ổ cứng, hỗ trợ phân quyền truy cập và đồng bộ hóa đám mây.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    specs: ['2 khay ổ cứng (Tối đa 36 TB)', 'Bộ vi xử lý Intel Celeron mạnh mẽ', 'Tích hợp ứng dụng Synology Drive'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-10',
    name: 'Cuộn Cáp mạng CommScope AMP Cat6 UTP 305m',
    brand: 'CommScope',
    price: 145,
    description: 'Cáp mạng Cat6 UTP chính hãng CommScope lõi đồng nguyên chất truyền dẫn Gigabit ổn định, chuyên dụng đi dây văn phòng và dự án.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=400&auto=format&fit=crop',
    specs: ['Chiều dài tiêu chuẩn 305 mét', 'Băng thông đạt chuẩn 250 MHz', 'Độ dày lõi 23 AWG đồng nguyên chất'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-11',
    name: 'Hộp 100 đầu bấm mạng RJ45 CommScope Cat6 bọc kim',
    brand: 'CommScope',
    price: 48,
    description: 'Đầu bấm mạng RJ45 Cat6 bọc kim loại chống nhiễu cao cấp, chân tiếp điểm mạ vàng chống oxy hóa tăng hiệu suất kết nối.',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=400&auto=format&fit=crop',
    specs: ['Hộp 100 hạt mạng RJ45', 'Thiết kế sắt bọc kim chống nhiễu', 'Phù hợp cáp Cat6 và Cat6A'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-12',
    name: 'Cuộn Cáp mạng Cat6A SFTP Golden Link chống nhiễu 305m',
    brand: 'Golden Link',
    price: 185,
    description: 'Cáp mạng SFTP Cat6A chống nhiễu kép (lưới nhôm + lá bạc), lõi đồng pha hợp kim cao cấp đạt chuẩn truyền dữ liệu 10Gbps.',
    image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=400&auto=format&fit=crop',
    specs: ['Lớp chống nhiễu kép SFTP', 'Băng thông tối đa 500 MHz', 'Phù hợp chạy ngoài trời và âm tường'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-13',
    name: 'Hộp 100 đầu bấm mạng RJ45 AMP Cat5e nhựa dẻo',
    brand: 'AMP / CommScope',
    price: 22,
    description: 'Hạt mạng RJ45 Cat5e chất lượng cao, nhựa dẻo dai chống gãy lẫy khi cắm rút nhiều lần, tiếp điểm lá đồng dẫn điện tốt.',
    image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=400&auto=format&fit=crop',
    specs: ['Hộp 100 hạt mạng Cat5e', 'Nhựa dẻo chịu lực đàn hồi', 'Tiếp điểm lá đồng nguyên chất'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-14',
    name: 'Thanh quản lý Cáp Patch Panel 24-Port Cat6 CommScope',
    brand: 'CommScope',
    price: 85,
    description: 'Thanh Patch Panel 24 cổng RJ45 chuẩn rack 19 inch giúp gom gọn và quản lý sơ đồ đấu nối cáp mạng tập trung trong tủ Rack.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=200&auto=format&fit=crop',
    specs: ['Độ cao tiêu chuẩn 1U Rackmount', 'Gồm 24 cổng Cat6 RJ45', 'Nhãn đấu nối số thứ tự rõ ràng'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-15',
    name: 'Vòng cao su đánh dấu số dây mạng từ 0-9 Cat6',
    brand: 'OEM',
    price: 6,
    description: 'Bộ vòng đánh số cao su từ 0 đến 9 nhiều màu sắc phân biệt giúp định danh các đường dây mạng trong phòng máy Server dễ dàng.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    specs: ['Gồm 10 cuộn đánh số 0-9', 'Màu sắc phân biệt tiêu chuẩn', 'Dùng chung cáp Cat5e và Cat6'],
    category: 'ACCESSORY',
    inStock: false
  },
  {
    id: 'prod-16',
    name: 'Kìm bấm mạng đa năng CommScope Pro-Crimper',
    brand: 'CommScope',
    price: 95,
    description: 'Kìm chuyên dụng cho kỹ thuật viên mạng, tích hợp bấm đầu RJ45/RJ11, tuốt vỏ cáp mạng và cắt dây gọn gàng, trợ lực bấm nhẹ nhàng.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop',
    specs: ['Chất liệu thép cacbon siêu bền', 'Bấm RJ45 Cat5e/Cat6 và RJ11', 'Tay cầm bọc cao su chống mỏi'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-17',
    name: 'Tủ Rack Mạng Treo Tường 9U D500 cửa lưới',
    brand: 'VietRack',
    price: 115,
    description: 'Tủ đựng thiết bị mạng 9U sâu 500mm treo tường chắc chắn, cửa lưới thông thoáng khí, sơn tĩnh điện đen chống han gỉ.',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=200&auto=format&fit=crop',
    specs: ['Kích thước H480 x W550 x D500', 'Mặt trước cửa lưới sắt tổ ong', 'Tích hợp quạt tản nhiệt & nguồn 6 port'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-18',
    name: 'Dây nhảy cáp mạng đúc sẵn Patch Cord Cat6 CommScope 3m',
    brand: 'CommScope',
    price: 9,
    description: 'Dây cáp mạng nhảy đúc sẵn hai đầu RJ45 Cat6 chất lượng cao dài 3m màu xanh dương, lõi đồng nguyên chất kết nối ổn định.',
    image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=200&auto=format&fit=crop',
    specs: ['Độ dài dây 3 mét', 'Hai đầu đúc nhựa bảo vệ đầu bấm', 'Chuẩn cáp Cat6 đồng nguyên chất'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-19',
    name: 'Bộ phát Wi-Fi 6 Aruba Instant On AP22 Cloud Managed',
    brand: 'Aruba',
    price: 195,
    description: 'Thiết bị phát sóng Wi-Fi 6 chuyên nghiệp chịu tải hơn 75 user hoạt động đồng thời, cấu hình qua Cloud và App di động miễn phí.',
    image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=200&auto=format&fit=crop',
    specs: ['Chuẩn Wi-Fi 6 tốc độ 1.7 Gbps', 'Hỗ trợ Mesh mạng không dây', 'Tích hợp bảo mật WPA2/WPA3 tối tân'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-20',
    name: 'Switch mạng PoE Ubiquiti UniFi USW-24-POE Smart Managed',
    brand: 'Ubiquiti',
    price: 495,
    description: 'Switch POE quản trị 24 cổng Gigabit, cấp nguồn POE+ tổng công suất 95W tương thích tốt với camera IP và AP Wifi UniFi.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=200&auto=format&fit=crop',
    specs: ['16 cổng PoE+ Gigabit & 8 cổng Gigabit', '2 cổng SFP 1G Uplink', 'Quản trị UniFi Controller tập trung'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-21',
    name: 'Thiết bị Tường lửa Sophos XGS 116 Security Gateway',
    brand: 'Sophos',
    price: 980,
    description: 'Tường lửa Sophos thế hệ mới tích hợp chip xử lý Xstream bảo vệ mạng chống phần mềm tống tiền ransomware và tấn công đa lớp.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop',
    specs: ['Chip bảo mật Xstream chuyên biệt', 'Băng thông tường lửa lên tới 7.7 Gbps', 'Hỗ trợ VPN SSL/IPSec an toàn cao'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-22',
    name: 'Router định tuyến DrayTek Vigor2927 Dual-WAN',
    brand: 'DrayTek',
    price: 190,
    description: 'Router cân bằng tải Dual-WAN chuyên dụng cho doanh nghiệp vừa và nhỏ, chạy mượt mà ổn định VPN site-to-site và dịch vụ IP tĩnh.',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=200&auto=format&fit=crop',
    specs: ['2 cổng WAN Gigabit cân bằng tải', 'Khả năng chịu tải tối đa 150 user', 'Quản lý băng thông QoS chi tiết'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-23',
    name: 'Bộ phát Wi-Fi 6 Ruckus ZoneFlex R550 cao cấp',
    brand: 'Ruckus',
    price: 650,
    description: 'Thiết bị phát sóng Wifi 6 thuộc phân khúc doanh nghiệp cao cấp, anten thích ứng BeamFlex+ giúp mở rộng phủ sóng tối đa và lọc nhiễu tốt.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop',
    specs: ['Ăng-ten thích ứng BeamFlex+', 'Chịu tải lý thuyết đến 512 thiết bị', 'Tốc độ tối đa đạt 1.8 Gbps'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-24',
    name: 'Switch mạng Cisco Catalyst C9200L-24T-4G-E',
    brand: 'Cisco',
    price: 2100,
    description: 'Switch Layer 3 Catalyst cao cấp dòng doanh nghiệp lớn, tích hợp quản lý thông qua Cisco DNA Center bảo mật thông tin an toàn.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=300&auto=format&fit=crop',
    specs: ['24 cổng mạng Gigabit Ethernet', '4 cổng 1G Uplink cố định', 'Hỗ trợ StackWise liên kết các switch'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-25',
    name: 'Thùng Cáp mạng Alantek Cat6 UTP 305m lõi đồng',
    brand: 'Alantek',
    price: 125,
    description: 'Cáp mạng Cat6 lõi đồng đặc nguyên chất chính hãng Alantek Mỹ, khoảng cách truyền tải lên đến 100m không suy hao tín hiệu.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=200&auto=format&fit=crop',
    specs: ['Chiều dài tiêu chuẩn 305 mét', 'Lõi đồng 23 AWG chống nhiễu chữ thập', 'Đạt chứng nhận tiêu chuẩn UL quốc tế'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-26',
    name: 'Hộp 50 đầu bấm mạng RJ45 Cat6A Golden Link',
    brand: 'Golden Link',
    price: 35,
    description: 'Đầu bấm mạng RJ45 chuẩn Cat6A bọc kim loại chống nhiễu, đi kèm kẹp kim loại giữ đuôi cáp chắc chắn khi đi dây Server 10Gbps.',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=300&auto=format&fit=crop',
    specs: ['Hộp 50 hạt mạng cao cấp', 'Vỏ sắt mạ niken chống gỉ chống nhiễu', 'Tiếp điểm mạ vàng chống oxy hóa dày'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-27',
    name: 'Tủ mạng Rack 15U D600 tự đứng chuyên nghiệp',
    brand: 'VietRack',
    price: 195,
    description: 'Tủ mạng tự đứng Rack 15U chiều sâu 600mm, sơn tĩnh điện, tích hợp bánh xe di chuyển và khóa bảo vệ 2 bên hông chắc chắn.',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=300&auto=format&fit=crop',
    specs: ['Kích thước H800 x W600 x D600', 'Cửa lưới mắt tổ ong thông gió trước sau', 'Kèm 2 quạt thông gió tủ & ổ cắm PDU 6 port'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-28',
    name: 'Bộ vòng đánh số dây mạng loại kẹp dẹt Cat6',
    brand: 'OEM',
    price: 8,
    description: 'Vòng nhựa kẹp đánh số từ 0 đến 9 dạng cài mở bên hông tiện lợi, gá trực tiếp vào dây cáp mạng đã bấm đầu mà không cần luồn dây trước.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=300&auto=format&fit=crop',
    specs: ['Dạng kẹp mở bên tiện lợi', 'Đầy đủ bộ ký tự từ số 0-9', 'Phù hợp dây mạng Cat5e/Cat6/Cat6A'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-29',
    name: 'Thiết bị kiểm tra đo test cáp mạng Noyafa NF-308',
    brand: 'Noyafa',
    price: 65,
    description: 'Thiết bị đo thông mạch cáp mạng thông minh, tìm vị trí sợi dây mạng bị đứt, đo khoảng cách chiều dài cáp mạng chuẩn xác.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200&auto=format&fit=crop',
    specs: ['Màn hình LCD hiển thị kết quả đo', 'Định vị điểm đứt và lỗi đấu đầu hạt mạng', 'Kèm bộ dò tín hiệu không dây'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-30',
    name: 'Dây cáp mạng nhảy Patch Cord Cat6 CommScope 1.5m',
    brand: 'CommScope',
    price: 7,
    description: 'Dây mạng nhảy đúc sẵn hai đầu RJ45 Cat6 dài 1.5m màu xanh dương chính hãng, dùng kết nối thiết bị từ Switch sang Patch panel.',
    image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=300&auto=format&fit=crop',
    specs: ['Độ dài cáp mạng nhảy 1.5 mét', 'Lõi đồng 24 AWG truyền tải Gigabit', 'Vỏ bọc nhựa bảo vệ chốt RJ45'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-31',
    name: 'Bộ phát Wi-Fi 6 Linksys Atlas Pro 6 MX5501 Mesh',
    brand: 'Linksys',
    price: 165,
    description: 'Router phát sóng Wi-Fi Mesh 6 tốc độ cao phủ sóng diện rộng, kết nối ổn định không chập chờn cho căn hộ chung cư lớn hoặc nhà phố.',
    image: 'https://images.unsplash.com/photo-1551703599-6b3dbb57b235?q=80&w=300&auto=format&fit=crop',
    specs: ['Chuẩn Wi-Fi 6 tốc độ 5.4 Gbps', 'Phủ sóng rộng đến 250m2', 'Công nghệ Velop Intelligent Mesh tự tối ưu'],
    category: 'DEVICE',
    inStock: false
  },
  {
    id: 'prod-32',
    name: 'Switch mạng PoE Cisco Catalyst CBS250-8P-E-2G',
    brand: 'Cisco',
    price: 410,
    description: 'Switch PoE thông minh 8 cổng mạng hỗ trợ cấp nguồn cho camera IP hoặc Wifi, dòng Cisco Business CBS250 vận hành mát mẻ và bền bỉ.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=200&auto=format&fit=crop',
    specs: ['8 cổng PoE+ Gigabit & 2 cổng SFP 1G', 'Công suất nguồn POE đạt 67W', 'Hệ điều hành quản trị Web GUI đơn giản'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-33',
    name: 'Thiết bị Tường lửa Palo Alto Networks PA-440',
    brand: 'Palo Alto',
    price: 2900,
    description: 'Tường lửa thế hiện mới (NGFW) bảo mật cao cấp hàng đầu thế giới từ Palo Alto, ngăn chặn đe dọa mạng thời gian thực dựa trên học máy AI/ML.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=300&auto=format&fit=crop',
    specs: ['Tường lửa thế hệ mới dựa trên AI/ML', 'Băng thông kiểm soát App-ID tới 2.4 Gbps', 'Nhận diện đe dọa chủ động Zero-Day'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-34',
    name: 'Router định tuyến cân bằng tải Mikrotik hEX gr3',
    brand: 'Mikrotik',
    price: 75,
    description: 'Router cân bằng tải nhỏ gọn với 5 cổng mạng tốc độ 1Gbps, chịu tải tốt tới 80 user đồng thời phù hợp cho văn phòng nhỏ và hộ gia đình.',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=300&auto=format&fit=crop',
    specs: ['5 cổng mạng Gigabit Ethernet', 'Cân bằng tải đa cổng WAN linh hoạt', 'Hệ điều hành RouterOS level 4 đầy đủ'],
    category: 'DEVICE',
    inStock: true
  },
  {
    id: 'prod-35',
    name: 'Thùng Cáp mạng Cat5e UTP CommScope 305m',
    brand: 'CommScope',
    price: 110,
    description: 'Dây cáp mạng Cat5e UTP chính hãng CommScope lõi đồng đặc truyền dữ liệu lên tới 1Gbps ổn định ở cự ly ngắn dưới 80 mét.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=300&auto=format&fit=crop',
    specs: ['Chiều dài thùng 305 mét', 'Lõi đồng nguyên chất 24 AWG', 'Phù hợp thi công văn phòng vừa và nhỏ'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-36',
    name: 'Hộp 100 đầu bấm mạng RJ45 Cat5e bọc sắt',
    brand: 'OEM',
    price: 18,
    description: 'Đầu bấm mạng hạt mạng RJ45 Cat5e vỏ sắt bảo vệ chống nhiễu điện từ tốt, chân tiếp điểm mạ vàng tăng tiếp xúc điện và truyền tín hiệu.',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=250&auto=format&fit=crop',
    specs: ['Hộp 100 hạt mạng RJ45', 'Thiết kế vỏ sắt chống nhiễu tĩnh điện', 'Hỗ trợ cáp mạng Cat5e lõi mềm/lõi đặc'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-37',
    name: 'Tủ mạng Rack 6U D400 treo tường nhỏ gọn',
    brand: 'VietRack',
    price: 65,
    description: 'Tủ Rack mạng treo tường mini 6U sâu 400mm màu đen sơn tĩnh điện, cửa trước lưới thoáng khí phù hợp bảo vệ router switch tại gia đình.',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=250&auto=format&fit=crop',
    specs: ['Kích thước H320 x W550 x D400', 'Mặt trước cửa lưới thông khí tốt', 'Trang bị quạt tản nhiệt treo tường'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-38',
    name: 'Thanh ổ cắm nguồn PDU 6 cổng bắt tủ rack',
    brand: 'OEM',
    price: 25,
    description: 'Thanh ổ cắm phân phối nguồn PDU 6 ổ cắm đa năng có aptomat bảo vệ quá tải chập cháy, vỏ sắt sơn tĩnh điện bắt rack tiêu chuẩn 19 inch.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=300&auto=format&fit=crop',
    specs: ['Ổ cắm 6 cổng đa năng tiêu chuẩn', 'Aptomat 16A bảo vệ tự ngắt quá tải', 'Kích thước lắp tủ rack 1U chuẩn ngang'],
    category: 'ACCESSORY',
    inStock: true
  },
  {
    id: 'prod-39',
    name: 'Dây cáp mạng nhảy Patch Cord Cat6 CommScope 5m',
    brand: 'CommScope',
    price: 12,
    description: 'Dây nhảy mạng Cat6 hai đầu đúc sẵn RJ45 cao cấp dài 5m, thích hợp nối từ Switch sang các server tủ rack hoặc máy trạm làm việc.',
    image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=250&auto=format&fit=crop',
    specs: ['Độ dài dây nhảy 5 mét', 'Hai đầu đúc nhựa bảo vệ lẫy cắm bền bỉ', 'Tín hiệu đạt chuẩn Gigabit Cat6 đồng đặc'],
    category: 'CABLE',
    inStock: true
  },
  {
    id: 'prod-40',
    name: 'Cuộn dây buộc cáp mạng dán nhám Velcro 5m',
    brand: 'OEM',
    price: 5,
    description: 'Cuộn dây buộc cáp dạng nhám dán dính Velcro dài 5m, dễ dàng cắt nhỏ tùy chỉnh để gom bó các dây cáp mạng gọn gàng và thẩm mỹ.',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=150&auto=format&fit=crop',
    specs: ['Độ dài cuộn dính nhám 5 mét', 'Chất liệu dính nhám Velcro chắc chắn', 'Cắt rời tự do tái sử dụng nhiều lần'],
    category: 'ACCESSORY',
    inStock: true
  }
];

// Helper methods to simulate state storage on browser Client-side
const MOCK_STORAGE_KEY = 'tam_its_landing_mock_state';

interface SavedState {
  projects: Project[];
  tickets: Ticket[];
  quotations: Quotation[];
  orders: Order[];
  notifications: SystemNotification[];
  user: User;
  users: User[];
  products?: Product[];
}

export const loadMockState = (): SavedState => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Backwards compatibility for users array
      if (!parsed.users) {
        parsed.users = [
          MOCK_ADMIN,
          MOCK_CLIENT,
          {
            id: 'u-client-2',
            name: 'Nguyễn Văn B',
            email: 'vanb@gmail.com',
            role: 'CLIENT',
            company: 'VinaTech Solutions',
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            createdAt: '2026-03-01T12:00:00Z',
            password: 'client123'
          },
          {
            id: 'u-client-3',
            name: 'Trần Thị C',
            email: 'thic@company.vn',
            role: 'CLIENT',
            company: 'Logistics VietNam',
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
            createdAt: '2026-04-10T10:00:00Z',
            password: 'client123'
          }
        ];
        saveMockState(parsed);
      }
      // Ensure admin email is updated to ngthanhtam.it@gmail.com and phone is updated to 033 693 0692
      let modified = false;
      if (parsed.users) {
        parsed.users.forEach((u: any) => {
          if (u.id === 'u-admin') {
            if (u.email === 'admin@tamnguyen.dev') {
              u.email = 'ngthanhtam.it@gmail.com';
              modified = true;
            }
            if (u.phone === '090 123 4567') {
              u.phone = '033 693 0692';
              modified = true;
            }
          }
        });
      }
      if (parsed.user && parsed.user.id === 'u-admin') {
        if (parsed.user.email === 'admin@tamnguyen.dev') {
          parsed.user.email = 'ngthanhtam.it@gmail.com';
          modified = true;
        }
        if (parsed.user.phone === '090 123 4567') {
          parsed.user.phone = '033 693 0692';
          modified = true;
        }
      }
      if (modified) {
        saveMockState(parsed);
      }

      // Ensure all loaded users have passwords
      parsed.users.forEach((u: any) => {
        if (!u.password) {
          if (u.id === 'u-admin') u.password = 'admin123';
          else u.password = 'client123';
        }
      });
      // Backwards compatibility for products array
      if (!parsed.products) {
        parsed.products = DEFAULT_PRODUCTS;
        saveMockState(parsed);
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse mock state, resetting", e);
    }
  }

  // Initial State default
  const initialState: SavedState = {
    projects: MOCK_PROJECTS,
    tickets: MOCK_TICKETS,
    quotations: MOCK_QUOTATIONS,
    orders: MOCK_ORDERS,
    notifications: MOCK_NOTIFICATIONS,
    user: MOCK_CLIENT,
    users: [
      MOCK_ADMIN,
      MOCK_CLIENT,
      {
        id: 'u-client-2',
        name: 'Nguyễn Văn B',
        email: 'vanb@gmail.com',
        role: 'CLIENT',
        company: 'VinaTech Solutions',
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        createdAt: '2026-03-01T12:00:00Z',
        password: 'client123'
      },
      {
        id: 'u-client-3',
        name: 'Trần Thị C',
        email: 'thic@company.vn',
        role: 'CLIENT',
        company: 'Logistics VietNam',
        status: 'ACTIVE',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        createdAt: '2026-04-10T10:00:00Z',
        password: 'client123'
      }
    ],
    products: DEFAULT_PRODUCTS
  };
  saveMockState(initialState);
  return initialState;
};

export const saveMockState = (state: SavedState) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state));
};

