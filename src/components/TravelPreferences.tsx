
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPreferences } from '@/lib/aiService';
import { Compass } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TravelPreferencesProps {
  onPreferencesChange: (preferences: UserPreferences) => void;
}

const TravelPreferences: React.FC<TravelPreferencesProps> = ({ onPreferencesChange }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    preferredActivities: [],
    travelStyle: 'equilibrado',
    budget: 'moderado',
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

  const handleBudgetChange = (budget: string) => {
    setPreferences((prev) => {
      const updatedPreferences = {
        ...prev,
        budget
      };
      
      onPreferencesChange(updatedPreferences);
      return updatedPreferences;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Compass className="h-5 w-5 text-explorAI-blue mr-2" />
        <h2 className="text-lg font-semibold text-explorAI-darkBlue">Minhas preferências de viagem</h2>
      </div>
      
      <Tabs defaultValue="interesses">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="interesses">Interesses</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="estilo">Estilo</TabsTrigger>
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
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
              'Apreciar a natureza'
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
        
        <TabsContent value="orcamento" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Econômico', 'Moderado', 'Luxo'].map(budget => (
              <Button 
                key={budget}
                variant={preferences.budget === budget.toLowerCase() ? "default" : "outline"}
                onClick={() => handleBudgetChange(budget.toLowerCase())}
                className="h-auto py-3"
              >
                {budget}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPreferences;
