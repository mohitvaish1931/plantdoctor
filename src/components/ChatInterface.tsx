import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Message, UserProgress } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import Button from './ui/Button';
import Card from './ui/Card';
import Avatar from './Avatar';
import { apiService } from '../services/apiService';
import { progressService } from '../services/progressService';
import type { ChatMessage } from '../services/apiService';

interface ChatInterfaceProps {
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(progressService.getProgress());
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [userName] = useState(
    () => localStorage.getItem('learnerbot_username') || 'Learning Champion'
  );
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Responsive: track desktop vs mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial welcome message & first badge (avoid double-fire in StrictMode)
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: `🌿 Welcome, ${userName}! I'm your Plant Doctor, your AI botanical expert! I'm excited to help you keep your plants healthy and thriving! \n\nI can help you identify plant diseases, diagnose problems, and provide cure methods. What plant issue would you like to explore today? \n\nLet's get your garden in perfect health! 🌱`,
      timestamp: new Date(),
      isQuestion: true,
      options: [
        "Identify a plant disease 🦠",
        'Pest control methods 🪲',
        'Plant care tips 🌿',
        'Treat leaf problems 🍂',
      ],
      emoji: '🌿',
    };

    setMessages([welcomeMessage]);

    const badge = progressService.earnBadge('first-chat');
    if (badge) {
      triggerConfetti();
      setProgress(progressService.getProgress());
    }
  }, [userName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Scroll to bottom for new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerConfetti = async () => {
    try {
      // Load confetti from CDN if not available locally
      if (typeof window !== 'undefined' && !(window as any).confetti) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
        script.onload = () => {
          const confetti = (window as any).confetti;
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 140,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#22C55E', '#10B981', '#84CC16', '#16A34A'],
              scalar: 1.1,
            });
          }
        };
        document.head.appendChild(script);
      } else if ((window as any).confetti) {
        const confetti = (window as any).confetti;
        confetti({
          particleCount: 140,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#10B981', '#84CC16', '#16A34A'],
          scalar: 1.1,
        });
      }
    } catch (e) {
      // Silently fail if canvas-confetti is not available
      console.warn('confetti not available');
    }
  };

  const callApi = async (message: string, imageUrl?: string): Promise<string> => {
    try {
      const response = await apiService.sendMessage(message, conversationHistory, imageUrl);

      // Log but don't break UX for missing API key
      if (response.error && !response.error.includes('API key not configured')) {
        console.warn('API Warning:', response.error);
      }

      return response.message;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
      setConversationHistory([]);
      hasInitializedRef.current = false;
      // Re-initialize welcome message
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `🌿 Welcome back! I'm your Plant Doctor. How can I help your garden today?`,
          timestamp: new Date(),
          isQuestion: true,
          options: [
            "Identify a plant disease 🦠",
            'Pest control methods 🪲',
            'Plant care tips 🌿',
            'Treat leaf problems 🍂',
          ],
          emoji: '🌿',
        };
        setMessages([welcomeMessage]);
        hasInitializedRef.current = true;
      }, 100);
    }
  };

  // Award badges based on message count (after each update)
  useEffect(() => {
    if (messages.length >= 10) {
      const badge = progressService.earnBadge('curious-mind');
      if (badge) {
        triggerConfetti();
        setProgress(progressService.getProgress());
      }
    }
  }, [messages.length]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if ((!content.trim() && !imageUrl) || isTyping) return;

    const cleanContent = content.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: cleanContent || (imageUrl ? "🖼️ Sent a plant image for analysis" : ""),
      timestamp: new Date(),
      imageUrl: imageUrl,
    };

    setMessages((prev) => [...prev, userMessage]);

    const newUserMessage: ChatMessage = { 
      role: 'user', 
      content: cleanContent || (imageUrl ? "I've uploaded a plant leaf image. Please analyze it for diseases and provide treatment recommendations." : "")
    };
    setConversationHistory((prev) => [...prev, newUserMessage]);

    setIsTyping(true);

    try {
      const botResponse = await callApi(cleanContent, imageUrl);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        emoji: '🌿',
      };

      setMessages((prev) => [...prev, botMessage]);

      const newBotMessage: ChatMessage = { role: 'assistant', content: botResponse };
      setConversationHistory((prev) => [...prev, newBotMessage]);

      // XP progression
      const updatedProgress = progressService.addXP(10);
      setProgress(updatedProgress);
      // Award a small token for using the bot

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          "Oops! Something went wrong, but don't worry - I'm still here to help you learn amazing things! Let's try again! 🌟",
        timestamp: new Date(),
        emoji: '😅',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat API Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 flex items-stretch justify-center text-white">
      {/* App shell for nicer desktop centering */}
      <div className="chat-interface relative flex h-full w-full max-w-7xl mx-auto md:my-4 md:rounded-3xl md:border md:border-botanical-600/30 md:shadow-[0_0_60px_rgba(16,88,48,0.08)] overflow-hidden bg-botanical-900/60 backdrop-blur-2xl">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="fixed md:hidden top-4 left-4 z-50 w-11 h-11 bg-botanical-900/90 hover:bg-botanical-800/90 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-botanical-700/60"
        >
          {showSidebar ? (
            <X className="w-6 h-6 text-slate-200" />
          ) : (
            <Menu className="w-6 h-6 text-slate-200" />
          )}
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {(showSidebar || isDesktop) && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed md:relative z-40 w-80 h-full bg-botanical-900/85 backdrop-blur-xl border-r border-botanical-600/20 shadow-2xl flex-shrink-0"
            >
              <div className="p-5 h-full overflow-y-auto space-y-6 custom-scrollbar">
                {/* Profile Card */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-5 mb-3 bg-slate-900/90 border-emerald-500/30 shadow-lg hover:border-green-400/60 hover:shadow-green-500/20 transition-all duration-300">
                    <div className="flex flex-col items-center text-center">
                      <Avatar type="user" size="lg" />
                      <h3 className="text-xl font-extrabold text-white mt-4 mb-1">
                        {userName}!
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-emerald-300 font-medium">
                        <span>🌿 Plant Doctor</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        AI Botanical Assistant
                      </p>
                    </div>
                  </Card>
                </motion.div>





                  <Button
                    onClick={handleResetChat}
                    variant="outline"
                    className="w-full !py-2.5 rounded-xl text-sm font-semibold border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    🗑️ Clear Conversation
                  </Button>

                {/* Plant Care Tip Card */}
                <Card className="p-4 mt-2 bg-gradient-to-r from-green-600/30 via-emerald-600/30 to-lime-600/30 border-green-500/40 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                    🌿 Plant Care Tip
                  </h4>
                  <p className="text-xs text-slate-100 leading-relaxed">
                    Early detection is key! Regularly inspect your plant leaves for any unusual spots, discoloration, or wilting. The sooner you catch a problem, the better the treatment results! 🔍
                  </p>
                </Card>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-botanical-700 to-botanical-500 backdrop-blur-xl border-b border-botanical-600 px-4 py-4 shadow-lg shadow-botanical-900/40">
            <div className="flex items-center justify-between max-w-5xl mx-auto gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>🌱</span> Plant Disease ID
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs md:text-sm text-white/90">
                      Upload a leaf photo to diagnose
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-3 text-sm">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-lg flex items-center justify-center transition-all border border-white/20 text-white backdrop-blur-md">
                  <span className="text-xl">?</span>
                </button>
                <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all border border-white/30 text-white backdrop-blur-md">
                  <span className="text-xl">🏠</span>
                </button>
                <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all border border-white/30 text-white backdrop-blur-md">
                  <span className="text-xl">⚙️</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 relative custom-scrollbar bg-transparent"
          >
            {/* Soft animated background blobs */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="absolute top-16 left-16 w-40 h-40 bg-green-500/40 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-20 right-20 w-56 h-56 bg-emerald-500/40 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-4">
              {/* subtle “today” pill when there are messages */}
              {messages.length > 0 && (
                <div className="flex justify-center mb-1">
                  <span className="px-3 py-1 text-[11px] rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300">
                    ✨ New learning session
                  </span>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onOptionClick={handleOptionClick}
                />
              ))}

              {isTyping && <TypingIndicator />}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input – sticky with slight elevated card */}
          <div className="border-t border-botanical-800/70 bg-botanical-900/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3">
              <div className="rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
                <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-500 text-center">
                Tip: Ask “Give me a fun quiz on …” to practice what you’ve learned 🎯
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && !isDesktop && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
