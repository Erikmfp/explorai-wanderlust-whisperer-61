
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
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
  
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
  if (lastUserMessage.includes('preferências') || lastUserMessage.includes('configurações') || lastUserMessage.includes('você consegue ver') || lastUserMessage.includes('selecionei')) {
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

  // Análise mais ampla para detectar pedidos de destinos
  const isAskingForDestinations = /(?:destino|viajar|recomen|sugest|lugar|onde|país|cidade|o que.*sugere|oque.*sugere|me.*diga|quais|opções|viagem|passeio|férias|turismo)/i.test(lastUserMessage);
  const isGreeting = /(?:oi|olá|hello|bom dia|boa tarde|boa noite)/i.test(lastUserMessage);

  // Respostas baseadas no contexto e preferências
  if (isGreeting && lastResponseType !== 'greeting') {
    lastResponseType = 'greeting';
    if (hasPreferences) {
      return `Olá! Que bom te ver! Vejo que você configurou suas preferências: gosta de ${preferences.interests.join(', ')} e prefere ${preferences.preferredActivities.join(', ')}. Seu estilo é ${preferences.travelStyle} com orçamento ${preferences.budget}. Como posso ajudar você a encontrar o destino perfeito?`;
    }
    return "Olá! Bem-vindo ao ExplorAI! Vou ajudar você a encontrar destinos incríveis. Configure suas preferências no painel ao lado para recomendações mais precisas!";
  }

  // SEMPRE que detectar pedido de destinos, mostrar recomendações
  if (isAskingForDestinations || lastUserMessage.includes('conhecido') || lastUserMessage.includes('famoso')) {
    lastResponseType = 'destinations';
    
    if (hasPreferences) {
      const destinations = filterDestinations(preferences);
      
      if (destinations.length > 0) {
        const topDestinations = destinations.slice(0, 3);
        let response = `Perfeito! Com base em suas preferências, encontrei estes destinos ideais:\n\n`;
        
        topDestinations.forEach((dest, index) => {
          response += `**${index + 1}. ${dest.name}, ${dest.country}** ⭐\n`;
          response += `${dest.description.substring(0, 150)}...\n`;
          
          // Explica por que este destino combina
          const reasons = [];
          if (preferences.interests.some(interest => dest.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())))) {
            const matchingInterests = preferences.interests.filter(interest => 
              dest.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
            );
            reasons.push(`combina com ${matchingInterests.join(', ')}`);
          }
          
          if (preferences.travelStyle === 'aventureiro' && dest.ratings.adventure > 7) {
            reasons.push('perfeito para aventureiros');
          }
          if (preferences.travelStyle === 'relaxado' && dest.ratings.relaxation > 7) {
            reasons.push('ideal para relaxar');
          }
          if (preferences.travelStyle === 'cultural' && dest.ratings.culture > 7) {
            reasons.push('rico em cultura');
          }
          
          if (reasons.length > 0) {
            response += `✨ *Por que é perfeito: ${reasons.join(', ')}*\n`;
          }
          
          response += `💰 Custo: ${getBudgetLabel(dest.averageCost)}\n\n`;
        });
        
        if (preferences.budgetValue) {
          response += `💡 Seu orçamento de R$ ${preferences.budgetValue.toLocaleString('pt-BR')} está ${getBudgetFit(preferences.budgetValue, topDestinations[0].averageCost)} para estes destinos!`;
        }
        
        response += `\n\n🗺️ Quer saber mais detalhes sobre algum destes destinos?`;
        
        return response;
      } else {
        return `Hmm, com suas preferências específicas (${preferences.interests.join(', ')}), vou buscar opções um pouco diferentes. Que tal considerar ser mais flexível em algum aspecto? Posso sugerir destinos que atendam a maior parte dos seus critérios!`;
      }
    } else {
      return "Para fazer recomendações precisas de destinos, preciso conhecer suas preferências! 🎯\n\nConfigure seus interesses, atividades favoritas e orçamento no painel ao lado. Assim posso sugerir destinos perfeitos para seu perfil!\n\nEnquanto isso, posso sugerir alguns destinos populares como Santorini (Grécia), Kyoto (Japão) ou Costa Rica. Qual tipo de experiência você procura?";
    }
  }

  // Outras respostas contextuais mais diretas
  if (hasPreferences) {
    const responses = [
      `Com seus interesses em ${preferences.interests.join(' e ')}, que tipo específico de experiência você procura? Posso sugerir destinos!`,
      `Vejo que você gosta de ${preferences.interests.join(', ')} e tem orçamento ${preferences.budget}. Quer que eu sugira alguns destinos?`,
      `Perfeito! Seu perfil ${preferences.travelStyle} combina muito com alguns destinos que tenho em mente. Posso mostrar?`,
      "Baseado em suas preferências, tenho várias sugestões incríveis! Quer que eu recomende alguns destinos?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  } else {
    return "Configure suas preferências no painel ao lado para que eu possa entender melhor seu perfil e fazer recomendações personalizadas de destinos incríveis! 🌍✈️";
  }
};

function getBudgetFit(userBudget: number, destinationCost: string): string {
  const costMap = { 'low': 2000, 'medium': 5000, 'high': 15000, 'very high': 30000 };
  const destCost = costMap[destinationCost] || 5000;
  
  if (userBudget >= destCost * 1.5) return "mais que suficiente! 😊";
  if (userBudget >= destCost) return "adequado para este destino! ✅";
  if (userBudget >= destCost * 0.7) return "um pouco apertado, mas viável com planejamento! 💪";
  return "pode ser desafiador, mas vamos encontrar alternativas! 🤔";
}

function getBudgetLabel(cost: string): string {
  const labels: Record<string, string> = {
    'low': 'Econômico',
    'medium': 'Moderado', 
    'high': 'Caro',
    'very high': 'Muito caro'
  };
  return labels[cost] || cost;
}
