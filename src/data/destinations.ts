
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  tags: string[];
  ratings: {
    culture: number;
    nature: number;
    food: number;
    adventure: number;
    relaxation: number;
  };
  bestTimeToVisit: string[];
  averageCost: "low" | "medium" | "high" | "very high";
}

export const destinations: Destination[] = [
  {
    id: "dest-001",
    name: "Kyoto",
    country: "Japão",
    description: "Antiga capital do Japão, conhecida por seus templos históricos, jardins tradicionais, e a experiência da cultura japonesa autêntica.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    tags: ["cultura", "história", "templos", "jardins", "tradicional"],
    ratings: {
      culture: 9.5,
      nature: 8.0,
      food: 9.0,
      adventure: 6.5,
      relaxation: 8.5
    },
    bestTimeToVisit: ["março", "abril", "outubro", "novembro"],
    averageCost: "medium"
  },
  {
    id: "dest-002",
    name: "Costa Rica",
    country: "Costa Rica",
    description: "Paraíso natural com biodiversidade impressionante, florestas tropicais, vulcões ativos e praias exuberantes para os amantes da natureza.",
    imageUrl: "https://images.unsplash.com/photo-1518182170546-07661fd94144",
    tags: ["natureza", "fauna", "floresta", "praia", "aventura"],
    ratings: {
      culture: 7.0,
      nature: 9.8,
      food: 7.5,
      adventure: 9.2,
      relaxation: 8.0
    },
    bestTimeToVisit: ["dezembro", "janeiro", "fevereiro", "março", "abril"],
    averageCost: "medium"
  },
  {
    id: "dest-003",
    name: "Porto",
    country: "Portugal",
    description: "Cidade histórica com arquitetura deslumbrante, famosa por seu vinho do porto, comida deliciosa e um charme autêntico português.",
    imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b",
    tags: ["vinho", "arquitetura", "gastronomia", "história", "cultura"],
    ratings: {
      culture: 9.0,
      nature: 7.0,
      food: 9.5,
      adventure: 6.0,
      relaxation: 8.0
    },
    bestTimeToVisit: ["maio", "junho", "setembro", "outubro"],
    averageCost: "medium"
  },
  {
    id: "dest-004",
    name: "Ilha de Santorini",
    country: "Grécia",
    description: "Ilha vulcânica famosa por suas casas brancas com telhados azuis, pôr do sol espetacular e vistas impressionantes do Mar Mediterrâneo.",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    tags: ["ilha", "romântico", "vistas", "praia", "gastronomia"],
    ratings: {
      culture: 8.0,
      nature: 8.5,
      food: 8.0,
      adventure: 6.5,
      relaxation: 9.5
    },
    bestTimeToVisit: ["abril", "maio", "junho", "setembro", "outubro"],
    averageCost: "high"
  },
  {
    id: "dest-005",
    name: "Marrakech",
    country: "Marrocos",
    description: "Cidade vibrante conhecida por seus mercados tradicionais (souks), palácios históricos e atmosfera cultural única entre o deserto e as montanhas.",
    imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b",
    tags: ["mercados", "exótico", "cultura", "história", "arquitetura"],
    ratings: {
      culture: 9.5,
      nature: 7.0,
      food: 8.5,
      adventure: 8.0,
      relaxation: 7.0
    },
    bestTimeToVisit: ["março", "abril", "maio", "outubro", "novembro"],
    averageCost: "low"
  },
  {
    id: "dest-006",
    name: "Nova Zelândia",
    country: "Nova Zelândia",
    description: "País com paisagens de tirar o fôlego, desde montanhas nevadas até praias intocadas e florestas primitivas, perfeito para aventureiros.",
    imageUrl: "https://images.unsplash.com/photo-1493606278519-11aa9f86e40a",
    tags: ["natureza", "aventura", "montanhas", "trekking", "paisagens"],
    ratings: {
      culture: 7.5,
      nature: 10.0,
      food: 7.5,
      adventure: 9.8,
      relaxation: 8.0
    },
    bestTimeToVisit: ["dezembro", "janeiro", "fevereiro", "março"],
    averageCost: "high"
  },
  {
    id: "dest-007",
    name: "Budapeste",
    country: "Hungria",
    description: "Capital húngara cortada pelo Rio Danúbio, conhecida por sua arquitetura histórica, banhos termais e cena gastronômica emergente.",
    imageUrl: "https://images.unsplash.com/photo-1551867633-194f125bcc72",
    tags: ["arquitetura", "história", "termas", "cultura", "gastronomia"],
    ratings: {
      culture: 8.5,
      nature: 6.5,
      food: 8.0,
      adventure: 6.0,
      relaxation: 8.5
    },
    bestTimeToVisit: ["abril", "maio", "setembro", "outubro"],
    averageCost: "low"
  },
  {
    id: "dest-008",
    name: "Ilha de Bali",
    country: "Indonésia",
    description: "Ilha paradisíaca com praias de areia branca, templos hindus, terraços de arroz e uma cultura única que mistura espiritualidade e relaxamento.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    tags: ["praia", "cultura", "templos", "natureza", "relaxamento"],
    ratings: {
      culture: 8.5,
      nature: 9.0,
      food: 8.0,
      adventure: 7.5,
      relaxation: 9.5
    },
    bestTimeToVisit: ["abril", "maio", "junho", "setembro", "outubro"],
    averageCost: "low"
  }
];

// Função auxiliar para filtrar destinos com base em preferências
export const filterDestinations = (preferences: {
  interests: string[];
  preferredActivities: string[];
  travelStyle: string;
  budget: string;
}) => {
  // Simulação simples de algoritmo de recomendação
  let filtered = [...destinations];
  
  // Filtrar por orçamento
  if (preferences.budget) {
    const budgetMap: Record<string, string[]> = {
      "econômico": ["low"],
      "moderado": ["low", "medium"],
      "luxo": ["medium", "high", "very high"]
    };
    
    const allowedBudgets = budgetMap[preferences.budget.toLowerCase()] || [];
    if (allowedBudgets.length > 0) {
      filtered = filtered.filter(d => allowedBudgets.includes(d.averageCost));
    }
  }
  
  // Calcular pontuação para cada destino com base nas preferências
  return filtered.map(dest => {
    let score = 0;
    
    // Pontos para interesses que combinam com as tags
    preferences.interests.forEach(interest => {
      if (dest.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))) {
        score += 2;
      }
    });
    
    // Pontos para atividades preferidas
    preferences.preferredActivities.forEach(activity => {
      const activityScoreMap: Record<string, keyof typeof dest.ratings> = {
        "explorar cultura local": "culture",
        "aventuras ao ar livre": "adventure",
        "relaxar em paisagens naturais": "relaxation",
        "experimentar gastronomia": "food",
        "apreciar a natureza": "nature"
      };
      
      const ratingCategory = activityScoreMap[activity.toLowerCase()];
      if (ratingCategory && dest.ratings[ratingCategory] > 7) {
        score += dest.ratings[ratingCategory] / 10 * 3;
      }
    });
    
    // Pontos para estilo de viagem
    if (preferences.travelStyle === "aventureiro" && dest.ratings.adventure > 8) {
      score += 3;
    } else if (preferences.travelStyle === "relaxado" && dest.ratings.relaxation > 8) {
      score += 3;
    } else if (preferences.travelStyle === "cultural" && dest.ratings.culture > 8) {
      score += 3;
    }
    
    return { ...dest, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
