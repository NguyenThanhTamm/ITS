import React from 'react';

interface AvatarProps {
  avatar?: string;
  name: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ avatar, name, className = "h-8 w-8" }) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
  const isUrl = avatar && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/') || avatar.startsWith('data:'));

  if (isUrl) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${className} rounded-full object-cover shrink-0`}
      />
    );
  }

  // Generate a premium gradient based on the initials to make it colorful
  const gradients = [
    'from-blue-500 to-indigo-650',
    'from-emerald-450 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-rose-550 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600'
  ];
  const charCode = firstLetter.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  return (
    <div className={`${className} rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-bold text-[10px] sm:text-xs tracking-wider shadow-inner uppercase shrink-0 select-none`}>
      {firstLetter}
    </div>
  );
};

export default Avatar;
