
import { callGeminiAPI } from './geminiService';

export interface DestinationItinerary {
  day: number;
  activities: {
    time: string;
    activity: string;
    description: string;
  }[];
}

export interface DestinationAttraction {
  name: string;
  description: string;
  rating: number;
  category: string;
}

export interface DestinationTips {
  whenToGo: string;
  transportation: string;
  documentation: string;
  culturalTips: string;
}

export const generateDestinationItinerary = async (
  destinationName: string,
  country: string,
  days: number
): Promise<DestinationItinerary[]> => {
  const prompt = `Crie um itinerário detalhado de ${days} dias para ${destinationName}, ${country}.

Para cada dia, forneça:
- Atividades para manhã, tarde e noite
- Locais turísticos reais e específicos da cidade
- Descrições práticas das atividades

Formato de resposta JSON:
[
  {
    "day": 1,
    "activities": [
      {
        "time": "Manhã",
        "activity": "Nome específico do local/atividade",
        "description": "Descrição detalhada"
      },
      {
        "time": "Tarde", 
        "activity": "Nome específico do local/atividade",
        "description": "Descrição detalhada"
      },
      {
        "time": "Noite",
        "activity": "Nome específico do local/atividade", 
        "description": "Descrição detalhada"
      }
    ]
  }
]

Responda APENAS com o JSON válido, sem texto adicional.`;

  try {
    const response = await callGeminiAPI(prompt);
    const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Erro ao gerar itinerário:', error);
    throw error;
  }
};

export const generateDestinationAttractions = async (
  destinationName: string,
  country: string
): Promise<DestinationAttraction[]> => {
  const prompt = `Liste as 5 principais atrações turísticas de ${destinationName}, ${country}.

Para cada atração, forneça:
- Nome real e específico
- Descrição detalhada
- Avaliação de 1-5 (baseada na popularidade e qualidade)
- Categoria (histórico, cultural, natureza, etc.)

Formato de resposta JSON:
[
  {
    "name": "Nome real da atração",
    "description": "Descrição detalhada da atração, sua importância e o que esperar",
    "rating": 4.5,
    "category": "histórico"
  }
]

Use atrações reais e bem conhecidas. Responda APENAS com o JSON válido, sem texto adicional.`;

  try {
    const response = await callGeminiAPI(prompt);
    const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Erro ao gerar atrações:', error);
    throw error;
  }
};

export const generateDestinationTips = async (
  destinationName: string,
  country: string
): Promise<DestinationTips> => {
  const prompt = `Forneça dicas práticas de viagem para ${destinationName}, ${country}.

Inclua informações sobre:
- Melhor época para visitar
- Transporte local
- Documentação necessária
- Dicas culturais

Formato de resposta JSON:
{
  "whenToGo": "Informações sobre melhor época, clima e estações",
  "transportation": "Opções de transporte local, preços aproximados",
  "documentation": "Documentos necessários, vistos, vacinas",
  "culturalTips": "Costumes locais, etiqueta, dicas para respeitar a cultura"
}

Responda APENAS com o JSON válido, sem texto adicional.`;

  try {
    const response = await callGeminiAPI(prompt);
    const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Erro ao gerar dicas:', error);
    throw error;
  }
};
