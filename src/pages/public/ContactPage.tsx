import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const contactSchema = zod.object({
  name: zod.string().min(2, { message: 'Vui lòng nhập họ tên của bạn.' }),
  email: zod.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
  subject: zod.string().min(3, { message: 'Tiêu đề yêu cầu phải có ít nhất 3 ký tự.' }),
  message: zod.string().min(10, { message: 'Nội dung yêu cầu phải chứa ít nhất 10 ký tự.' }),
});

type ContactFormValues = zod.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const location = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const prefillSubject = (location.state as any)?.prefillSubject || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: prefillSubject,
      message: '',
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsLoading(true);
    // Simulate server call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Kiến tạo Giải pháp Vững chắc
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Hãy liên hệ để thảo luận về kế hoạch di trú Cloud, yêu cầu bản vẽ đề xuất kỹ thuật hoặc các gói hợp đồng hỗ trợ vận hành.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left column: Contact Info card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-2xl space-y-8 relative overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
            <div className="absolute top-0 right-0 h-16 w-16 bg-brand-500/5 rounded-full blur-xl pointer-events-none" />

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-850">
              Kênh Liên hệ Trực tiếp
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-505 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hộp thư điện tử</h3>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">ngthanhtam.it@gmail.com</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">Thời gian phản hồi: Dưới 4 tiếng làm việc</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-505 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đường dây nóng hỗ trợ</h3>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">+84 336 930 692</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">Ưu tiên xử lý nhanh cho các đối tác đã ký hợp đồng SLA</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-505 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trung tâm vận hành</h3>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Thành phố Hồ Chí Minh, Việt Nam</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">Cung cấp dịch vụ quản trị hạ tầng trên phạm vi toàn cầu</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-550 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái vận hành hiện tại</h3>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-450 mt-1 flex items-center">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    <span>Hệ thống GMT+7 Đang Hoạt động</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Simulating security certificate */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center space-x-3 text-xs text-slate-450">
              <MessageSquare className="h-5 w-5 text-brand-500 shrink-0" />
              <span>Thông tin gửi qua biểu mẫu này được bảo vệ an toàn và gửi trực tiếp tới hòm thư kỹ thuật viên.</span>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-850 mb-6">
              Biểu mẫu Gửi Yêu cầu tư vấn
            </h2>

            {isSubmitted && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-xl text-sm font-semibold flex items-center space-x-2.5 mb-6">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Yêu cầu đã được gửi thành công! Tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Họ và tên của bạn
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Nguyễn Văn A"
                    className={`block w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                      } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Địa chỉ Email nhận phản hồi
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="ten@congty.com"
                    className={`block w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                      } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Tiêu đề yêu cầu
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="Ví dụ: Đăng ký tư vấn kiểm toán hạ tầng AWS"
                  className={`block w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border ${errors.subject ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none`}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Nội dung chi tiết yêu cầu
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Mô tả ngắn gọn về công nghệ bạn sử dụng, quy mô dự án và mục tiêu hỗ trợ kỹ thuật..."
                  className={`block w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-955 border ${errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang gửi thông tin...</span>
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    <span>Gửi thông tin an toàn</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
