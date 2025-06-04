
import { callGeminiAPI } from './geminiService';
import { UserPreferences, ChatMessage } from './aiService';
import { Destination } from '@/data/destinations';

export const generateChatBasedRecommendations = async (
  messages: ChatMessage[],
  preferences: UserPreferences,
  availableDestinations: Destination[]
): Promise<Destination[]> => {
  const conversationContext = messages
    .slice(-3)
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const destinationsList = availableDestinations
    .map(d => `${d.id}: ${d.name}, ${d.country} - ${d.description.substring(0, 100)}...`)
    .join('\n');

  const prompt = `Baseado na conversa e preferências do usuário, selecione os 3 destinos mais adequados da lista disponível.

CONVERSA RECENTE:
${conversationContext}

PREFERÊNCIAS DO USUÁRIO:
- Interesses: ${preferences.interests.join(', ') || 'Não definidos'}
- Atividades: ${preferences.preferredActivities.join(', ') || 'Não definidas'}
- Estilo: ${preferences.travelStyle}
- Orçamento: ${preferences.budget}

DESTINOS DISPONÍVEIS:
${destinationsList}

Responda com uma lista de IDs separados por vírgula dos 3 destinos mais adequados (exemplo: dest-001,dest-003,dest-005).
Considere a conversa recente e as preferências para fazer as melhores recomendações.

Responda APENAS com os IDs separados por vírgula, sem texto adicional.`;

  try {
    const response = await callGeminiAPI(prompt);
    const selectedIds = response.trim().split(',').map(id => id.trim());
    
    return availableDestinations.filter(dest => 
      selectedIds.includes(dest.id)
    ).slice(0, 3);
  } catch (error) {
    console.error('Erro ao gerar recomendações baseadas no chat:', error);
    // Fallback to first 3 destinations if AI fails
    return availableDestinations.slice(0, 3);
  }
};
