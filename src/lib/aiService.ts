
import { callGeminiAPI } from './geminiService';
import { generateChatSystemPrompt } from './chatPrompts';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface UserPreferences {
  interests: string[];
  preferredActivities: string[];
  travelStyle: string;
  budget: string;
  budgetValue?: number;
  duration?: string;
  season?: string;
}

export const generateAIResponse = async (
  messages: ChatMessage[],
  preferences: UserPreferences
): Promise<string> => {
  try {
    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage) {
      return "Olá! Sou o ExplorAI, seu assistente de viagens personalizadas 😊 Como posso ajudar você a encontrar seu próximo destino?";
    }

    const systemPrompt = generateChatSystemPrompt(preferences);
    const conversationHistory = messages
      .slice(-5) // Últimas 5 mensagens para contexto
      .map(msg => `${msg.role === 'user' ? 'Usuário' : 'ExplorAI'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${conversationHistory}\n\nUsuário: ${lastUserMessage.content}\n\nExplorAI:`;

    return await callGeminiAPI(fullPrompt, systemPrompt);
  } catch (error) {
    console.error('Erro ao gerar resposta da IA:', error);
    return 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes. Se o problema persistir, verifique se a API do Gemini está configurada corretamente.';
  }
};
