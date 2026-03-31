import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full';
  
  const variantClasses = {
    primary: 'bg-purple-600/20 text-purple-300 border border-purple-500/30',
    secondary: 'bg-gray-600/20 text-gray-300 border border-gray-500/30',
    success: 'bg-green-600/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-red-600/20 text-red-300 border border-red-500/30'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;