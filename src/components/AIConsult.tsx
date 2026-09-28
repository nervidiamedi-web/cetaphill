import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Send, Sparkles, RefreshCw, User, HelpCircle as ChatBotIcon } from 'lucide-react';
import { Product } from '../types';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface AIConsultProps {
  products: Product[];
  setCurrentView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function AIConsult({ products, setCurrentView, setSelectedProductId }: AIConsultProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Welcome to the Cetaphil Clinical Skincare Advisor. \n\nHow can I help you optimize your skin biology today? Ask me about:\n- Designing a routine for dry, oily, sensitive, or acne-prone skin\n- Finding the right Cetaphil cleansers, moisturizers, or baby formulations\n- Defending against the 5 signs of skin sensitivity'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) throw new Error('Clinical server failed to respond.');
      const data = await response.json();

      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I apologize, but my diagnostic link has been briefly interrupted. Please ensure your internet connection is active, or retake our **Interactive Skin Quiz** to receive automated matching formulations."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Convert custom bolding and bullets in server response into neat JSX elements
  const formatMessageText = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => {
      // Check for bullet items
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        const items = paragraph.split('\n').map(item => item.replace(/^[-*]\s+/, ''));
        return (
          <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-2 text-xs">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {renderFormattedSpan(item)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={pIdx} className="text-xs leading-relaxed my-2 text-gray-700">
          {renderFormattedSpan(paragraph)}
        </p>
      );
    });
  };

  // Helper to parse **bold text** and product names for navigation
  const renderFormattedSpan = (text: string) => {
    const parts = [];
    let keyIdx = 0;

    // First replace bold marks
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const boldText = match[1];
      // Try to find if this bold text is a product name in our database to link it
      const matchedProduct = products.find(p => p.name.toLowerCase() === boldText.toLowerCase() || boldText.toLowerCase().includes(p.name.toLowerCase()));

      if (matchedProduct) {
        parts.push(
          <button
            key={keyIdx++}
            onClick={() => {
              setSelectedProductId(matchedProduct.id);
              setCurrentView('pdp');
            }}
            className="text-[#003366] hover:underline font-bold text-left cursor-pointer inline"
          >
            {boldText}
          </button>
        );
      } else {
        parts.push(<strong key={keyIdx++} className="font-bold text-gray-900">{boldText}</strong>);
      }

      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const handleSuggestQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Page Title */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-[#0082C8] bg-[#EEF5F9] border border-[#D1E5F2] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0082C8]" />
          Clinical Consultation
        </span>
        <h1 className="text-3xl font-extrabold text-[#002D62]">Cetaphil AI Skincare Consultant</h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2">
          Discuss your skin issues, understand formulation chemistry, or discover optimal regimens. Our expert advisor provides dermatological answers in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Suggestion sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#E2EBF1] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Topic Suggestion</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSuggestQuestion('How should I treat Oily skin with acne breakouts?')}
                className="text-left text-xs p-3 rounded-xl border border-[#E2EBF1] hover:border-[#0082C8] hover:bg-[#EEF5F9] transition-all text-gray-700 leading-normal cursor-pointer"
              >
                Acne &amp; Sebum Balancing
              </button>
              <button
                onClick={() => handleSuggestQuestion('Why is Ceramide Cream better for sensitive barriers?')}
                className="text-left text-xs p-3 rounded-xl border border-[#E2EBF1] hover:border-[#0082C8] hover:bg-[#EEF5F9] transition-all text-gray-700 leading-normal cursor-pointer"
              >
                Ceramide Lipids &amp; Barrier
              </button>
              <button
                onClick={() => handleSuggestQuestion('How do I safely introduce 0.5% Retinol Serum?')}
                className="text-left text-xs p-3 rounded-xl border border-[#E2EBF1] hover:border-[#0082C8] hover:bg-[#EEF5F9] transition-all text-gray-700 leading-normal cursor-pointer"
              >
                Safe Retinol Acceleration
              </button>
              <button
                onClick={() => handleSuggestQuestion('What makes Vitamin C crucial for anti-aging?')}
                className="text-left text-xs p-3 rounded-xl border border-[#E2EBF1] hover:border-[#0082C8] hover:bg-[#EEF5F9] transition-all text-gray-700 leading-normal cursor-pointer"
              >
                Vitamin C Antioxidant Defense
              </button>
            </div>
          </div>

          <div className="bg-[#EEF5F9] border border-[#D1E5F2] rounded-2xl p-4">
            <h4 className="text-xs font-bold text-[#002D62] flex items-center gap-1.5 mb-2">
              <ChatBotIcon className="w-4 h-4 text-[#0082C8]" />
              Dermatologist Quality
            </h4>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              Our AI chatbot utilizes natural language processing tied to our scientific database of clinical formulas. Recommended products are directly hyperlinked inside the response bubbles.
            </p>
          </div>
        </div>

        {/* Chat box */}
        <div className="lg:col-span-3 bg-white border border-[#E2EBF1] rounded-3xl shadow-xs overflow-hidden flex flex-col h-[520px]">
          
          {/* Header */}
          <div className="bg-[#002D62] px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#43B02A]" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white leading-none">Clinical Derm Advisor</p>
              <p className="text-[10px] text-blue-200 mt-1">Science-Backed Skincare Consultation</p>
            </div>
          </div>

          {/* Messages scroll box */}
          <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-[#F4F8FA]">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  
                  {/* Icon bubble */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isBot ? 'bg-[#002D62] text-white' : 'bg-[#0082C8] text-white'
                  }`}>
                    {isBot ? <Sparkles className="w-4 h-4 text-[#43B02A]" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Text bubble */}
                  <div className={`p-4 rounded-2xl ${
                    isBot
                      ? 'bg-white border border-[#E2EBF1] shadow-xs'
                      : 'bg-[#002D62] text-white'
                  }`}>
                    {isBot ? (
                      formatMessageText(m.text)
                    ) : (
                      <p className="text-xs leading-normal">{m.text}</p>
                    )}
                  </div>

                </div>
              );
            })}

            {/* Simulated typing animation */}
            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="w-8 h-8 rounded-full bg-[#002D62] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#43B02A]" />
                </div>
                <div className="bg-white border border-[#E2EBF1] rounded-2xl px-4 py-3 shadow-xs">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#0082C8] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#0082C8] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#0082C8] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2EBF1] bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about skin concerns or ingredients..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-4 py-2 border border-[#E2EBF1] rounded-full text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] focus:border-[#0082C8]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                inputText.trim() && !loading
                  ? 'bg-[#002D62] hover:bg-[#0082C8] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
