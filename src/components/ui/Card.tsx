import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  const baseClasses = 'bg-botanical-900/55 backdrop-blur-md rounded-2xl border border-botanical-500/18 shadow-lg shadow-botanical-900/10';
  const hoverClasses = hover ? 'hover:scale-105 hover:border-botanical-400/60 hover:shadow-xl hover:shadow-botanical-500/16 transition-all duration-300' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;