import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { Check, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  const plans = [
    {
      name: 'Gói Tư vấn Kỹ thuật (Advisory)',
      price: billingCycle === 'MONTHLY' ? 1200 : 960,
      desc: 'Đánh giá kiến trúc hệ thống từ chuyên gia, hướng dẫn các tiêu chuẩn vận hành tốt nhất và rà soát lỗi bảo mật.',
      features: [
        '8 giờ họp tư vấn kỹ thuật / tháng',
        'Kiểm toán mã nguồn IaC (Terraform)',
        'Hỗ trợ qua Email cam kết SLA trong 2 ngày',
        'Cung cấp báo cáo tối ưu hóa chi phí Cloud',
      ],
      cta: 'Đặt Gói Tư vấn Kéo dài',
      popular: false,
    },
    {
      name: 'Đội ngũ DevSecOps (Squad)',
      price: billingCycle === 'MONTHLY' ? 4500 : 3600,
      desc: 'Xây dựng toàn diện hạ tầng tự động, tích hợp đường ống CI/CD và cài đặt rào chắn bảo mật.',
      features: [
        '40 giờ kỹ sư làm việc thực tế / tháng',
        'Cấu hình hoàn chỉnh hệ thống CI/CD & GitOps',
        'Hỗ trợ xử lý sự cố cam kết phản hồi sau 1 ngày',
        'Cập nhật bản vá lỗ hổng bảo mật hàng tháng',
        'Kênh liên lạc Slack hỗ trợ ưu tiên trực tiếp',
      ],
      cta: 'Yêu cầu đội ngũ DevSecOps',
      popular: true,
    },
    {
      name: 'Quản trị Cloud (Managed SLA)',
      price: billingCycle === 'MONTHLY' ? 8500 : 6800,
      desc: 'Hỗ trợ kỹ thuật hệ thống sản xuất (Production), giám sát 24/7, sao lưu định kỳ và phản ứng sự cố.',
      features: [
        'Không giới hạn số lượt hỗ trợ sự cố nghiêm trọng (Severity-1)',
        'Cam kết thời gian hoạt động hệ thống SLA 99.99%',
        'Giám sát liên tục cụm Kubernetes / Serverless',
        'Cập nhật bản vá bảo mật Fortinet / Cloudflare',
        'Báo cáo sức khỏe vận hành hệ thống hàng tuần',
      ],
      cta: 'Đăng ký Hợp đồng SLA',
      popular: false,
    }
  ];

  const faqs = [
    { q: 'Mức chiết khấu hợp đồng hoạt động thế nào?', a: 'Hợp đồng năm được thanh toán một lần và được chiết khấu 20% so với hình thức thanh toán cuốn chiếu theo từng tháng.' },
    { q: 'Chúng tôi có được cộng dồn số giờ kỹ sư chưa sử dụng không?', a: 'Số giờ hỗ trợ phát triển được phân bổ cố định theo từng tháng và không cộng dồn nhằm tối ưu lịch làm việc của kỹ sư. Bạn có thể nâng cấp gói bất kỳ lúc nào.' },
    { q: 'Chi phí lắp đặt tường lửa đã bao gồm thiết bị phần cứng chưa?', a: 'Chưa bao gồm. Thiết bị phần cứng (như thiết bị tường lửa vật lý FortiGate) sẽ được lập báo giá mua sắm riêng trên Portal.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mô hình Hợp tác & Giá Dịch vụ
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Các gói dịch vụ minh bạch được thiết kế tối ưu cho doanh nghiệp khởi nghiệp và tập đoàn lớn.
        </p>
      </div>

      {/* Cycle switcher toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-xs sm:text-sm font-semibold ${billingCycle === 'MONTHLY' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Thanh toán theo Tháng</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
          className="relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none"
        >
          <span
            className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-brand-500 shadow-md ring-0 transition duration-200 ease-in-out ${
              billingCycle === 'ANNUAL' ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex items-center space-x-1.5">
          <span className={`text-xs sm:text-sm font-semibold ${billingCycle === 'ANNUAL' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Hợp đồng theo Năm</span>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-full text-[10px] font-bold">Tiết kiệm 20%</span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-panel rounded-3xl p-8 relative flex flex-col justify-between overflow-hidden border ${
              plan.popular
                ? 'border-brand-500 ring-2 ring-brand-500/15'
                : 'border-slate-200/50 dark:border-slate-800/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-1.5 rounded-bl-2xl">
                Khuyên dùng
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-12 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex items-baseline font-mono text-slate-900 dark:text-white">
                <span className="text-2xl font-bold">$</span>
                <span className="text-5xl font-extrabold tracking-tight">{plan.price.toLocaleString()}</span>
                <span className="text-xs text-slate-405 font-sans font-semibold ml-1">/ tháng</span>
              </div>

              <ul className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-6">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start text-xs sm:text-sm text-slate-655 dark:text-slate-350">
                    <Check className="h-4.5 w-4.5 text-brand-500 shrink-0 mr-2.5 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                to={PATHS.CONTACT}
                state={{ prefillSubject: `Tìm hiểu về gói đăng ký: ${plan.name}` }}
                className={`w-full flex justify-center py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all text-center ${
                  plan.popular
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/10'
                    : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center flex items-center justify-center">
          <HelpCircle className="h-5.5 w-5.5 text-brand-500 mr-2" />
          <span>Giải đáp Thắc mắc Thường gặp</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl space-y-2 border border-slate-200/40 dark:border-slate-800/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PricingPage;
