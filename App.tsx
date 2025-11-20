import React, { useState, useCallback } from 'react';
import { PokemonData, ChatMessage } from './types';
import { identifyPokemon } from './services/geminiService';
import PokedexScreen from './components/PokedexScreen';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<PokemonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    const userMsg: ChatMessage = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    
    setIsLoading(true);

    try {
      const data = await identifyPokemon(userText);
      
      // Add bot message
      const botMsg: ChatMessage = { role: 'bot', text: data.message, data };
      setMessages(prev => [...prev, botMsg]);

      // Update Pokedex screen only if a pokemon was identified
      if (data.identified) {
        setCurrentPokemon(data);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to Pokedex server." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 font-sans">
      {/* Main Pokedex Container */}
      <div className="w-full max-w-4xl bg-red-600 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-4 border-red-400 border-b-8 border-red-800 p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden">
        
        {/* Decorative Hinge (Visual only for mobile stack, functional look for desktop) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-red-800 hidden md:block border-x-2 border-red-900 z-0 -ml-4 shadow-inner"></div>
        
        {/* Left Panel: Pokedex Screen */}
        <div className="flex-1 z-10 flex flex-col gap-4">
           {/* Top Camera Lens Decor */}
           <div className="flex gap-2 mb-2">
             <div className="w-16 h-16 bg-blue-400 rounded-full border-4 border-white shadow-lg relative overflow-hidden">
                <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-60"></div>
             </div>
             <div className="flex gap-2 mt-2">
               <div className="w-4 h-4 bg-red-800 rounded-full border border-red-900"></div>
               <div className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-600"></div>
               <div className="w-4 h-4 bg-green-600 rounded-full border border-green-700"></div>
             </div>
           </div>

           {/* The Screen */}
           <div className="bg-gray-200 rounded-bl-3xl p-6 border-4 border-gray-400 shadow-inner flex-grow min-h-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-center gap-4 mb-2">
                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-grow">
                  <PokedexScreen data={currentPokemon} isLoading={isLoading} />
                </div>
                <div className="flex justify-between items-end mt-2">
                    <div className="w-6 h-6 bg-red-600 rounded-full border border-gray-400 animate-pulse"></div>
                    <div className="text-gray-600 font-retro text-[10px]">
                        <span className="block">v2.5.0</span>
                    </div>
                </div>
              </div>
           </div>
        </div>

        {/* Right Panel: Chat & Controls */}
        <div className="flex-1 z-10 flex flex-col justify-between md:pt-20">
          <div className="bg-gray-800 p-1 rounded-lg border-4 border-gray-700 shadow-lg mb-4">
             <ChatInterface messages={messages} />
          </div>

          {/* Control Pad Area */}
          <div className="bg-red-600 p-4 rounded-xl flex flex-col gap-4">
             
             <div className="flex gap-4 items-center">
               {/* Input Box */}
               <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter Pokemon Name..."
                  className="flex-grow bg-green-900 text-green-100 font-retro text-xs p-4 rounded-md border-4 border-green-700 focus:outline-none focus:border-green-400 placeholder-green-700 shadow-inner uppercase"
                  disabled={isLoading}
                />
             </div>

             {/* D-Pad and Buttons */}
             <div className="flex justify-between items-center mt-4">
                {/* D-Pad Visual */}
                <div className="w-24 h-24 relative">
                   <div className="absolute top-0 left-8 w-8 h-24 bg-gray-800 rounded-sm shadow-lg border border-gray-900"></div>
                   <div className="absolute top-8 left-0 w-24 h-8 bg-gray-800 rounded-sm shadow-lg border border-gray-900"></div>
                   <div className="absolute top-9 left-9 w-6 h-6 bg-gray-700 rounded-full opacity-50"></div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className={`
                      w-20 h-20 rounded-full border-b-4 text-white font-retro text-xs shadow-xl transition-all active:border-b-0 active:translate-y-1 flex items-center justify-center
                      ${isLoading ? 'bg-gray-600 border-gray-800 cursor-not-allowed' : 'bg-blue-500 border-blue-800 hover:bg-blue-400'}
                    `}
                  >
                    {isLoading ? '...' : 'SCAN'}
                  </button>
                  <span className="font-retro text-red-900 text-[10px] font-bold">A BUTTON</span>
                </div>
             </div>
             
             {/* Start/Select */}
             <div className="flex justify-center gap-8 mt-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-3 bg-gray-800 rounded-full transform rotate-12 border border-gray-900 shadow-md"></div>
                  <span className="text-[10px] font-bold text-red-900 font-retro">SELECT</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-3 bg-gray-800 rounded-full transform rotate-12 border border-gray-900 shadow-md"></div>
                  <span className="text-[10px] font-bold text-red-900 font-retro">START</span>
                </div>
             </div>

          </div>
        </div>

      </div>
      
      {/* Footer Text */}
      <div className="fixed bottom-2 right-4 text-gray-500 text-xs font-retro opacity-50">
        POWERED BY GEMINI AI
      </div>
    </div>
  );
};

export default App;