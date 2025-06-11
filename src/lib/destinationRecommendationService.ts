
import { callGeminiAPI } from './geminiService';
import { generateDestinationPrompt } from './chatPrompts';
import { marked } from 'marked';


export const generateDestinationRecommendation = async (
  destinationName: string,
  country: string,
  description: string,
  userBudget?: number
): Promise<string> => {
  try {
    const prompt = generateDestinationPrompt(destinationName, country, description, userBudget);
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Erro ao gerar recomendação de destino:', error);
    return `**Erro ao carregar recomendações**

Não foi possível gerar recomendações personalizadas para ${destinationName} no momento. 
Verifique se a API do Gemini está configurada corretamente ou tente novamente mais tarde.

**Informações básicas sobre ${destinationName}:**
${description}`;
  }
};
