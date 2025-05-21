
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
        return `Baseado em suas preferências, acho que você vai adorar ${topDestination.name} em ${topDestination.country}! É um lugar perfeito para ${preferences.preferredActivities[0] || 'explorar'}. Você pode conferir mais detalhes nas minhas recomendações.`;
      }
    }
    
    // Se não temos preferências suficientes
    return "Para recomendar destinos personalizados, preciso saber mais sobre suas preferências. Você pode me contar mais sobre o que gosta em uma viagem? Por exemplo: você prefere praia ou montanha? Cultura ou aventura?";
  }
  
  // Se o usuário está compartilhando informações sobre suas preferências
  if (lastUserMessage.includes('gosto') || 
      lastUserMessage.includes('prefiro') || 
      lastUserMessage.includes('interesse')) {
    return "Obrigado por compartilhar suas preferências! Isso me ajuda a encontrar destinos perfeitos para você. Há algo mais que você valoriza em uma viagem? Como orçamento, tipo de clima ou duração ideal da viagem?";
  }
  
  // Se o usuário está perguntando sobre um país específico
  const countries = ['japão', 'itália', 'frança', 'brasil', 'austrália', 'portugal', 'marrocos'];
  for (const country of countries) {
    if (lastUserMessage.includes(country)) {
      return `${country.charAt(0).toUpperCase() + country.slice(1)} é um destino fascinante! Posso ajudar com recomendações específicas sobre regiões, cidades ou atrações para visitar lá. O que você gostaria de saber?`;
    }
  }
  
  // Resposta genérica para continuar a conversa
  return "Estou aqui para ajudar você a descobrir destinos incríveis que combinam com seu estilo de viagem. Conte-me mais sobre o que você procura em uma experiência de viagem perfeita!";
};
