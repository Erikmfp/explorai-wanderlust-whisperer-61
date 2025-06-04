
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

// Simulador de chat com IA para gerar respostas mais inteligentes
export const generateAIResponse = async (
  messages: ChatMessage[],
  preferences: UserPreferences
): Promise<string> => {
  // Simula um pequeno atraso para parecer mais natural
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
  
  // Pega a última mensagem do usuário
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')?.content.toLowerCase();
  
  if (!lastUserMessage) {
    return "Oi! Sou o ExplorAI 😊 Vou te ajudar a encontrar destinos incríveis! Por onde começamos?";
  }

  // Atualiza o contexto da conversa
  conversationContext.push(lastUserMessage);
  if (conversationContext.length > 5) {
    conversationContext = conversationContext.slice(-5);
  }

  // Verifica se há preferências configuradas
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

  // Perguntas sobre preferências
  if (lastUserMessage.includes('preferências') || lastUserMessage.includes('configurações') || lastUserMessage.includes('você consegue ver')) {
    if (hasPreferences) {
      return `Sim! Vejo que você gosta de ${preferences.interests.join(' e ')}, prefere ${preferences.travelStyle} e tem orçamento ${preferences.budget}. Está tudo certinho! 👍`;
    } else {
      return "Ainda não vejo suas preferências configuradas. Dá uma olhada no painel ali do lado! Vai ser mais fácil te ajudar 😉";
    }
  }

  // Detecta pedidos de destinos/sugestões
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

  // Conversas sobre orçamento
  if (lastUserMessage.includes('orçamento') || lastUserMessage.includes('dinheiro') || lastUserMessage.includes('caro')) {
    if (preferences.budgetValue) {
      return `Com R$ ${preferences.budgetValue.toLocaleString('pt-BR')}, você tem várias opções legais! Quer destinos mais econômicos ou pode investir um pouco mais? 💰`;
    }
    return "Orçamento é super importante! Configure ele ali do lado que eu te mostro destinos que cabem no seu bolso 💸";
  }

  // Conversas sobre atividades
  if (lastUserMessage.includes('atividade') || lastUserMessage.includes('fazer') || lastUserMessage.includes('aventura')) {
    if (preferences.preferredActivities.length > 0) {
      return `Legal! Você curte ${preferences.preferredActivities.join(' e ')}. Que tipo de experiência você quer viver na próxima viagem? 🎯`;
    }
    return "Atividades são o que fazem a viagem especial! Me conta o que você gosta de fazer que eu acho lugares perfeitos! 🎮";
  }

  // Respostas gerais baseadas nas preferências
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
