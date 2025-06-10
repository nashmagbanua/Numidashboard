
import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import numiImage from '../assets/numi-doll.png';

const placeholderQuestions = [
  "Ask about today's GPM...",
  "Bakit walang log si Opscrew kanina?",
  "Show me Coal Yard status...",
  "Bakit low ang pressure ng Boiler B?",
  "Tanong ka lang, kahit Tagalog!",
  "Check chemical inventory levels..."
];

export const AIPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hi! I'm NUMI, your assistant. Ask me anything about plant operations!" }
  ]);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderQuestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🛠 Disable drag on mobile
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || isMobile) return;

    const handleMouseDown = (e: MouseEvent) => {
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
      style={{
        position: 'fixed',
        top: isMobile ? 'auto' : '60%',
        left: isMobile ? 'auto' : '80%',
        bottom: isMobile ? '20px' : 'auto',
        right: isMobile ? '20px' : 'auto',
        width: isOpen ? '90%' : '60px',
        height: isOpen ? '70%' : '60px',
        maxWidth: '400px',
        maxHeight: '600px',
        zIndex: 9999,
        background: 'white',
        borderRadius: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-3 py-2 bg-green-600 text-white">
            <span className="font-bold">NUMI Assistant</span>
            <button onClick={() => setIsOpen(false)}><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg ${msg.type === 'ai' ? 'bg-green-100 text-left' : 'bg-gray-200 text-right'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex p-2 border-t">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholderQuestions[placeholderIndex]}
              className="flex-1 mr-2"
            />
            <Button type="submit"><Send size={16} /></Button>
          </form>
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '30px',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={numiImage}
            alt="Numi Doll"
            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
};
