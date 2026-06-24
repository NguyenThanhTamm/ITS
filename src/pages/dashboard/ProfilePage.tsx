import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateProfile } from '@/store/authSlice';
import { updateUserProfile } from '@/store/dashboardSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
  User,
  Mail,
  Building,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Phone
} from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const profileSchema = zod.object({
  name: zod.string().min(2, { message: 'Họ tên phải chứa ít nhất 2 ký tự.' }),
  email: zod.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
  company: zod.string().min(2, { message: 'Tên công ty phải chứa ít nhất 2 ký tự.' }),
  phone: zod.string().optional(),
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Password change form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'ak-1', name: 'Webhook hóa đơn production', key: 'its_live_89324hjas78yhasj9a01', createdAt: '2026-06-16' },
    { id: 'ak-2', name: 'Khóa API đo đạc Staging', key: 'its_test_0192hjkashdu0121asd9', createdAt: '2026-06-20' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    dispatch(updateProfile(data));
    if (user?.id) {
      dispatch(updateUserProfile({ userId: user.id, ...data }));
    }
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá 1MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        dispatch(updateProfile({ avatar: base64Data }));
        if (user?.id) {
          dispatch(updateUserProfile({
            userId: user.id,
            name: user.name,
            email: user.email,
            avatar: base64Data
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    if (!user) return;
    const initialAvatar = user.name.trim().charAt(0).toUpperCase() || '?';
    dispatch(updateProfile({ avatar: initialAvatar }));
    dispatch(updateUserProfile({
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: initialAvatar
    }));
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (currentPassword !== user?.password) {
      setPasswordError('Mật khẩu hiện tại không chính xác.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải chứa ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    dispatch(updateProfile({ password: newPassword }));
    if (user?.id) {
      dispatch(updateUserProfile({
        userId: user.id,
        name: user.name,
        email: user.email,
        password: newPassword
      }));
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleGenerateApiKey = () => {
    const keyName = prompt('Nhập tên nhãn mô tả cho API Key mới này:');
    if (!keyName || !keyName.trim()) return;

    const randomChars = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey: ApiKey = {
      id: `ak-${Date.now()}`,
      name: keyName.trim(),
      key: `its_live_${randomChars}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteApiKey = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa API này? Mọi hệ thống bên ngoài đang kết nối sử dụng khóa này sẽ ngay lập tức bị từ chối truy cập.')) return;
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Profile credentials form */}
      <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3.5 border-b border-slate-100 dark:border-slate-850 flex items-center">
          <User className="h-5 w-5 text-brand-500 mr-2" />
          <span>Hồ sơ & Thông tin cá nhân</span>
        </h2>

        {profileSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-lg text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
            <span>Thông tin hồ sơ đã được cập nhật thành công.</span>
          </div>
        )}

        {/* Avatar Settings Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/20 dark:bg-slate-900/10 text-left">
          <Avatar avatar={user?.avatar} name={user?.name || ''} className="h-16 w-16 text-xl" />
          <div className="flex-grow space-y-1.5 text-center sm:text-left">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Ảnh đại diện</h3>
            <p className="text-[10px] text-slate-455">Tải ảnh định dạng JPG, PNG. Kích thước tối đa 1MB.</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <label className="inline-flex items-center px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-[10px] shadow cursor-pointer transition-colors">
                <Camera className="h-3.5 w-3.5 mr-1" />
                <span>Tải ảnh mới</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </label>
              {user?.avatar && user.avatar.length > 1 && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-500 dark:text-slate-400 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  <span>Xóa ảnh</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Name */}
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
                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
                } text-slate-900 dark:text-white focus:outline-none`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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
                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
                } text-slate-900 dark:text-white focus:outline-none`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Tên công ty / doanh nghiệp
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Building className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                {...register('company')}
                placeholder="Công ty TNHH Mới"
                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border ${
                  errors.company ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
                } text-slate-900 dark:text-white focus:outline-none`}
              />
            </div>
            {errors.company && (
              <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
            )}
          </div>

          {/* Phone / Hotline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Số điện thoại / Hotline
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Phone className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                {...register('phone')}
                placeholder="Ví dụ: 090 123 4567"
                className="block w-full pl-10 pr-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow transition-colors cursor-pointer text-xs sm:text-sm"
          >
            Lưu Thiết lập Hồ sơ
          </button>
        </form>
      </div>

      {/* Right Column: Change Password & API Keys Manager */}
      <div className="lg:col-span-6 space-y-8 text-left">
        
        {/* Change Password Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3.5 border-b border-slate-100 dark:border-slate-850 flex items-center">
            <Lock className="h-5 w-5 text-brand-500 mr-2" />
            <span>Thay đổi Mật khẩu</span>
          </h2>

          {passwordSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
              <span>Thay đổi mật khẩu thành công.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping mr-1" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showPassCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassCurrent(!showPassCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="block w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassNew(!showPassNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Xác nhận Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="block w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassConfirm(!showPassConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow transition-colors cursor-pointer text-xs sm:text-sm"
            >
              Cập nhật Mật khẩu mới
            </button>
          </form>
        </div>

        {/* API Keys Manager */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Key className="h-5 w-5 text-brand-500 mr-2" />
              <span>Quản lý Khóa API kết nối</span>
            </h2>
            <button
              onClick={handleGenerateApiKey}
              className="inline-flex items-center px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-xs shadow cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Tạo API Key</span>
            </button>
          </div>

          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Key className="h-8 w-8 text-slate-350 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs">Không tìm thấy khóa API nào. Khởi tạo khóa mới để bắt đầu tích hợp phần mềm.</p>
              </div>
            ) : (
              apiKeys.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/30 dark:bg-slate-955/20 text-left space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">{item.createdAt}</span>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <input
                      type="password"
                      readOnly
                      value={item.key}
                      className="flex-grow px-3 py-1.5 rounded bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs font-mono select-all focus:outline-none text-slate-650 dark:text-slate-350"
                    />
                    
                    {/* Copy button */}
                    <button
                      onClick={() => handleCopy(item.id, item.key)}
                      className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-450"
                      title="Sao chép Key"
                    >
                      {copiedKeyId === item.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteApiKey(item.id)}
                      className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-red-500/10 hover:text-red-500 rounded text-slate-450"
                      title="Xóa Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
