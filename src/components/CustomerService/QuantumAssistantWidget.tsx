import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const QuantumAssistantWidget: React.FC = () => {
  const { getAccountBalances, eyeHidden, cards } = useApp();
  const balances = getAccountBalances();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am your Quantum Banking Assistant. How can I help you manage accounts, cards, or statements today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I'm analyzing your request. You can check transactions, raise disputes, or manage card limits directly from the dashboard.";

      const lower = query.toLowerCase();
      if (lower.includes('balance') || lower.includes('check my balance')) {
        replyText = `Your current balance breakdown:\n• Stable Growth: ${formatCurrency(balances.stable, eyeHidden)}\n• Cash Crunch: ${formatCurrency(balances.crunch, eyeHidden)}\n• Total Combined: ${formatCurrency(balances.total, eyeHidden)}`;
      } else if (lower.includes('statement') || lower.includes('annual statement')) {
        replyText = "Annual e-Statements for FY 2025-26 are ready. You can download the password-protected PDF directly from your registered email or the Service Requests tracking tab.";
      } else if (lower.includes('limit') || lower.includes('card limit')) {
        const activeCard = cards[0];
        if (activeCard) {
          replyText = `Active Card (${activeCard.name}):\n• Daily ATM Limit: ₹${activeCard.atmLimit.toLocaleString('en-IN')}\n• POS Limit: ₹${activeCard.posLimit.toLocaleString('en-IN')}\n• E-Com Limit: ₹${activeCard.ecomLimit.toLocaleString('en-IN')}\n• International Status: ${activeCard.internationalEnabled ? 'Enabled' : 'Disabled'}`;
        } else {
          replyText = "Card limits can be managed in the Service Requests panel using range sliders.";
        }
      } else if (lower.includes('loan') || lower.includes('interest rate')) {
        replyText = "Current Retail Loan Benchmark Rates:\n• Home Loan: 8.40% p.a.\n• Personal Loan: 10.50% p.a.\n• Car Loan: 8.75% p.a.\nYou can generate tax interest certificates directly under Customer Service!";
      } else if (lower.includes('block') || lower.includes('fraud')) {
        replyText = "If you suspect fraudulent charges or lost a card, please use the Emergency Quick Actions bar at the top of Customer Service to instantly block your card.";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const quickPrompts = [
    'Check My Balance',
    'Download Annual Statement',
    'Card Limits Info',
    'Loan Interest Rates'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col h-[420px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-icici-blue-dark text-white rounded-xl">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Quantum AI Assistant</h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Live Support Bot
            </span>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-icici-orange" />
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {quickPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-icici-orange-light/20 border border-slate-200 hover:border-icici-orange/30 rounded-full text-[10px] font-bold text-slate-700 hover:text-icici-orange transition shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-1.5 rounded-full shrink-0 text-white ${msg.sender === 'user' ? 'bg-icici-orange' : 'bg-slate-800'}`}>
              {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-xs max-w-[80%] whitespace-pre-line leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-icici-blue-dark text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
              }`}
            >
              {msg.text}
              <span className="block text-[8px] opacity-60 mt-1 text-right">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="p-1.5 bg-slate-800 text-white rounded-full">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-100 p-2.5 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-100 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask Quantum Assistant..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-icici-blue-light focus:bg-white transition"
        />
        <button
          type="submit"
          className="p-2 bg-icici-orange hover:bg-icici-orange-hover text-white rounded-xl transition shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
