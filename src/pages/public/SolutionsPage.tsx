import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Layers, ChevronRight, Check } from 'lucide-react';

interface SolutionVertical {
  title: string;
  icon: any;
  tagline: string;
  benefits: string[];
  architecture: string[];
  compliance: string[];
  image: string;
}

export const SolutionsPage: React.FC = () => {
  const verticals: SolutionVertical[] = [
    {
      title: 'Hệ thống Fintech & Cơ sở dữ liệu Tài chính',
      icon: ShieldCheck,
      tagline: 'Cơ sở dữ liệu tài chính có tính bảo mật cao, tuân thủ các khung bảo mật quốc tế SOC 2 Type II và PCI-DSS.',
      benefits: [
        'Nhân bản cơ sở dữ liệu liên vùng thời gian thực phòng ngừa sự cố',
        'Mã hóa đường truyền dữ liệu toàn vẹn chuẩn kết nối TLS 1.3',
        'Lịch sử kiểm toán được đồng bộ liên tục về trung tâm giám sát an ninh SIEM'
      ],
      architecture: ['AWS Aurora Global DB', 'HashiCorp Vault HSM', 'Cloudflare WAF Advanced Rules'],
      compliance: ['PCI-DSS Level 1', 'SOC 2 Type II', 'ISO 27001'],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400&auto=format&fit=crop'
    },
    {
      title: 'Thương mại Điện tử (E-Commerce) Tải trọng lớn',
      icon: Zap,
      tagline: 'Hạ tầng có khả năng đàn hồi và mở rộng tự động để phục vụ các sự kiện Flash-sale lượng truy cập tăng vọt.',
      benefits: [
        'Tự động tăng số lượng container node phản hồi chỉ trong vài giây',
        'Cấu hình bộ nhớ đệm phân tán giúp giảm tải 85% truy vấn trực tiếp vào DB',
        'Tích hợp CDN tại biên mạng giảm tối đa độ trễ phản hồi trang'
      ],
      architecture: ['Kubernetes EKS Clusters', 'Redis Enterprise Cluster', 'Fastly / Cloudflare Cache'],
      compliance: ['GDPR Compliant', 'CCPA Privacy Standards'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop'
    },
    {
      title: 'Logistics, Chuỗi cung ứng & Giám sát IoT',
      icon: Layers,
      tagline: 'Luồng dữ liệu định hướng sự kiện xử lý trơn tru thông tin tọa độ từ hàng triệu thiết bị IoT đồng thời.',
      benefits: [
        'Hàng đợi Kafka giảm thiểu tối đa rủi ro mất gói tin khi nghẽn mạng',
        'Hàm xử lý Serverless tính toán nhanh chóng thông tin lộ trình',
        'Cơ sở dữ liệu Time-series chuyên biệt lưu trữ lịch sử hành trình'
      ],
      architecture: ['Apache Kafka Event Streams', 'AWS Lambda Functions', 'TimescaleDB / DynamoDB'],
      compliance: ['ISO 9001 Integration', 'NIST Cybersecurity Guidelines'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Giải pháp Doanh nghiệp & Hệ thống SaaS
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Kiến trúc hệ thống được tối ưu hóa cho từng ngành hàng, đáp ứng các tiêu chuẩn tuân thủ bảo mật và khả năng chịu tải cao.
        </p>
      </div>

      {/* Vertical list */}
      <div className="space-y-16">
        {verticals.map((v, idx) => {
          const Icon = v.icon;
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2 aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-900">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {v.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-650 dark:text-slate-355 leading-relaxed font-medium">
                  {v.tagline}
                </p>

                {/* Benefits */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Ưu điểm vận hành</h3>
                  <ul className="space-y-1.5">
                    {v.benefits.map((b) => (
                      <li key={b} className="flex items-start text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <Check className="h-4 w-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech & Compliance Specs */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Mô hình Công nghệ</h4>
                    <div className="flex flex-wrap gap-1">
                      {v.architecture.map(a => (
                        <span key={a} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[9px] font-semibold font-mono">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Tiêu chuẩn tuân thủ</h4>
                    <div className="flex flex-wrap gap-1">
                      {v.compliance.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded text-[9px] font-bold">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={PATHS.CONTACT}
                    className="inline-flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500"
                  >
                    <span>Yêu cầu chi tiết giải pháp</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default SolutionsPage;
