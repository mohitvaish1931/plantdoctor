import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-start space-x-4 max-w-[75%]">
        {/* Avatar */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
          <Bot className="w-5 h-5 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white animate-spin" />
          </div>
        </div>

        {/* Typing Animation */}
        <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl rounded-bl-md px-5 py-4 shadow-xl shadow-green-500/10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="text-slate-200 text-sm font-medium">Plant Doctor is analyzing...</span>
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-lime-400 to-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;