import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ImageMessageProps {
  imageUrl: string;
  timestamp?: string;
  isSent?: boolean;
}

const ImageMessage: React.FC<ImageMessageProps> = ({ 
  imageUrl, 
  timestamp,
  isSent = true 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative max-w-xs ${isSent ? 'ml-auto' : ''}`}
    >
      <div className={`relative rounded-2xl overflow-hidden shadow-lg ${
        isSent ? 'border-2 border-green-400' : 'border-2 border-green-500'
      }`}>
        <img 
          src={imageUrl} 
          alt="Plant leaf" 
          className="w-full h-auto object-cover"
        />
        
        {isSent && (
          <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3 h-3" />
            Sent
          </div>
        )}
        
        {!isSent && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20" />
        )}
      </div>
      
      {timestamp && (
        <p className="text-xs text-slate-400 mt-2 text-center">
          {timestamp}
        </p>
      )}
    </motion.div>
  );
};

export default ImageMessage;
