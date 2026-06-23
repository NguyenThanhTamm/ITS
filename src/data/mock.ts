import { User, Project, Ticket, Quotation, Order, SystemNotification } from '@/types';

// Standard User Mocks
export const MOCK_ADMIN: User = {
  id: 'u-admin',
  name: 'Nguyễn Thanh Tâm',
  email: 'admin@tamnguyen.dev',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  company: 'TamNguyen Enterprise IT Solutions',
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
      // Ensure all loaded users have passwords
      parsed.users.forEach((u: any) => {
        if (!u.password) {
          if (u.id === 'u-admin') u.password = 'admin123';
          else u.password = 'client123';
        }
      });
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
    ]
  };
  saveMockState(initialState);
  return initialState;
};

export const saveMockState = (state: SavedState) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state));
};
