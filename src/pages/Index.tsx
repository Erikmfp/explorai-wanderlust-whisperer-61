
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import TravelPreferences from '@/components/TravelPreferences';
import DestinationCard from '@/components/DestinationCard';
import { UserPreferences } from '@/lib/aiService';
import { destinations, filterDestinations, Destination } from '@/data/destinations';
import { Search, Map, Heart, Star } from 'lucide-react';

const Index: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    preferredActivities: [],
    travelStyle: 'equilibrado',
    budget: 'moderado',
    budgetValue: 5000,
    duration: '7-10 dias',
    season: 'qualquer',
  });
  
  const [recommendedDestinations, setRecommendedDestinations] = useState<(Destination & { matchScore?: number })[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Quando as preferências mudam, atualizamos as recomendações
  useEffect(() => {
    if (preferences.interests.length > 0 || preferences.preferredActivities.length > 0) {
      const filtered = filterDestinations(preferences);
      setRecommendedDestinations(filtered.slice(0, 4));
    } else {
      // Se não houver preferências, mostramos alguns destinos aleatórios
      const randomDestinations = [...destinations]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setRecommendedDestinations(randomDestinations);
    }
  }, [preferences]);
  
  const handlePreferencesChange = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };
  
  const handleNewRecommendationRequest = () => {
    setShowRecommendations(true);
    
    // Rolagem suave para a seção de recomendações
    setTimeout(() => {
      const recommendationsSection = document.getElementById('recomendacoes');
      if (recommendationsSection) {
        recommendationsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleStartDiscovery = () => {
    // Scroll to preferences section
    const preferencesSection = document.querySelector('.bg-explorAI-gray');
    if (preferencesSection) {
      preferencesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHowItWorks = () => {
    // Scroll to how it works section
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-travel text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Descubra destinos perfeitos para o seu estilo de viagem
              </h1>
              <p className="text-lg opacity-90 mb-8">
                ExplorAI analisa suas preferências e recomenda lugares que combinam com você,
                incluindo jóias escondidas que você não encontraria sozinho.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleStartDiscovery}
                  className="bg-white text-explorAI-blue px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Iniciar descoberta
                </button>
                <button 
                  onClick={handleHowItWorks}
                  className="bg-explorAI-blue/30 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-explorAI-blue/40 transition-colors border border-white/30"
                >
                  Como funciona
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefícios */}
        <section className="py-12 bg-white" id="como-funciona">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Planeje viagens incríveis com nosso <span className="text-explorAI-blue">assistente inteligente</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Map className="h-8 w-8 text-explorAI-blue" />,
                  title: "Recomendações personalizadas",
                  description: "Destinos escolhidos com base nas suas preferências reais, não apenas nas rotas turísticas comuns."
                },
                {
                  icon: <Heart className="h-8 w-8 text-explorAI-green" />,
                  title: "Descubra lugares únicos",
                  description: "Encontre destinos menos conhecidos que combinam perfeitamente com seu estilo de viagem e interesses."
                },
                {
                  icon: <Star className="h-8 w-8 text-explorAI-amber" />,
                  title: "Planejamento simplificado",
                  description: "Economize horas de pesquisa com sugestões inteligentes que realmente fazem sentido para você."
                }
              ].map((item, index) => (
                <div key={index} className="bg-explorAI-gray rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-explorAI-darkGray text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Interface principal */}
        <section className="py-12 bg-explorAI-gray/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <TravelPreferences onPreferencesChange={handlePreferencesChange} />
                
                <div id="recomendacoes" className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${showRecommendations ? '' : 'hidden'}`}>
                  <h2 className="text-lg font-semibold text-explorAI-darkBlue mb-4">Recomendações para você</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedDestinations.map(destination => (
                      <DestinationCard 
                        key={destination.id} 
                        destination={destination} 
                        budgetValue={preferences.budgetValue}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <ChatInterface 
                preferences={preferences} 
                onNewRecommendationRequest={handleNewRecommendationRequest}
              />
            </div>
          </div>
        </section>
        
        {/* Destinos populares */}
        <section className="py-12 bg-white" id="destinos">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
              Destinos em destaque
            </h2>
            <p className="text-center text-explorAI-darkGray mb-10 max-w-2xl mx-auto">
              Explore alguns dos destinos mais amados por nossa comunidade, cada um com experiências únicas para oferecer.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.slice(0, 8).map(destination => (
                <DestinationCard 
                  key={destination.id} 
                  destination={destination}
                  budgetValue={preferences.budgetValue}
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
