import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS } from '@/routes/paths';
import { Shield, Cloud, Cpu, ArrowRight, Zap, Star } from 'lucide-react';

export const HomePage: React.FC = () => {
  const stats = [
    { value: '10+', label: 'Năm kinh nghiệm thực tế' },
    { value: '50+', label: 'Hạ tầng di trú Cloud thành công' },
    { value: '99.99%', label: 'Độ khả dụng hệ thống thiết kế' },
    { value: '10 triệu+', label: 'Chi phí Cloud tối ưu được ($)' },
  ];

  const highlights = [
    {
      icon: Cloud,
      title: 'Kiến trúc & Kỹ nghệ hạ tầng Cloud',
      desc: 'Cấu hình cụm hạ tầng đa phân vùng, tối ưu hóa dịch vụ không máy chủ serverless và tự động hóa Terraform IaC giúp tiết kiệm chi phí vận hành.',
    },
    {
      icon: Shield,
      title: 'Hệ thống Bảo mật mạng Zero Trust',
      desc: 'Xác thực định danh tập trung SSO, cổng bảo vệ biên mạng Fortinet, các chính sách Cloudflare Access và quét kiểm toán lỗ hổng bảo mật tự động.',
    },
    {
      icon: Cpu,
      title: 'Tự động hóa DevSecOps & CI/CD',
      desc: 'Đường ống tích hợp mã nguồn tự động cài đặt sẵn các lớp quét an ninh mã nguồn tĩnh SAST, quét lỗi thư viện phụ thuộc và triển khai ArgoCD GitOps.',
    },
  ];

  const testimonials = [
    {
      quote: "Tâm đã thiết kế một giải pháp hạ tầng AWS đa vùng hoàn hảo cho sổ cái giao dịch của chúng tôi. Độ trễ cơ sở dữ liệu đã giảm 45% chỉ sau một đêm, giúp hệ thống vượt qua cuộc kiểm toán bảo mật SOC 2 thành công rực rỡ.",
      author: "Marcus Aurelius",
      title: "Phó giám đốc hạ tầng, ApexCorp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    },
    {
      quote: "Giải pháp Zero Trust đã chấm dứt hoàn toàn các mối lo về rò rỉ dữ liệu của nhân viên làm việc từ xa. Hơn 1000 nhân sự làm việc nhanh chóng mà không hề bị trễ mạng. Một thiết kế mạng xuất sắc.",
      author: "Samantha Reynolds",
      title: "Trưởng phòng Bảo mật CISO, Fintech Global Ltd",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-xs font-semibold mb-6 border border-brand-500/20"
          >
            <Zap className="h-3 w-3 text-brand-500 fill-brand-500" />
            <span>Hạ tầng Đám mây Doanh nghiệp Cao cấp</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight"
          >
            Kiến tạo Vận hành Cloud{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-enterprise-accent-cyan bg-clip-text text-transparent">
              Bảo mật & Tự động
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Tôi chuyên thiết kế nền tảng đám mây chịu lỗi, xây dựng đường ống phân phối mã tự động và cấu hình Zero Trust đảm bảo an toàn vận hành phần mềm doanh nghiệp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={PATHS.CONTACT}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-200"
            >
              <span>Yêu cầu Tư vấn Kiến trúc</span>
              <ArrowRight className="ml-2 h-4.5 w-4.5" />
            </Link>
            <Link
              to={PATHS.SOLUTIONS}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold rounded-xl transition-all"
            >
              <span>Xem Giải pháp Doanh nghiệp</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero BG grid mesh */}
        <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none opacity-60" />
      </section>

      {/* 2. Stats Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl text-center"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Value Proposition Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Thiết kế cho Tính Khả dụng & Tuân thủ Bảo mật
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Hệ thống doanh nghiệp yêu cầu bảo mật hiện đại và chỉ số SLA tin cậy nghiêm ngặt. Tôi cung cấp giải pháp chuyên sâu trong các lĩnh vực cốt lõi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                  <Link to={PATHS.SERVICES} className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center">
                    <span>Xem tính năng chi tiết</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Testimonials Slider */}
      <section className="bg-slate-100/50 dark:bg-slate-900/20 py-20 border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-1 text-xs text-brand-500 font-bold tracking-wider uppercase mb-2">
              <Star className="h-3 w-3 fill-brand-500" />
              <span>Đánh giá từ khách hàng</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Được tin cậy bởi các quản lý cấp cao trên thế giới
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl flex flex-col justify-between"
              >
                <p className="italic text-slate-650 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center mt-6 space-x-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="h-11 w-11 rounded-full ring-2 ring-brand-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</h4>
                    <p className="text-xs text-slate-450 dark:text-slate-400">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 to-indigo-950 px-8 py-12 sm:px-16 sm:py-20 text-center shadow-2xl border border-white/5"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Sẵn sàng tự động hóa vận hành doanh nghiệp?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Đăng ký tư vấn miễn phí, ước tính ngân sách thiết lập hạ tầng Cloud hoặc trải nghiệm cổng thông tin portal dành riêng cho khách hàng.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to={PATHS.CONTACT}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                Liên hệ ngay
              </Link>
              <Link
                to={PATHS.LOGIN}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all"
              >
                Đăng nhập Portal Khách hàng
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default HomePage;
