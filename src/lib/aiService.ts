
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

// Simulador de chat com IA para gerar respostas
export const generateAIResponse = async (
  messages: ChatMessage[],
  preferences: UserPreferences
): Promise<string> => {
  // Simula um pequeno atraso para parecer mais natural
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Pega a última mensagem do usuário
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')?.content.toLowerCase();
  
  if (!lastUserMessage) {
    return "Olá! Sou o ExplorAI, seu assistente de viagens personalizadas. Como posso ajudar você hoje?";
  }
  
  // Verifica se o usuário está perguntando sobre destinos
  if (lastUserMessage.includes('destino') || 
      lastUserMessage.includes('viajar') || 
      lastUserMessage.includes('recomenda') || 
      lastUserMessage.includes('sugestão')) {
    
    // Se temos preferências suficientes, damos recomendações
    if (preferences.interests.length > 0 || preferences.preferredActivities.length > 0) {
      const destinations = filterDestinations(preferences);
      
      if (destinations.length > 0) {
        const topDestination = destinations[0];
        
        // Criamos uma resposta mais detalhada baseada nas preferências do usuário
        let response = `Baseado em suas preferências, acho que você vai adorar ${topDestination.name} em ${topDestination.country}! `;
        
        // Adiciona informações sobre preferências específicas
        if (preferences.preferredActivities.length > 0) {
          response += `Este destino é perfeito para ${preferences.preferredActivities[0]}.`;
        }
        
        // Adiciona informações sobre orçamento se disponível
        if (preferences.budgetValue) {
          response += ` Com seu orçamento de aproximadamente R$ ${preferences.budgetValue.toLocaleString('pt-BR')} por pessoa, `;
          
          if (topDestination.averageCost === 'low') {
            response += 'você terá uma margem confortável para aproveitar bem sua viagem.';
          } else if (topDestination.averageCost === 'medium') {
            response += 'você conseguirá ter uma experiência bastante agradável.';
          } else if (topDestination.averageCost === 'high') {
            response += 'pode ser um pouco ajustado, mas ainda viável com um bom planejamento.';
          } else {
            response += 'será importante fazer um planejamento detalhado para aproveitar ao máximo.';
          }
        }
        
        // Adiciona informações sobre duração e temporada se disponíveis
        if (preferences.duration) {
          response += ` O período de ${preferences.duration} é ideal para explorar os principais pontos do destino.`;
        }
        
        if (preferences.season && preferences.season !== 'qualquer') {
          if (topDestination.bestTimeToVisit.length > 0) {
            const seasonMonths = {
              'verao': ['dezembro', 'janeiro', 'fevereiro', 'março'],
              'outono': ['março', 'abril', 'maio', 'junho'],
              'inverno': ['junho', 'julho', 'agosto', 'setembro'],
              'primavera': ['setembro', 'outubro', 'novembro', 'dezembro']
            };
            
            const userSeasonMonths = seasonMonths[preferences.season as keyof typeof seasonMonths];
            const hasOverlap = topDestination.bestTimeToVisit.some(month => userSeasonMonths.includes(month));
            
            if (hasOverlap) {
              response += ` E ótima escolha de temporada! ${preferences.season.charAt(0).toUpperCase() + preferences.season.slice(1)} é realmente uma época excelente para visitar este destino.`;
            } else {
              response += ` Apenas observe que sua temporada de preferência talvez não seja a ideal para este destino. A melhor época para visitar é durante ${topDestination.bestTimeToVisit.join(', ')}.`;
            }
          }
        }
        
        response += " Você pode conferir mais detalhes nas minhas recomendações.";
        
        return response;
      }
    }
    
    // Se não temos preferências suficientes
    return "Para recomendar destinos personalizados, preciso saber mais sobre suas preferências. Você pode me contar mais sobre o que gosta em uma viagem? Por exemplo: você prefere praia ou montanha? Cultura ou aventura? Qual seu orçamento aproximado por pessoa?";
  }
  
  // Se o usuário está compartilhando informações sobre suas preferências
  if (lastUserMessage.includes('gosto') || 
      lastUserMessage.includes('prefiro') || 
      lastUserMessage.includes('interesse')) {
    
    // Resposta baseada nas preferências atuais
    let response = "Obrigado por compartilhar suas preferências! ";
    
    if (preferences.interests.length > 0) {
      response += `Vejo que você se interessa por ${preferences.interests.join(', ')}. `;
    }
    
    if (preferences.preferredActivities.length > 0) {
      response += `E gosta de atividades como ${preferences.preferredActivities.join(', ')}. `;
    }
    
    if (preferences.budgetValue) {
      response += `Com seu orçamento de R$ ${preferences.budgetValue.toLocaleString('pt-BR')} por pessoa, `;
    }
    
    response += "Isso me ajuda a encontrar destinos perfeitos para você. Há algo mais que você valoriza em uma viagem?";
    
    return response;
  }
  
  // Se o usuário está perguntando sobre um país específico
  const countries = ['japão', 'itália', 'frança', 'brasil', 'austrália', 'portugal', 'marrocos'];
  for (const country of countries) {
    if (lastUserMessage.includes(country)) {
      return `${country.charAt(0).toUpperCase() + country.slice(1)} é um destino fascinante! Posso ajudar com recomendações específicas sobre regiões, cidades ou atrações para visitar lá. O que você gostaria de saber?`;
    }
  }
  
  // Se o usuário pergunta sobre duração ou temporada
  if (lastUserMessage.includes('dias') || lastUserMessage.includes('duração') || lastUserMessage.includes('tempo')) {
    return `A duração ideal de uma viagem depende do destino e do seu estilo de viagem. Com base nas suas preferências atuais, ${preferences.duration || '7-10 dias'} seria um período interessante para conhecer bem um destino sem se sentir apressado. Você já tem algum período específico em mente?`;
  }
  
  if (lastUserMessage.includes('temporada') || lastUserMessage.includes('estação') || lastUserMessage.includes('época')) {
    return `A melhor época para viajar varia muito conforme o destino! Você prefere viajar em alguma estação específica do ano? Cada temporada oferece experiências únicas. Por exemplo, o verão é ideal para praias, enquanto o inverno pode ser perfeito para destinos de esqui ou para evitar o turismo de massa em algumas cidades.`;
  }
  
  // Resposta genérica para continuar a conversa
  return "Estou aqui para ajudar você a descobrir destinos incríveis que combinam com seu estilo de viagem. Conte-me mais sobre o que você procura em uma experiência de viagem perfeita, seu orçamento por pessoa ou por quanto tempo gostaria de viajar!";
};
