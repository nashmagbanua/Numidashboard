
import React, { useState, useEffect } from 'react';
import { X, Brain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const placeholderQuestions = [
  "Ask about today's GPM...",
  "Bakit walang log si Opscrew kanina?",
  "Show me Coal Yard status...",
  "Bakit low ang pressure ng Boiler B?",
  "Tanong ka lang, kahit Tagalog!",
  "Check chemical inventory levels..."
];

export const AIPanel: React.FC<AIPanelProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hi! I'm NUMI, your AI assistant. Ask me anything about the plant operations!"
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholderQuestions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    
    // Simulate AI response (placeholder for real AI integration)
    setTimeout(() => {
      const responses = [
        "I'm ready to help analyze your plant operations! Please connect the backend system for real-time data analysis.",
        "Nakikita ko ang tanong mo, pero kailangan ko ng koneksyon sa database para sa live data.",
        "System is ready for operations analysis. Please integrate with your data sources for accurate insights.",
        "I'm designed to help with your manufacturing operations. Backend integration pending for live monitoring."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'ai', text: randomResponse }]);
    }, 1000);

    setQuestion('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-solid animate-slide-in">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-nums-green-600 animate-pulse" />
            <CardTitle className="text-lg">Ask NUMI</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-64 overflow-y-auto space-y-3 bg-white/30 rounded-lg p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'nums-gradient text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholderQuestions[currentPlaceholder]}
              className="flex-1 bg-white/50"
            />
            <Button type="submit" size="sm" className="nums-gradient">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setQuestion("Show today's summary")}
              >
                Today's Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setQuestion("Check alerts")}
              >
                Check Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
