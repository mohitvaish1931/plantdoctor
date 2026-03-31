import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, ImageIcon, Camera } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedImage) && !disabled) {
      onSendMessage(message, selectedImage || undefined);
      setMessage('');
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-emerald-600/30 bg-gradient-to-r from-slate-900/95 via-green-900/90 to-slate-900/95 backdrop-blur-md shadow-2xl shadow-emerald-900/30">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-4 max-w-xs mx-auto relative">
            <img 
              src={selectedImage} 
              alt="Selected plant leaf" 
              className="w-full h-auto rounded-lg border-2 border-green-500/50"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-end space-x-4 max-w-4xl mx-auto">
          {/* Image Upload Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-emerald-400 hover:text-emerald-300 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:hover:scale-100 disabled:cursor-not-allowed"
              title="Upload image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-emerald-400 hover:text-emerald-300 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:hover:scale-100 disabled:cursor-not-allowed"
              title="Take photo"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={disabled}
            />
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "Plant Doctor is analyzing..." : "Describe your plant's symptoms... I'm here to help! 🌿"}
              disabled={disabled}
              rows={1}
              className="w-full px-5 py-4 bg-slate-800/95 border border-emerald-500/40 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-400/60 resize-none min-h-[56px] max-h-36 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg backdrop-blur-sm hover:bg-slate-800/80 hover:border-emerald-500/60 focus:bg-slate-800"
            />
            {message.trim() && (
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded">
                Shift + Enter for new line
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={(!message.trim() && !selectedImage) || disabled}
            className="w-14 h-14 bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 hover:from-green-500 hover:via-emerald-500 hover:to-lime-400 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 hover:scale-110 disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {disabled ? (
              <Loader2 className="w-6 h-6 animate-spin relative z-10" />
            ) : (
              <div className="relative z-10 flex items-center justify-center">
                <Send className="w-6 h-6" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;