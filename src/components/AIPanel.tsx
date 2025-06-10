
import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import numiImage from '../assets/numi-doll.png';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};

export const AIPanel: React.FC = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hi! I'm NUMI, your assistant. Ask me anything about plant operations!" }
  ]);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Ask about today's GPM...",
    "What's the current temperature?",
    "Show me the production report.",
    "Are there any alarms active?",
    "How do I reset the system?",
    "Explain the process flow."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || isMobile) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.drag-handle')) return;

      dragOffset.current = {
        x: e.clientX - panel.getBoundingClientRect().left,
        y: e.clientY - panel.getBoundingClientRect().top,
      };

      const handleMouseMove = (e: MouseEvent) => {
        panel.style.left = `${e.clientX - dragOffset.current.x}px`;
        panel.style.top = `${e.clientY - dragOffset.current.y}px`;
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    panel.addEventListener('mousedown', handleMouseDown);
    return () => panel.removeEventListener('mousedown', handleMouseDown);
  }, [isMobile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setQuestion('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'ai', text: "Placeholder reply ni NUMI 🧠" }]);
    }, 1000);
  };

  return (
    <div
      ref={panelRef}
      className={`
        fixed bg-white rounded-[30px] shadow-lg overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? (isMobile ? 'bottom-4 right-4 w-[90%] h-[70%] max-w-[400px]' : 'top-1/2 left-[80%] -translate-y-1/2 w-[400px] h-[600px]') : ''}
        z-[9999]
      `}
      style={!isOpen ? {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '30px',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      } : {}}
      onClick={!isOpen ? () => setIsOpen(true) : undefined}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-3 bg-green-600 text-white rounded-t-[30px] drag-handle cursor-grab">
            <span className="font-bold text-lg">NUMI Assistant</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.type === 'ai'
                    ? 'bg-green-100 text-green-800 self-start rounded-bl-none'
                    : 'bg-blue-500 text-white self-end rounded-br-none ml-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex p-3 border-t border-gray-200">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="flex-1 mr-2 text-base p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Type your question"
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg">
              <Send size={20} />
            </Button>
          </form>
        </div>
      ) : (
        <img
          src={numiImage}
          alt="Numi Doll"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '30px'
          }}
        />
      )}
    </div>
  );
};
