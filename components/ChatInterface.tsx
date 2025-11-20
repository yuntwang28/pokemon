import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-gray-900 border-4 border-gray-600 rounded-lg p-2 h-64 overflow-y-auto font-screen text-xl relative shadow-inner">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-500 text-center p-4">
           <p>Welcome, Trainer! Enter a Pokemon name to begin analysis.</p>
        </div>
      )}
      
      {messages.map((msg, idx) => (
        <div key={idx} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div 
            className={`
              max-w-[85%] p-2 rounded-sm border-2
              ${msg.role === 'user' 
                ? 'bg-blue-600 border-blue-400 text-white rounded-br-none' 
                : 'bg-green-600 border-green-400 text-white rounded-bl-none'
              }
            `}
          >
            <p className="leading-snug">{msg.text}</p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatInterface;