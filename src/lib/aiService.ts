
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

  // Análise contextual da mensagem
  const isAskingForDestinations = /(?:destino|viajar|recomen|sugest|lugar|onde|país|cidade)/i.test(lastUserMessage);
  const isAskingAboutBudget = /(?:orçamento|dinheiro|custo|preço|valor|gasto)/i.test(lastUserMessage);
  const isAskingAboutTime = /(?:tempo|dias|duração|período|quando|época)/i.test(lastUserMessage);
  const isGreeting = /(?:oi|olá|hello|bom dia|boa tarde|boa noite)/i.test(lastUserMessage);
  const isSharingPreferences = /(?:gosto|prefiro|amo|adoro|interesse|paixão)/i.test(lastUserMessage);

  // Respostas baseadas no contexto e preferências
  if (isGreeting && lastResponseType !== 'greeting') {
    lastResponseType = 'greeting';
    if (hasPreferences) {
      return `Olá! Que bom te ver novamente! Vejo que você já configurou suas preferências - ${preferences.interests.join(', ')} são ótimas escolhas! Como posso ajudar você a encontrar o destino perfeito hoje?`;
    }
    return "Olá! Bem-vindo ao ExplorAI! Para começar, que tal me contar o que você mais gosta em uma viagem? Praia, montanha, cultura, gastronomia...?";
  }

  if (isAskingForDestinations) {
    lastResponseType = 'destinations';
    
    if (hasPreferences) {
      const destinations = filterDestinations(preferences);
      
      if (destinations.length > 0) {
        const topDestinations = destinations.slice(0, 3);
        let response = `Perfeito! Baseado em suas preferências (${preferences.interests.join(', ')}) e atividades favoritas (${preferences.preferredActivities.join(', ')}), encontrei alguns destinos incríveis:\n\n`;
        
        topDestinations.forEach((dest, index) => {
          response += `${index + 1}. **${dest.name}, ${dest.country}** - ${dest.description.substring(0, 100)}...\n`;
        });
        
        // Adiciona informação sobre orçamento
        if (preferences.budgetValue) {
          const budgetInfo = getBudgetAdvice(preferences.budgetValue, topDestinations[0].averageCost);
          response += `\n💰 ${budgetInfo}`;
        }
        
        // Adiciona informação sobre temporada
        if (preferences.season && preferences.season !== 'qualquer') {
          response += `\n🌤️ Para sua preferência de viajar no ${preferences.season}, ${topDestinations[0].name} é uma excelente escolha!`;
        }
        
        response += "\n\nQue tal explorar mais detalhes sobre algum desses destinos?";
        return response;
      } else {
        return "Hmm, com suas preferências específicas, preciso expandir um pouco a busca. Que tal me contar se você estaria aberto a explorar algo um pouco diferente do usual? Às vezes os melhores destinos são aqueles que nos surpreendem!";
      }
    } else {
      return "Adoraria recomendar destinos perfeitos para você! Mas primeiro, me conta: você prefere aventura ou relaxamento? Praia ou montanha? E qual seu orçamento aproximado por pessoa? Isso me ajuda a encontrar exatamente o que você procura! 🎯";
    }
  }

  if (isAskingAboutBudget && lastResponseType !== 'budget') {
    lastResponseType = 'budget';
    if (preferences.budgetValue) {
      const category = getBudgetCategory(preferences.budgetValue);
      return `Pelo seu orçamento de R$ ${preferences.budgetValue.toLocaleString('pt-BR')} por pessoa, você está na categoria "${category}". Isso te dá ${getBudgetPossibilities(category)}. Quer saber quais destinos cabem perfeitamente nesse orçamento?`;
    }
    return "O orçamento é super importante para escolher o destino ideal! Pode me dizer quanto você pretende gastar por pessoa? Assim posso recomendar lugares que vão te dar o máximo de experiência pelo seu investimento! 💸";
  }

  if (isAskingAboutTime && lastResponseType !== 'time') {
    lastResponseType = 'time';
    if (preferences.duration) {
      return `${preferences.duration} é um período excelente! ${getTimeAdvice(preferences.duration)} Considerando esse tempo, que tipo de experiência você quer priorizar?`;
    }
    return "A duração da viagem faz toda diferença no planejamento! Você está pensando em quantos dias? Um final de semana, uma semana, ou uma aventura mais longa?";
  }

  if (isSharingPreferences && lastResponseType !== 'preferences') {
    lastResponseType = 'preferences';
    const newInfo = extractPreferencesFromMessage(lastUserMessage);
    return `Que legal! ${newInfo} Isso me ajuda muito a entender seu perfil de viajante. ${getPersonalizedQuestion(preferences, lastUserMessage)}`;
  }

  // Perguntas contextuais baseadas no que já sabemos
  if (hasPreferences) {
    const missingInfo = getMissingPreferences(preferences);
    if (missingInfo.length > 0) {
      return `Ótimo! Já sei bastante sobre suas preferências. ${missingInfo[0]} Isso vai me ajudar a refinar ainda mais as recomendações!`;
    }
  }

  // Respostas variadas para manter a conversa fluida
  const contextualResponses = [
    "Interessante! Me conta mais sobre isso. O que mais te atrai em uma viagem?",
    "Entendi! E você prefere destinos mais movimentados ou lugares mais tranquilos?",
    "Que legal! Você já pensou em explorar destinos fora do óbvio? Às vezes as melhores experiências estão nos lugares menos esperados!",
    "Hmm, e quando você viaja, prefere relaxar ou ter uma agenda cheia de atividades?",
  ];

  // Evita repetir a mesma resposta
  const availableResponses = contextualResponses.filter(resp => 
    !conversationContext.some(ctx => resp.toLowerCase().includes(ctx.substring(0, 10)))
  );

  return availableResponses.length > 0 
    ? availableResponses[Math.floor(Math.random() * availableResponses.length)]
    : "Conte-me mais sobre o que você procura em uma viagem ideal!";
};

