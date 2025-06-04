
import { filterDestinations } from '@/data/destinations';

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

// Cache para evitar respostas repetitivas
let lastResponseType: string | null = null;
let conversationContext: string[] = [];

// Function to call Gemini API
const callGeminiAPI = async (
  messages: ChatMessage[], 
  preferences: UserPreferences,
  apiKey: string
): Promise<string> => {
  try {
    const systemPrompt = `Você é o ExplorAI, um assistente especializado em recomendações de viagem personalizadas. 
    
Informações do usuário:
- Interesses: ${preferences.interests.join(', ') || 'Não definidos'}
- Atividades preferidas: ${preferences.preferredActivities.join(', ') || 'Não definidas'}
- Estilo de viagem: ${preferences.travelStyle}
- Orçamento: ${preferences.budget}${preferences.budgetValue ? ` (R$ ${preferences.budgetValue.toLocaleString('pt-BR')})` : ''}
- Duração preferida: ${preferences.duration || 'Não definida'}
- Época preferida: ${preferences.season || 'Qualquer'}

Diretrizes:
- Seja amigável, entusiástico e prestativo
- Use emojis ocasionalmente para deixar a conversa mais natural
- Forneça recomendações específicas e detalhadas
- Considere sempre as preferências do usuário
- Se não houver preferências definidas, incentive o usuário a configurá-las
- Mantenha respostas concisas mas informativas (máximo 150 palavras)
- Foque em destinos que realmente combinem com o perfil do usuário`;

    const lastUserMessage = messages[messages.length - 1];
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nConversa atual:\n${messages.map(m => `${m.role === 'user' ? 'Usuário' : 'ExplorAI'}: ${m.content}`).join('\n')}\n\nResponda como ExplorAI:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

// Simulador de chat com IA para gerar respostas mais inteligentes
export const generateAIResponse = async (
  messages: ChatMessage[],
  preferences: UserPreferences,
  apiKey?: string
): Promise<string> => {
  // Se há uma chave API do Gemini, usa a API real
  if (apiKey && apiKey.trim()) {
    try {
      return await callGeminiAPI(messages, preferences, apiKey);
    } catch (error) {
      console.error('Erro ao usar Gemini API, voltando para simulação:', error);
      // Se falhar, volta para a simulação
    }
  }

  // Simulação original (fallback)
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
  
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')?.content.toLowerCase();
  
  if (!lastUserMessage) {
    return "Olá! Sou o ExplorAI, seu assistente de viagens personalizadas 😊 Como posso ajudar você a encontrar seu próximo destino?";
  }

  conversationContext.push(lastUserMessage);
  if (conversationContext.length > 5) {
    conversationContext = conversationContext.slice(-5);
  }

  const hasPreferences = preferences.interests.length > 0 || preferences.preferredActivities.length > 0;
  
  console.log('Preferências do usuário:', preferences);
  console.log('Mensagem do usuário:', lastUserMessage);

  // Cumprimentos
  if (lastUserMessage.includes('oi') || lastUserMessage.includes('olá') || lastUserMessage.includes('hello')) {
    if (hasPreferences) {
      return `Oi! Vi que você configurou suas preferências - ${preferences.interests.join(', ')} e estilo ${preferences.travelStyle}. Que tipo de viagem você tem em mente? 🌍`;
    }
    return "Oi! Que bom te ver por aqui! Configure suas preferências ali do lado e vamos descobrir lugares incríveis juntos! ✈️";
  }

  if (lastUserMessage.includes('preferências') || lastUserMessage.includes('configurações') || lastUserMessage.includes('você consegue ver')) {
    if (hasPreferences) {
      return `Sim! Vejo que você gosta de ${preferences.interests.join(' e ')}, prefere ${preferences.travelStyle} e tem orçamento ${preferences.budget}. Está tudo certinho! 👍`;
    } else {
      return "Ainda não vejo suas preferências configuradas. Dá uma olhada no painel ali do lado! Vai ser mais fácil te ajudar 😉";
    }
  }

  const isAskingForDestinations = /(?:destino|viajar|recomen|sugest|lugar|onde|país|cidade|o que.*sugere|me.*diga|quais|opções|viagem)/i.test(lastUserMessage);

  if (isAskingForDestinations) {
    if (hasPreferences) {
      const destinations = filterDestinations(preferences);
      
      if (destinations.length > 0) {
        const topDestination = destinations[0];
        return `Perfeito! Com seu perfil, eu sugiro **${topDestination.name}**! 🌟\n\n${topDestination.description.substring(0, 120)}...\n\nCombina muito com você porque gosta de ${preferences.interests[0]} e é ${preferences.travelStyle}. Quer saber mais sobre este lugar?`;
      } else {
        return "Hmm, que tal expandir um pouco suas preferências? Posso sugerir lugares incríveis se você me der mais algumas dicas! 🤔";
      }
    } else {
      return "Para sugerir o lugar perfeito, preciso conhecer você melhor! Configure suas preferências e vou encontrar destinos que combinam com seu estilo 😊";
    }
  }

  if (lastUserMessage.includes('orçamento') || lastUserMessage.includes('dinheiro') || lastUserMessage.includes('caro')) {
    if (preferences.budgetValue) {
      return `Com R$ ${preferences.budgetValue.toLocaleString('pt-BR')}, você tem várias opções legais! Quer destinos mais econômicos ou pode investir um pouco mais? 💰`;
    }
    return "Orçamento é super importante! Configure ele ali do lado que eu te mostro destinos que cabem no seu bolso 💸";
  }

  if (lastUserMessage.includes('atividade') || lastUserMessage.includes('fazer') || lastUserMessage.includes('aventura')) {
    if (preferences.preferredActivities.length > 0) {
      return `Legal! Você curte ${preferences.preferredActivities.join(' e ')}. Que tipo de experiência você quer viver na próxima viagem? 🎯`;
    }
    return "Atividades são o que fazem a viagem especial! Me conta o que você gosta de fazer que eu acho lugares perfeitos! 🎮";
  }

  if (hasPreferences) {
    const responses = [
      "Interessante! Com suas preferências, tenho algumas ideias. Quer que eu sugira um destino?",
      `Seu perfil ${preferences.travelStyle} é bem legal! O que mais te chama atenção numa viagem?`,
      "Hmm, deixa eu pensar no que combina com você... Quer destinos nacionais ou internacionais?",
      "Com seu estilo, posso sugerir lugares incríveis! Prefere algo mais próximo ou aventurar longe?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  } else {
    const responses = [
      "Configure suas preferências ali do lado que vou te dar sugestões mais certeiras! 😊",
      "Me conta mais sobre o que você gosta! Assim posso te ajudar melhor 🤔",
      "Para te ajudar bem, preciso saber seus interesses. Configura ali do lado? 👉"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
};
