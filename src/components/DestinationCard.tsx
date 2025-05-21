
import React from 'react';
import { Destination } from '@/data/destinations';
import { Star, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface DestinationCardProps {
  destination: Destination & { matchScore?: number };
  budgetValue?: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, budgetValue }) => {
  const navigate = useNavigate();
  
  const getBudgetLabel = (cost: string): string => {
    const labels: Record<string, string> = {
      'low': 'Econômico',
      'medium': 'Moderado',
      'high': 'Caro',
      'very high': 'Muito caro'
    };
    return labels[cost] || cost;
  };

  const getBestSeasonText = (months: string[]): string => {
    if (months.length === 0) return 'Ano todo';
    if (months.length > 3) {
      const firstMonth = months[0].charAt(0).toUpperCase() + months[0].slice(1);
      const lastMonth = months[months.length - 1].charAt(0).toUpperCase() + months[months.length - 1].slice(1);
      return `${firstMonth} - ${lastMonth}`;
    }
    return months.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ');
  };

  const renderMatchIndicator = () => {
    if (destination.matchScore === undefined) return null;
    
    let matchClass = 'bg-gray-200 text-gray-700';
    let matchText = 'Compatibilidade baixa';
    
    if (destination.matchScore > 10) {
      matchClass = 'bg-green-100 text-green-800';
      matchText = 'Combinação perfeita';
    } else if (destination.matchScore > 6) {
      matchClass = 'bg-blue-100 text-blue-800';
      matchText = 'Ótima escolha';
    } else if (destination.matchScore > 3) {
      matchClass = 'bg-amber-100 text-amber-800';
      matchText = 'Boa opção';
    }
    
    return (
      <div className={`absolute top-3 right-3 ${matchClass} rounded-full px-2 py-1 text-xs font-medium`}>
        {matchText}
      </div>
    );
  };

  // Gerador de preço aproximado baseado no custo médio e no orçamento do usuário
  const getApproximatePrice = (): string => {
    let basePrice = 0;
    
    switch (destination.averageCost) {
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
    const finalPrice = Math.round(basePrice * (1 + variation));
    
    return `R$ ${finalPrice.toLocaleString('pt-BR')}`;
  };

  const handleCardClick = () => {
    navigate(`/destino/${destination.id}`, { 
      state: { 
        destination, 
        budgetValue 
      } 
    });
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 relative animate-slide-in cursor-pointer"
      onClick={handleCardClick}
    >
      {renderMatchIndicator()}
      
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={`${destination.imageUrl}?auto=format&fit=crop&w=600&h=350`}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-explorAI-darkBlue">{destination.name}</h3>
            <div className="flex items-center text-explorAI-darkGray">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-sm">{destination.country}</span>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-explorAI-lightBlue border-0 text-explorAI-blue">
            {getBudgetLabel(destination.averageCost)}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">{destination.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {destination.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-explorAI-darkGray">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span>{(
              Object.values(destination.ratings).reduce((a, b) => a + b, 0) / 
              Object.values(destination.ratings).length
            ).toFixed(1)}</span>
          </div>
          
          <div className="flex items-center text-explorAI-darkGray">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="text-xs">{getBestSeasonText(destination.bestTimeToVisit)}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
          <div className="text-right">
            <div className="text-xs text-explorAI-darkGray">Valor aproximado p/ pessoa</div>
            <div className="text-explorAI-blue font-medium">{getApproximatePrice()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
