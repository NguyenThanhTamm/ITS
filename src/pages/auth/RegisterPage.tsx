import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { User, Mail, Lock, Building, Check } from 'lucide-react';
import { loadMockState, saveMockState } from '@/data/mock';
import { useDispatch } from 'react-redux';
import { addUser } from '@/store/dashboardSlice';

const registerSchema = zod.object({
  name: zod.string().min(2, { message: 'Họ tên phải chứa ít nhất 2 ký tự.' }),
  email: zod.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
  company: zod.string().min(2, { message: 'Tên công ty phải chứa ít nhất 2 ký tự.' }),
  password: zod.string().min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự.' }),
  confirmPassword: zod.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    // Simulate API registration call with localStorage mock state persistence
    setTimeout(() => {
      try {
        const mockState = loadMockState();
        
        // Check if email already exists
        const exists = mockState.users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (exists) {
          setIsLoading(false);
          alert('Địa chỉ email này đã tồn tại trong hệ thống. Vui lòng đăng nhập.');
          return;
        }

        const newUser = {
          id: `u-${Math.floor(1000 + Math.random() * 9000)}`,
          name: data.name,
          email: data.email,
          company: data.company,
          role: 'CLIENT' as const,
          avatar: data.name.trim().charAt(0).toUpperCase() || '?',
          status: 'ACTIVE' as const,
          createdAt: new Date().toISOString(),
          password: data.password,
        };

        mockState.users.push(newUser);
        saveMockState(mockState);
        dispatch(addUser(newUser));

        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate(PATHS.LOGIN);
        }, 2000);
      } catch (err) {
        setIsLoading(false);
        console.error('Registration failed', err);
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Đăng ký thành công!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Portal khách hàng đã sẵn sàng khởi tạo. Đang chuyển hướng bạn tới trang đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tạo tài khoản Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Đăng ký tài khoản để yêu cầu báo giá kỹ thuật và theo dõi tiến độ dự án.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Họ và tên
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <User className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              {...register('name')}
              placeholder="Nguyễn Văn A"
              className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border transition-all ${
                errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Địa chỉ Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <input
              type="email"
              {...register('email')}
              placeholder="ten@congty.com"
              className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border transition-all ${
                errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Company Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Tên doanh nghiệp
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Building className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              {...register('company')}
              placeholder="Công ty TNHH Giải pháp mới"
              className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border transition-all ${
                errors.company ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
          </div>
          {errors.company && (
            <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border transition-all ${
                errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border transition-all ${
                errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-brand-650 to-brand-500 hover:from-brand-500 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Đang tạo tài khoản...</span>
            </span>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Đã có tài khoản?{' '}
          <Link to={PATHS.LOGIN} className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
