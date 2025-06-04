import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Destination, destinations } from '@/data/destinations';
import Header from '@/components/Header';
import { MapPin, Calendar, Clock, Star, ArrowLeft, Heart, Share, Hotel, Ticket, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  generateDestinationItinerary, 
  generateDestinationAttractions, 
  generateDestinationTips,
  DestinationItinerary,
  DestinationAttraction,
  DestinationTips
} from '@/lib/destinationAIService';

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const passedState = location.state as { 
    destination: Destination; 
    budgetValue: number 
  } | undefined;
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [itineraryDays, setItineraryDays] = useState<number>(7);
  const [aiItinerary, setAiItinerary] = useState<DestinationItinerary[]>([]);
  const [aiAttractions, setAiAttractions] = useState<DestinationAttraction[]>([]);
  const [aiTips, setAiTips] = useState<DestinationTips | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  
  useEffect(() => {
    // Se o destino foi passado pelo state, usamos ele
    if (passedState?.destination) {
      setDestination(passedState.destination);
      setLoading(false);
      return;
    }
    
    // Caso contrário, procuramos pelo ID nos destinos
    if (id) {
      const foundDestination = destinations.find(d => d.id === id);
      if (foundDestination) {
        setDestination(foundDestination);
      }
    }
    setLoading(false);
  }, [id, passedState]);

  // Load AI content when destination changes
  useEffect(() => {
    if (destination) {
      loadAIContent();
    }
  }, [destination, itineraryDays]);

  const loadAIContent = async () => {
    if (!destination) return;
    
    setContentLoading(true);
    try {
      const [itinerary, attractions, tips] = await Promise.all([
        generateDestinationItinerary(destination.name, destination.country, itineraryDays),
        generateDestinationAttractions(destination.name, destination.country),
        generateDestinationTips(destination.name, destination.country)
      ]);
      
      setAiItinerary(itinerary);
      setAiAttractions(attractions);
      setAiTips(tips);
    } catch (error) {
      console.error('Erro ao carregar conteúdo AI:', error);
    } finally {
      setContentLoading(false);
    }
  };
  
  const getBudgetLabel = (cost: string): string => {
    const labels: Record<string, string> = {
      'low': 'Econômico',
      'medium': 'Moderado',
      'high': 'Caro',
      'very high': 'Muito caro'
    };
    return labels[cost] || cost;
  };

  const getApproximatePrice = (cost: string): number => {
    let basePrice = 0;
    
    switch (cost) {
      case 'low':
        basePrice = 2500;
        break;
      case 'medium':
        basePrice = 5500;
        break;
      case 'high':
        basePrice = 12000;
        break;
      case 'very high':
        basePrice = 25000;
        break;
      default:
        basePrice = 5000;
    }
    
    // Adiciona uma variação de até 20% para dar mais diversidade nos preços
    const variation = Math.random() * 0.4 - 0.2; // -20% a +20%
    return Math.round(basePrice * (1 + variation));
  };
  
  const generateItinerary = (days: number) => {
    if (!destination) return [];
    
    const tags = destination.tags;
    const activities = [
      'Passeio pelo centro histórico',
      'Visita ao museu local',
      'Exploração de parques naturais',
      'Tour gastronômico',
      'Dia de praia',
      'Compras em mercados locais',
      'Visita a pontos turísticos icônicos',
      'Excursão a uma cidade próxima',
      'Aula de culinária típica',
      'Passeio de barco',
      'Relaxamento em spas locais',
      'Tour fotográfico pela cidade',
      'Trilha em áreas naturais',
      'Show cultural',
      'Visita a monumentos históricos'
    ];
    
    // Filtrar atividades com base nas tags do destino
    const relevantActivities = activities.filter(activity => {
      // Mapeamento simplificado de atividades para tags
      const activityTags: Record<string, string[]> = {
        'Passeio pelo centro histórico': ['histórico', 'arquitetura', 'cultural'],
        'Visita ao museu local': ['histórico', 'cultural', 'arte'],
        'Exploração de parques naturais': ['natureza', 'aventura', 'paisagem'],
        'Tour gastronômico': ['gastronomia', 'cultural'],
        'Dia de praia': ['praia', 'relaxamento', 'natureza'],
        'Compras em mercados locais': ['cultural', 'gastronomia', 'artesanato'],
        'Visita a pontos turísticos icônicos': ['histórico', 'arquitetura', 'cultural'],
        'Excursão a uma cidade próxima': ['cultural', 'histórico'],
        'Aula de culinária típica': ['gastronomia', 'cultural'],
        'Passeio de barco': ['natureza', 'aventura', 'praia'],
        'Relaxamento em spas locais': ['relaxamento', 'luxo'],
        'Tour fotográfico pela cidade': ['arquitetura', 'cultural', 'paisagem'],
        'Trilha em áreas naturais': ['natureza', 'aventura'],
        'Show cultural': ['cultural', 'arte'],
        'Visita a monumentos históricos': ['histórico', 'arquitetura', 'cultural']
      };
      
      const activityTagList = activityTags[activity] || [];
      return activityTagList.some(tag => tags.some(t => t.toLowerCase().includes(tag)));
    });
    
    // Se não tivermos atividades relevantes suficientes, usamos todas
    const activitiesPool = relevantActivities.length >= days * 2 ? relevantActivities : activities;
    
    const itinerary = [];
    
    // Gerar itinerário para o número de dias especificado
    for (let day = 1; day <= days; day++) {
      const dailyActivities = [];
      
      // Manhã
      const morningActivity = activitiesPool[Math.floor(Math.random() * activitiesPool.length)];
      dailyActivities.push({
        time: 'Manhã',
        activity: morningActivity,
        description: `Aproveite a ${morningActivity.toLowerCase()} para conhecer mais sobre a cultura local.`
      });
      
      // Tarde
      let afternoonActivity;
      do {
        afternoonActivity = activitiesPool[Math.floor(Math.random() * activitiesPool.length)];
      } while (afternoonActivity === morningActivity);
      
      dailyActivities.push({
        time: 'Tarde',
        activity: afternoonActivity,
        description: `Dedique a tarde para ${afternoonActivity.toLowerCase()} e aproveitar ao máximo sua experiência.`
      });
      
      // Noite - algo mais relaxado
      const eveningActivities = [
        'Jantar em restaurante local',
        'Caminhada noturna pela cidade',
        'Evento cultural noturno',
        'Descanso no hotel',
        'Passeio por área de entretenimento'
      ];
      
      dailyActivities.push({
        time: 'Noite',
        activity: eveningActivities[Math.floor(Math.random() * eveningActivities.length)],
        description: 'Termine o dia relaxando e aproveitando a vida noturna local.'
      });
      
      itinerary.push({
        day,
        activities: dailyActivities
      });
    }
    
    return itinerary;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-explorAI-blue"></div>
        </div>
      </div>
    );
  }
  
  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-explorAI-darkBlue mb-4">Destino não encontrado</h2>
          <p className="text-explorAI-darkGray mb-6">Não foi possível encontrar o destino solicitado.</p>
          <Button onClick={() => navigate('/')}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }
  
  const avgRating = (
    Object.values(destination.ratings).reduce((a, b) => a + b, 0) / 
    Object.values(destination.ratings).length
  ).toFixed(1);
  
  const price = getApproximatePrice(destination.averageCost);
  
  const estimatedBudget = {
    hospedagem: Math.round(price * 0.4),
    alimentacao: Math.round(price * 0.3),
    passeios: Math.round(price * 0.2),
    transporte: Math.round(price * 0.1)
  };
  
  const handleDurationChange = (duration: string) => {
    switch (duration) {
      case '3-dias':
        setItineraryDays(3);
        break;
      case '5-dias':
        setItineraryDays(5);
        break;
      case '7-dias':
        setItineraryDays(7);
        break;
      case '10-dias':
        setItineraryDays(10);
        break;
      case '15-dias':
        setItineraryDays(15);
        break;
      default:
        setItineraryDays(7);
    }
  };
  
  const itinerary = generateItinerary(itineraryDays);
  
  const getBestSeasonText = (months: string[]): string => {
    if (months.length === 0) return 'Ano todo';
    if (months.length > 3) {
      const firstMonth = months[0].charAt(0).toUpperCase() + months[0].slice(1);
      const lastMonth = months[months.length - 1].charAt(0).toUpperCase() + months[months.length - 1].slice(1);
      return `${firstMonth} - ${lastMonth}`;
    }
    return months.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section com imagem de background */}
        <section className="relative h-80 md:h-96 flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src={destination.imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-white mt-12">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-6 bg-black/30 border border-white/30"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-explorAI-blue">
                    {getBudgetLabel(destination.averageCost)}
                  </Badge>
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    <span>{avgRating}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{destination.name}</h1>
                
                <div className="flex items-center text-white/90">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{destination.country}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-6 md:mt-0">
                <Button className="bg-white/20 text-white border border-white/50 hover:bg-white hover:text-explorAI-blue font-medium">
                  <Heart className="mr-1 h-4 w-4" />
                  Favorito
                </Button>
                <Button className="bg-white/20 text-white border border-white/50 hover:bg-white hover:text-explorAI-blue font-medium">
                  <Share className="mr-1 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Conteúdo principal */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 mb-8">
              <h2 className="text-2xl font-bold text-explorAI-darkBlue mb-4">Sobre {destination.name}</h2>
              
              <p className="text-explorAI-darkGray mb-6">
                {destination.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-explorAI-blue p-1.5 bg-explorAI-lightBlue rounded-md mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Melhor época para visitar</h3>
                    <p className="text-explorAI-darkBlue">{getBestSeasonText(destination.bestTimeToVisit)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-explorAI-green p-1.5 bg-green-100 rounded-md mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tempo recomendado</h3>
                    <p className="text-explorAI-darkBlue">7-10 dias</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-explorAI-amber p-1.5 bg-amber-100 rounded-md mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Região</h3>
                    <p className="text-explorAI-darkBlue">{destination.country}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {destination.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-gray-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna principal - Abas de informações */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="itinerario">
                  <TabsList className="grid grid-cols-3 w-full mb-6">
                    <TabsTrigger value="itinerario">Itinerário</TabsTrigger>
                    <TabsTrigger value="atrações">Principais atrações</TabsTrigger>
                    <TabsTrigger value="dicas">Dicas de viagem</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="itinerario">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-explorAI-darkBlue">Planejamento sugerido</h2>
                        <div className="flex gap-2">
                          {['3-dias', '5-dias', '7-dias', '10-dias', '15-dias'].map(duration => (
                            <Button 
                              key={duration} 
                              variant={itineraryDays === parseInt(duration.split('-')[0]) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDurationChange(duration)}
                              disabled={contentLoading}
                            >
                              {duration.replace('-', ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {contentLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-explorAI-blue"></div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {aiItinerary.map(day => (
                            <div key={day.day} className="border-l-2 border-explorAI-blue pl-4">
                              <h3 className="text-lg font-medium text-explorAI-darkBlue mb-3">Dia {day.day}</h3>
                              
                              <div className="space-y-4">
                                {day.activities.map((activity, i) => (
                                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                      <Badge variant="outline" className="bg-white border-explorAI-blue text-explorAI-blue">
                                        {activity.time}
                                      </Badge>
                                    </div>
                                    <h4 className="font-medium text-explorAI-darkBlue mb-1">{activity.activity}</h4>
                                    <p className="text-sm text-explorAI-darkGray">{activity.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="atrações">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-bold text-explorAI-darkBlue mb-4">Principais atrações em {destination?.name}</h2>
                      
                      {contentLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-explorAI-blue"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {aiAttractions.map((attraction, i) => (
                            <div key={i} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                              <h3 className="text-lg font-medium text-explorAI-darkBlue mb-2">
                                {attraction.name}
                              </h3>
                              <p className="text-explorAI-darkGray mb-2">
                                {attraction.description}
                              </p>
                              <div className="flex items-center mt-2">
                                {[...Array(5)].map((_, starIndex) => (
                                  <Star 
                                    key={starIndex} 
                                    className={`h-4 w-4 ${
                                      starIndex < Math.floor(attraction.rating) 
                                        ? 'text-amber-500 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                  {attraction.rating.toFixed(1)} - {attraction.category}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dicas">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-bold text-explorAI-darkBlue mb-4">Dicas úteis para sua viagem</h2>
                      
                      {contentLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-explorAI-blue"></div>
                        </div>
                      ) : aiTips ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-explorAI-darkBlue mb-2">Quando ir</h3>
                            <p className="text-explorAI-darkGray">{aiTips.whenToGo}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium text-explorAI-darkBlue mb-2">Transporte local</h3>
                            <p className="text-explorAI-darkGray">{aiTips.transportation}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium text-explorAI-darkBlue mb-2">Documentação</h3>
                            <p className="text-explorAI-darkGray">{aiTips.documentation}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium text-explorAI-darkBlue mb-2">Dicas culturais</h3>
                            <p className="text-explorAI-darkGray">{aiTips.culturalTips}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Coluna lateral - Orçamento */}
              <div>
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold text-explorAI-darkBlue mb-4">Orçamento estimado</h2>
                  
                  <div className="bg-explorAI-lightBlue rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-explorAI-darkGray">Valor aproximado por pessoa</p>
                      <p className="text-2xl font-bold text-explorAI-blue mt-1">
                        R$ {price.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-explorAI-darkGray mt-1">
                        Para uma viagem de 7 dias
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <Hotel className="h-5 w-5 text-explorAI-blue mr-2" />
                        <span className="text-explorAI-darkGray">Hospedagem</span>
                      </div>
                      <span className="font-medium">R$ {estimatedBudget.hospedagem.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 text-explorAI-amber mr-2" />
                        <span className="text-explorAI-darkGray">Alimentação</span>
                      </div>
                      <span className="font-medium">R$ {estimatedBudget.alimentacao.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <Ticket className="h-5 w-5 text-explorAI-green mr-2" />
                        <span className="text-explorAI-darkGray">Passeios</span>
                      </div>
                      <span className="font-medium">R$ {estimatedBudget.passeios.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-explorAI-darkGray">Transporte local</span>
                      </div>
                      <span className="font-medium">R$ {estimatedBudget.transporte.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6">
                    Ver ofertas para este destino
                  </Button>
                </div>
                
                <div className="bg-gradient-travel text-white rounded-xl p-6">
                  <h3 className="font-bold mb-3">Precisa de ajuda para planejar?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Converse com nosso assistente virtual para obter ajuda personalizada na 
                    organização da sua viagem para {destination.name}.
                  </p>
                  <Button 
                    className="w-full bg-white text-explorAI-blue border-2 border-white hover:bg-white/90 hover:text-explorAI-blue font-medium"
                    onClick={() => navigate('/')}
                  >
                    Falar com assistente
                  </Button>
                </div>
              </div>
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

export default DestinationDetail;
