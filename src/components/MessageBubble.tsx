import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onOptionClick?: (option: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onOptionClick }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-500`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 space-x-reverse`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-sky-500 via-emerald-500 to-green-600' 
            : 'bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`relative px-5 py-4 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-br from-sky-600 via-emerald-600 to-green-700 text-white rounded-br-md shadow-sky-500/20' 
            : 'bg-slate-800/95 text-slate-100 rounded-bl-md border border-emerald-500/30 shadow-green-500/10'
        } shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
          {/* Image Display */}
          {message.imageUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative max-w-xs mb-3 rounded-lg overflow-hidden border-2 ${
                isUser ? 'border-sky-300' : 'border-emerald-400'
              }`}
            >
              <img 
                src={message.imageUrl} 
                alt="Plant leaf" 
                className="w-full h-auto object-cover"
              />
              {isUser && (
                <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="w-3 h-3" />
                  Sent
                </div>
              )}
            </motion.div>
          )}

          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-emerald-300 prose-strong:text-green-300 prose-em:text-lime-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <pre className="bg-slate-900/90 rounded-lg p-4 overflow-x-auto border border-emerald-600/40 shadow-inner">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-slate-700/60 px-2 py-1 rounded text-lime-300 font-medium" {...props}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-slate-300 bg-slate-800/40 py-3 rounded-r">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold text-emerald-300 mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold text-emerald-300 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold text-emerald-300 mb-2">{children}</h3>,
                  strong: ({ children }) => <strong className="text-green-300 font-bold">{children}</strong>,
                  em: ({ children }) => <em className="text-lime-300">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-200">{children}</li>,
                  p: ({ children }) => <p className="leading-relaxed mb-3 last:mb-0">{children}</p>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Quick Reply Options */}
          {message.options && message.options.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {message.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onOptionClick?.(option)}
                  className="px-4 py-2 bg-green-600/40 hover:bg-green-600/60 border border-green-500/40 hover:border-green-400/70 rounded-lg text-sm text-green-200 hover:text-green-100 transition-all duration-300 hover:scale-105 font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-3 opacity-75 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Message tail */}
          <div className={`absolute top-4 w-3 h-3 ${
            isUser 
              ? 'right-0 translate-x-1 bg-gradient-to-br from-sky-600 via-emerald-600 to-green-700' 
              : 'left-0 -translate-x-1 bg-slate-800 border-l border-t border-emerald-500/30'
          } rotate-45`}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;