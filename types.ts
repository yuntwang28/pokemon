export interface PokemonData {
  identified: boolean;
  name?: string;
  id?: number;
  primaryType?: string;
  abilities?: string[];
  evolution?: string;
  description?: string;
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  data?: PokemonData;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}