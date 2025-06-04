import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TravelPreferences from '@/components/TravelPreferences';
import ChatInterface from '@/components/ChatInterface';
import DestinationCard from '@/components/DestinationCard';
import { destinations, Destination } from '@/data/destinations';
import { UserPreferences, ChatMessage } from '@/lib/aiService';
import { generateChatBasedRecommendations } from '@/lib/chatRecommendationService';

const Index: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    preferredActivities: [],
    travelStyle: '',
    budget: '',
    budgetValue: undefined,
    duration: undefined,
    season: undefined,
  });
  const [recommendedDestinations, setRecommendedDestinations] = useState<Destination[]>([]);
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const filtered = filterDestinations(destinations, preferences);
    setRecommendedDestinations(filtered.slice(0, 3));
  }, [preferences]);

  const handlePreferenceChange = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  const filterDestinations = (
    destinations: Destination[],
    preferences: UserPreferences
  ): Destination[] => {
    return destinations.filter(destination => {
      const interestMatch =
        preferences.interests.length === 0 ||
        preferences.interests.some(interest =>
          destination.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        );

      const activityMatch =
        preferences.preferredActivities.length === 0 ||
        preferences.preferredActivities.some(activity =>
          destination.tags.some(tag => tag.toLowerCase().includes(activity.toLowerCase()))
        );

      return interestMatch && activityMatch;
    });
  };

  const handleDestinationClick = (destination: Destination) => {
    navigate(`/destination/${destination.id}`, { state: { destination, budgetValue: preferences.budgetValue } });
  };

  const handleNewRecommendationRequest = async () => {
    if (chatMessages.length > 0) {
      try {
        const aiRecommendations = await generateChatBasedRecommendations(
          chatMessages,
          preferences,
          destinations
        );
        setRecommendedDestinations(aiRecommendations);
      } catch (error) {
        console.error('Erro ao gerar recomendações baseadas no chat:', error);
        const filtered = filterDestinations(destinations, preferences);
        setRecommendedDestinations(filtered.slice(0, 3));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TravelPreferences onChange={handlePreferenceChange} />
            <ChatInterface 
              preferences={preferences} 
              onNewRecommendationRequest={handleNewRecommendationRequest}
            />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-explorAI-darkBlue mb-4">
              Destinos recomendados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedDestinations.map(destination => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={() => handleDestinationClick(destination)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-explorAI-darkBlue text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            © 2025 ExplorAI - Recomendador Inteligente de Viagens Personalizadas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
