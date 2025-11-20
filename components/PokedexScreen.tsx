import React from 'react';
import { PokemonData } from '../types';

interface PokedexScreenProps {
  data: PokemonData | null;
  isLoading: boolean;
}

const PokedexScreen: React.FC<PokedexScreenProps> = ({ data, isLoading }) => {
  const imageUrl = data?.id 
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
    : null;

  const playCry = () => {
    if (data?.id) {
      const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`);
      audio.volume = 0.4;
      audio.play().catch(err => console.error("Failed to play cry:", err));
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-green-100 border-4 border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="scan-line absolute inset-0 pointer-events-none"></div>
        <div className="text-green-900 font-retro text-xs animate-pulse">
          ANALYZING...
        </div>
        <div className="mt-4 w-16 h-16 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.identified) {
    return (
      <div className="h-full w-full bg-green-100 border-4 border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="scan-line absolute inset-0 pointer-events-none"></div>
        <div className="text-green-900 font-retro text-center leading-loose opacity-70">
          <p className="mb-4 text-3xl">?</p>
          <p className="text-xs">WAITING FOR INPUT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-blue-100 border-4 border-gray-700 rounded-lg flex flex-col relative overflow-hidden shadow-inner">
       <div className="scan-line absolute inset-0 pointer-events-none z-10 opacity-50"></div>
      
      {/* Header Info */}
      <div className="bg-gray-800 text-white p-2 flex justify-between items-center font-retro text-[10px] border-b-4 border-gray-700 z-20">
        <span>NO.{data.id?.toString().padStart(3, '0')}</span>
        <span className="uppercase text-yellow-400">{data.name}</span>
      </div>

      {/* Image Area */}
      <div className="flex-grow flex items-center justify-center p-4 bg-blue-200 relative group">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-20" 
              style={{backgroundImage: 'linear-gradient(#4299e1 1px, transparent 1px), linear-gradient(90deg, #4299e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
         </div>
         
        {imageUrl ? (
          <div className="relative cursor-pointer hover:scale-110 transition-transform duration-200 z-20" onClick={playCry} title="Click to hear cry">
            <img 
              src={imageUrl} 
              alt={data.name} 
              className="w-48 h-48 object-contain drop-shadow-xl animate-[bounce_3s_infinite]"
            />
            {/* Audio Icon Indicator */}
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-retro">?</div>
        )}
      </div>

      {/* Stats Panel */}
      <div className="bg-green-900 p-3 border-t-4 border-gray-700 z-20 text-green-100 font-screen text-lg leading-tight shadow-inner min-h-[140px] overflow-y-auto">
        <div className="flex items-center mb-2">
            <span className="text-green-400 font-bold mr-2 text-sm font-retro">TYPE:</span>
            <span className="uppercase tracking-wider">{data.primaryType}</span>
        </div>
        
        {data.abilities && data.abilities.length > 0 && (
          <div className="mb-2">
            <span className="text-green-400 font-bold mr-2 text-sm font-retro block mb-1">ABILITIES:</span>
            <div className="flex flex-wrap gap-1">
              {data.abilities.map((ability, idx) => (
                <span key={idx} className="text-sm uppercase border border-green-700 px-1 rounded bg-green-800 opacity-90">
                  {ability}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2">
            <span className="text-green-400 font-bold mr-2 text-sm font-retro block mb-1">EVOLUTION:</span>
            <span className="opacity-90 text-base">{data.evolution}</span>
        </div>
        <div className="border-t border-green-700 pt-2 mt-1">
             <p className="italic opacity-80 text-sm">"{data.description}"</p>
        </div>
      </div>
    </div>
  );
};

export default PokedexScreen;