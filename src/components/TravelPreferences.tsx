import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPreferences } from '@/lib/aiService';
import { Compass, Calendar, Sun, Clock, SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface TravelPreferencesProps {
  onPreferencesChange: (preferences: UserPreferences) => void;
}

const TravelPreferences: React.FC<TravelPreferencesProps> = ({ onPreferencesChange }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    preferredActivities: [],
    travelStyle: 'equilibrado',
    budget: 'moderado',
    budgetValue: 5000,
    duration: '7-10 dias',
    season: 'qualquer',
  });

  const handleInterestChange = (interest: string) => {
    setPreferences((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      
      const updatedPreferences = {
        ...prev,
        interests: newInterests
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  const handleActivityChange = (activity: string) => {
    setPreferences((prev) => {
      const newActivities = prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity];
      
      const updatedPreferences = {
        ...prev,
        preferredActivities: newActivities
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  const handleStyleChange = (style: string) => {
    setPreferences((prev) => {
      const updatedPreferences = {
        ...prev,
        travelStyle: style
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  const handleBudgetSliderChange = (value: number[]) => {
    setPreferences((prev) => {
      const updatedPreferences = {
        ...prev,
        budgetValue: value[0],
        budget: getBudgetCategory(value[0])
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  const handleDurationChange = (duration: string) => {
    setPreferences((prev) => {
      const updatedPreferences = {
        ...prev,
        duration
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  const handleSeasonChange = (season: string) => {
    setPreferences((prev) => {
      const updatedPreferences = {
        ...prev,
        season
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  // Helper function to format budget values
  const formatBudgetValue = (value: number) => {
    if (value >= 100000) return "R$ 100.000+";
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  // Helper function to categorize budget
  const getBudgetCategory = (value: number): string => {
    if (value < 2000) return 'econômico';
    if (value < 5000) return 'moderado';
    if (value < 15000) return 'confortável';
    if (value < 50000) return 'luxo';
    return 'ultra luxo';
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('/lovable-uploads/cb5dce73-f661-4286-b593-3686604f6d11.png')`
      }}
    >
      <div className="flex items-center mb-4">
        <Compass className="h-5 w-5 text-explorAI-blue mr-2" />
        <h2 className="text-lg font-semibold text-explorAI-darkBlue">Minhas preferências de viagem</h2>
      </div>
      
      <Tabs defaultValue="interesses">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="interesses">Interesses</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="estilo">Estilo</TabsTrigger>
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
          <TabsTrigger value="duracao">Duração</TabsTrigger>
          <TabsTrigger value="temporada">Temporada</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interesses" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Cultura', 'Natureza', 'Gastronomia', 'História', 'Praia', 'Aventura', 'Arquitetura', 'Relaxamento'].map(interest => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox 
                  id={`interest-${interest}`} 
                  checked={preferences.interests.includes(interest.toLowerCase())}
                  onCheckedChange={() => handleInterestChange(interest.toLowerCase())}
                />
                <Label htmlFor={`interest-${interest}`} className="cursor-pointer">{interest}</Label>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="atividades" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Explorar cultura local', 
              'Aventuras ao ar livre', 
              'Relaxar em paisagens naturais',
              'Experimentar gastronomia',
              'Apreciar a natureza',
              'Atividades radicais',
              'Festivais e eventos',
              'Tours históricos',
              'Visitas a museus e galerias',
              'Mergulho e snorkeling',
              'Trilhas e caminhadas',
              'Passeios de bicicleta',
              'Vida noturna',
              'Compras'
            ].map(activity => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox 
                  id={`activity-${activity}`} 
                  checked={preferences.preferredActivities.includes(activity.toLowerCase())}
                  onCheckedChange={() => handleActivityChange(activity.toLowerCase())}
                />
                <Label htmlFor={`activity-${activity}`} className="cursor-pointer">{activity}</Label>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="estilo" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Aventureiro', 'Equilibrado', 'Cultural', 'Relaxado'].map(style => (
              <Button 
                key={style}
                variant={preferences.travelStyle === style.toLowerCase() ? "default" : "outline"}
                onClick={() => handleStyleChange(style.toLowerCase())}
                className="h-auto py-3"
              >
                {style}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="orcamento" className="space-y-6">
          <div className="px-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-explorAI-darkGray">Orçamento por pessoa:</span>
              <span className="text-sm font-medium text-explorAI-blue">
                {formatBudgetValue(preferences.budgetValue)}
              </span>
            </div>
            
            <Slider 
              defaultValue={[5000]}
              min={500}
              max={100000}
              step={500}
              value={[preferences.budgetValue]}
              onValueChange={handleBudgetSliderChange}
              className="mt-6"
            />
            
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>R$ 500</span>
              <span>R$ 100.000+</span>
            </div>
          </div>
          
          <div className="p-3 bg-explorAI-lightBlue rounded-lg">
            <p className="text-sm text-explorAI-darkBlue font-medium">
              Categoria: <span className="text-explorAI-blue">{getBudgetCategory(preferences.budgetValue).charAt(0).toUpperCase() + getBudgetCategory(preferences.budgetValue).slice(1)}</span>
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="duracao" className="space-y-4">
          <div className="flex items-center mb-4">
            <Clock className="h-4 w-4 text-explorAI-blue mr-2" />
            <p className="text-sm font-medium text-explorAI-darkBlue">Quantos dias você planeja viajar?</p>
          </div>
          
          <RadioGroup 
            value={preferences.duration}
            onValueChange={handleDurationChange}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {[
              { label: "Final de semana (2-3 dias)", value: "2-3 dias" },
              { label: "Semana curta (4-6 dias)", value: "4-6 dias" },
              { label: "Uma semana (7-10 dias)", value: "7-10 dias" },
              { label: "Duas semanas (11-15 dias)", value: "11-15 dias" },
              { label: "Viagem longa (15+ dias)", value: "15+ dias" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem id={option.value} value={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="temporada" className="space-y-4">
          <div className="flex items-center mb-4">
            <Sun className="h-4 w-4 text-explorAI-amber mr-2" />
            <p className="text-sm font-medium text-explorAI-darkBlue">Em qual estação você prefere viajar?</p>
          </div>
          
          <RadioGroup 
            value={preferences.season}
            onValueChange={handleSeasonChange}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { label: "Verão (Dezembro a Março)", value: "verao" },
              { label: "Outono (Março a Junho)", value: "outono" },
              { label: "Inverno (Junho a Setembro)", value: "inverno" },
              { label: "Primavera (Setembro a Dezembro)", value: "primavera" },
              { label: "Qualquer época do ano", value: "qualquer" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem id={option.value} value={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPreferences;
