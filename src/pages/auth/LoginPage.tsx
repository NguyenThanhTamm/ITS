import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '@/store/authSlice';
import { RootState } from '@/store';
import { loadMockState, saveMockState } from '@/data/mock';
import { loginApi } from '@/lib/api';
import { PATHS } from '@/routes/paths';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
  password: zod.string().min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự.' }),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || PATHS.DASHBOARD.OVERVIEW;

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(loginStart());
    try {
      const result = await loginApi(data.email, data.password);
      
      // Update session storage or localStorage copy if we are in fallback mode
      const mockState = loadMockState();
      mockState.user = result.user;
      saveMockState(mockState);

      dispatch(loginSuccess({ user: result.user, token: result.token }));
      navigate(from, { replace: true });
    } catch (e: any) {
      dispatch(loginFailure(e.message || 'Đăng nhập không thành công.'));
    }
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Đăng nhập hệ thống
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nhập email của bạn để truy cập vào Portal Khách hàng.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                errors.email
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mật khẩu
            </label>
            <a href="#" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`block w-full pl-10 pr-10 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 border transition-all ${
                errors.password
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
              } text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-brand-650 to-brand-500 hover:from-brand-500 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Đang kết nối...</span>
            </span>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>



      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Chưa đăng ký tài khoản khách?{' '}
          <Link to={PATHS.REGISTER} className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Tạo tài khoản tại đây
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