// Funções auxiliares para respostas mais inteligentes
function getBudgetCategory(value: number): string {
  if (value < 2000) return 'econômico';
  if (value < 5000) return 'moderado';
  if (value < 15000) return 'confortável';
  if (value < 50000) return 'luxo';
  return 'ultra luxo';
}

function getBudgetAdvice(userBudget: number, destinationCost: string): string {
  const category = getBudgetCategory(userBudget);
  
  const adviceMap: Record<string, Record<string, string>> = {
    'econômico': {
      'low': 'Perfeito! Seu orçamento está ideal para este destino.',
      'medium': 'Com planejamento, dá para aproveitar bem!',
      'high': 'Pode ser um pouco apertado, mas não impossível.',
      'very high': 'Talvez seja melhor considerar outras opções.'
    },
    'moderado': {
      'low': 'Excelente! Você terá uma margem confortável.',
      'medium': 'Perfeita combinação custo-benefício!',
      'high': 'Dá para aproveitar com um bom planejamento.',
      'very high': 'Pode ser um investimento alto para este perfil.'
    },
    'confortável': {
      'low': 'Você poderá se dar alguns luxos extras!',
      'medium': 'Orçamento perfeito para uma viagem confortável.',
      'high': 'Consegue aproveitar muito bem tudo que o destino oferece.',
      'very high': 'Uma experiência premium está ao seu alcance!'
    }
  };

  return adviceMap[category]?.[destinationCost] || 'Vamos encontrar opções que cabem no seu orçamento!';
}

function getBudgetPossibilities(category: string): string {
  const possibilities: Record<string, string> = {
    'econômico': 'acesso a destinos nacionais incríveis e alguns internacionais com bom planejamento',
    'moderado': 'uma boa variedade de destinos nacionais e internacionais',
    'confortável': 'acesso a destinos premium e experiências diferenciadas',
    'luxo': 'possibilidades quase ilimitadas para experiências exclusivas',
    'ultra luxo': 'acesso aos destinos mais exclusivos do mundo'
  };
  
  return possibilities[category] || 'muitas possibilidades interessantes';
}

function getTimeAdvice(duration: string): string {
  const adviceMap: Record<string, string> = {
    '2-3 dias': 'Perfeito para uma escapada! Dá para conhecer bem uma cidade ou região específica.',
    '4-6 dias': 'Tempo ideal para explorar um destino sem pressa, com dias para relaxar também.',
    '7-10 dias': 'Duração clássica! Permite conhecer várias facetas de um país ou região.',
    '11-15 dias': 'Tempo generoso para uma experiência mais profunda e completa.',
    '15+ dias': 'Uma verdadeira jornada! Dá para explorar múltiplos destinos ou mergulhar profundamente na cultura local.'
  };
  
  return adviceMap[duration] || 'É um bom período para viajar!';
}

function extractPreferencesFromMessage(message: string): string {
  if (message.includes('praia')) return 'Praia é sempre uma ótima escolha!';
  if (message.includes('montanha')) return 'Montanhas oferecem paisagens incríveis!';
  if (message.includes('cultura')) return 'Cultura enriquece muito a experiência de viagem!';
  if (message.includes('gastronomia')) return 'Gastronomia é uma das melhores formas de conhecer um lugar!';
  if (message.includes('aventura')) return 'Aventura torna qualquer viagem inesquecível!';
  return 'Adoro conhecer mais sobre suas preferências!';
}

function getPersonalizedQuestion(preferences: UserPreferences, lastMessage: string): string {
  if (preferences.interests.length === 0) {
    return "E me conta, o que mais te emociona em uma viagem: paisagens naturais, história, gastronomia ou algo mais?";
  }
  
  if (!preferences.budgetValue) {
    return "E quanto ao orçamento? Isso me ajuda a filtrar as opções perfeitas para você!";
  }
  
  if (!preferences.duration || preferences.duration === '') {
    return "Quantos dias você costuma gostar de viajar?";
  }
  
  return "Com essas informações, já posso fazer recomendações bem personalizadas! Quer ver algumas opções?";
}

function getMissingPreferences(preferences: UserPreferences): string[] {
  const missing = [];
  
  if (preferences.interests.length === 0) {
    missing.push("Que tipo de experiências te interessam mais em uma viagem?");
  }
  
  if (!preferences.budgetValue) {
    missing.push("Qual seria seu orçamento aproximado por pessoa?");
  }
  
  if (!preferences.duration) {
    missing.push("Por quantos dias você gostaria de viajar?");
  }
  
  if (preferences.season === 'qualquer') {
    missing.push("Tem alguma época do ano que prefere viajar?");
  }
  
  return missing;
}
