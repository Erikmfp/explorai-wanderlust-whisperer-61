
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
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Pega a última mensagem do usuário
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')?.content.toLowerCase();
  
  if (!lastUserMessage) {
    return "Olá! Sou o ExplorAI, seu assistente de viagens personalizadas. Como posso ajudar você hoje?";
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
  console.log('Tem preferências:', hasPreferences);

  // Se o usuário pergunta sobre suas preferências ou configurações
  if (lastUserMessage.includes('selecionei') || lastUserMessage.includes('configurações') || lastUserMessage.includes('preferências') || lastUserMessage.includes('você consegue ver')) {
    if (hasPreferences) {
      let response = "Sim! Consigo ver suas preferências perfeitamente:\n\n";
      
      if (preferences.interests.length > 0) {
        response += `🎯 **Interesses:** ${preferences.interests.join(', ')}\n`;
      }
      
      if (preferences.preferredActivities.length > 0) {
        response += `🎮 **Atividades preferidas:** ${preferences.preferredActivities.join(', ')}\n`;
      }
      
      response += `🧳 **Estilo de viagem:** ${preferences.travelStyle}\n`;
      response += `💰 **Orçamento:** ${preferences.budget}`;
      
      if (preferences.budgetValue) {
        response += ` (R$ ${preferences.budgetValue.toLocaleString('pt-BR')})`;
      }
      
      if (preferences.duration) {
        response += `\n⏰ **Duração:** ${preferences.duration}`;
      }
      
      if (preferences.season && preferences.season !== 'qualquer') {
        response += `\n🌤️ **Época preferida:** ${preferences.season}`;
      }
      
      response += "\n\nCom base nessas informações, posso fazer recomendações muito mais precisas! O que você gostaria de saber?";
      
      return response;
    } else {
      return "Ainda não vejo nenhuma preferência configurada. Você pode definir seus interesses, atividades preferidas e orçamento no painel ao lado para que eu possa fazer recomendações personalizadas!";
    }
  }

  // Análise contextual da mensagem
  const isAskingForDestinations = /(?:destino|viajar|recomen|sugest|lugar|onde|país|cidade|o que me sugere)/i.test(lastUserMessage);
  const isAskingAboutBudget = /(?:orçamento|dinheiro|custo|preço|valor|gasto)/i.test(lastUserMessage);
  const isAskingAboutTime = /(?:tempo|dias|duração|período|quando|época)/i.test(lastUserMessage);
  const isGreeting = /(?:oi|olá|hello|bom dia|boa tarde|boa noite)/i.test(lastUserMessage);
  const isSharingPreferences = /(?:gosto|prefiro|amo|adoro|interesse|paixão)/i.test(lastUserMessage);

  // Respostas baseadas no contexto e preferências
  if (isGreeting && lastResponseType !== 'greeting') {
    lastResponseType = 'greeting';
    if (hasPreferences) {
      return `Olá! Que bom te ver! Vejo que você configurou suas preferências: gosta de ${preferences.interests.join(', ')} e prefere ${preferences.preferredActivities.join(', ')}. Seu estilo é ${preferences.travelStyle} com orçamento ${preferences.budget}. Como posso ajudar você a encontrar o destino perfeito?`;
    }
    return "Olá! Bem-vindo ao ExplorAI! Vou ajudar você a encontrar destinos incríveis. Configure suas preferências no painel ao lado para recomendações mais precisas!";
  }

  if (isAskingForDestinations) {
    lastResponseType = 'destinations';
    
    if (hasPreferences) {
      const destinations = filterDestinations(preferences);
      
      if (destinations.length > 0) {
        const topDestinations = destinations.slice(0, 3);
        let response = `Perfeito! Com base em suas preferências:\n`;
        response += `• **Interesses:** ${preferences.interests.join(', ')}\n`;
        response += `• **Atividades:** ${preferences.preferredActivities.join(', ')}\n`;
        response += `• **Estilo:** ${preferences.travelStyle}\n`;
        response += `• **Orçamento:** ${preferences.budget}\n\n`;
        response += `Encontrei estes destinos ideais para você:\n\n`;
        
        topDestinations.forEach((dest, index) => {
          response += `**${index + 1}. ${dest.name}, ${dest.country}**\n`;
          response += `${dest.description.substring(0, 120)}...\n`;
          
          // Explica por que este destino combina
          const reasons = [];
          if (preferences.interests.some(interest => dest.tags.includes(interest))) {
            reasons.push(`combina com seu interesse em ${preferences.interests.join(', ')}`);
          }
          if (preferences.travelStyle === 'aventureiro' && dest.ratings.adventure > 7) {
            reasons.push('perfeito para aventureiros');
          }
          if (preferences.travelStyle === 'relaxado' && dest.ratings.relaxation > 7) {
            reasons.push('ideal para relaxar');
          }
          
          if (reasons.length > 0) {
            response += `*Por que é perfeito: ${reasons.join(', ')}*\n\n`;
          }
        });
        
        if (preferences.budgetValue) {
          response += `💰 Seu orçamento de R$ ${preferences.budgetValue.toLocaleString('pt-BR')} está ${getBudgetFit(preferences.budgetValue, topDestinations[0].averageCost)}`;
        }
        
        return response;
      } else {
        return `Com suas preferências específicas (${preferences.interests.join(', ')} + ${preferences.preferredActivities.join(', ')}), vou buscar opções um pouco diferentes. Que tal ser mais flexível em algum aspecto? Isso me ajudaria a encontrar lugares incríveis para você!`;
      }
    } else {
      return "Para fazer recomendações precisas, preciso conhecer suas preferências! Configure seus interesses, atividades favoritas e orçamento no painel ao lado. Assim posso sugerir destinos perfeitos para seu perfil! 🎯";
    }
  }

  // Outras respostas contextuais
  const responses = [
    `Interessante! Com suas preferências em ${preferences.interests.join(' e ')}, que tipo específico de experiência você procura?`,
    `Baseado no que você gosta (${preferences.interests.join(', ')}), você prefere destinos mais conhecidos ou lugares únicos?`,
    `Vejo que você é do tipo ${preferences.travelStyle}. Isso combina muito com alguns destinos que tenho em mente!`,
    "Me conte mais sobre o que está procurando. Posso usar suas preferências para dar sugestões muito específicas!"
  ];

  return hasPreferences 
    ? responses[Math.floor(Math.random() * responses.length)]
    : "Configure suas preferências no painel ao lado para que eu possa entender melhor seu perfil e fazer recomendações personalizadas!";
};

function getBudgetFit(userBudget: number, destinationCost: string): string {
  const costMap = { 'low': 2000, 'medium': 5000, 'high': 15000, 'very high': 30000 };
  const destCost = costMap[destinationCost] || 5000;
  
  if (userBudget >= destCost * 1.5) return "mais que suficiente! 😊";
  if (userBudget >= destCost) return "adequado para este destino! ✅";
  if (userBudget >= destCost * 0.7) return "um pouco apertado, mas viável com planejamento! 💪";
  return "pode ser desafiador, mas vamos encontrar alternativas! 🤔";
}
