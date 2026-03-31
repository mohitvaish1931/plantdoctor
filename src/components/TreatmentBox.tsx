import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TreatmentBoxProps {
  title: string;
  treatments: string[];
  icon?: string;
}

const TreatmentBox: React.FC<TreatmentBoxProps> = ({ 
  title, 
  treatments,
  icon = '✓'
}) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-green-500/30 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-5 shadow-lg shadow-green-500/20 backdrop-blur-sm"
    >
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        {title}
      </h3>
      
      <div className="space-y-3">
        {treatments.map((treatment, index) => (
          <motion.div
            key={index}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white font-bold" />
            </div>
            <p className="text-white text-sm leading-relaxed">
              {treatment}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TreatmentBox;
