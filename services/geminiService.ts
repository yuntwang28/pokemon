import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PokemonData } from "../types";

// Initialize the client with the API Key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    identified: {
      type: Type.BOOLEAN,
      description: "Set to true if the user input contains a valid Pokemon name that you can identify. Set to false otherwise."
    },
    name: {
      type: Type.STRING,
      description: "The official name of the Pokemon."
    },
    id: {
      type: Type.INTEGER,
      description: "The National Pokedex ID number of the Pokemon."
    },
    primaryType: {
      type: Type.STRING,
      description: "The primary elemental type of the Pokemon (e.g., Fire, Water, Grass)."
    },
    abilities: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "List of natural abilities this Pokemon can have (e.g. 'Static', 'Lightning Rod')."
    },
    evolution: {
      type: Type.STRING,
      description: "A short description of its evolution chain (e.g., 'Evolves from Charmander at level 16')."
    },
    description: {
      type: Type.STRING,
      description: "A short, engaging Pokedex entry style description (max 2 sentences)."
    },
    message: {
      type: Type.STRING,
      description: "A conversational response to the user. If a pokemon is found, act like a Pokedex. If not, politely ask for a pokemon name."
    }
  },
  required: ["identified", "message"]
};

export const identifyPokemon = async (userInput: string): Promise<PokemonData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a high-tech Pokedex AI. Your goal is to identify Pokemon from user text. 
      Analyze the following input: "${userInput}".
      If a Pokemon is mentioned, extract its details. Use the National Pokedex ID for the 'id' field.
      Be accurate with types, abilities, and evolution data.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful Pokedex assistant with a retro game personality.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as PokemonData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      identified: false,
      message: "BZZT! Communication error. Unable to access Pokedex database."
    };
  }
};