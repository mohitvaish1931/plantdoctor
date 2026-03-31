import React from 'react';
import { User, Bot } from 'lucide-react';

interface AvatarProps {
  type: 'user' | 'bot';
  size?: 'sm' | 'md' | 'lg';
  emoji?: string;
}

const Avatar: React.FC<AvatarProps> = ({ type, size = 'md', emoji }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const gradientClasses = type === 'user' 
    ? 'bg-gradient-to-br from-blue-500 via-emerald-500 to-green-500'
    : 'bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400';

  return (
    <div className={`${sizeClasses[size]} ${gradientClasses} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
      {emoji ? (
        <span className="text-white text-lg">{emoji}</span>
      ) : type === 'user' ? (
        <User className={`${iconSizes[size]} text-white`} />
      ) : (
        <Bot className={`${iconSizes[size]} text-white`} />
      )}
    </div>
  );
};

export default Avatar;