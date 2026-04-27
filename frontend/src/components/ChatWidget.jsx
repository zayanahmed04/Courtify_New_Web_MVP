import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axios';
import { API_PATH } from '../utils/apiPath';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      warmupChat();
    }
  }, [isOpen, messages.length]);

  const warmupChat = async () => {
    try {
      await axiosInstance.get(API_PATH.CHAT.WARMUP);
    } catch (error) {
      console.error('Warmup failed:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATH.CHAT.ASK, {
        message: userMessage.text,
      });
      console.log(response);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response.data.reply || response.data.answer || 'No response received',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer z-40 transition-all duration-300 transform hover:scale-110 active:scale-95"
          title="Open chat"
          aria-label="Open chat widget"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-green-100">
          {/* Header */}
          <div className="flex justify-between items-center bg-linear-to-r from-green-500 via-green-550 to-green-600 p-4 rounded-t-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Courtify Assistant</h3>
                <p className="text-green-50 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-600/30 p-2 rounded-full transition-all duration-200 hover:scale-110"
              title="Close chat"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 font-medium text-sm mb-2">Hello! 👋</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Ask me anything about booking courts, managing reservations, or using Courtify.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs px-4 py-3 rounded-2xl transition-all ${
                    msg.type === 'user'
                      ? 'bg-linear-to-r from-green-500 to-green-600 text-white rounded-br-none shadow-md'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed wrap-break-word">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${msg.type === 'user' ? 'text-green-100' : 'text-gray-600'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-white rounded-b-2xl">
            <form onSubmit={sendMessage} className="flex gap-2 items-end">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm placeholder-gray-400 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-2.5 rounded-full transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  );
}
