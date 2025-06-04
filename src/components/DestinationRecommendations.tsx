
import React, { useState, useEffect } from 'react';
import { Destination } from '@/data/destinations';
import { generateDestinationRecommendation } from '@/lib/destinationRecommendationService';
import { Loader2, Sparkles } from 'lucide-react';

interface DestinationRecommendationsProps {
  destination: Destination;
  userBudget?: number;
}

const DestinationRecommendations: React.FC<DestinationRecommendationsProps> = ({
  destination,
  userBudget
}) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await generateDestinationRecommendation(
          destination.name,
          destination.country,
          destination.description,
          userBudget
        );
        setRecommendations(result);
      } catch (err) {
        setError('Erro ao carregar recomendações personalizadas');
        console.error('Erro ao gerar recomendações:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [destination, userBudget]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-explorAI-blue mr-3" />
          <span className="text-explorAI-darkGray">Gerando recomendações personalizadas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-explorAI-darkGray">
            Verifique se a API do Gemini está configurada corretamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-explorAI-blue mr-2" />
        <h3 className="text-lg font-semibold text-explorAI-darkBlue">
          Roteiro Personalizado por IA
        </h3>
      </div>
      
      <div 
        className="prose prose-sm max-w-none text-explorAI-darkGray"
        dangerouslySetInnerHTML={{ 
          __html: recommendations.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br />')
        }}
      />
    </div>
  );
};

export default DestinationRecommendations;
