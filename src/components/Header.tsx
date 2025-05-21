
import React from 'react';
import { Compass, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const handleExplore = () => {
    // Scroll to recommendations section
    document.getElementById('recomendacoes')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Compass className="h-8 w-8 text-explorAI-blue mr-3" strokeWidth={2.5} />
          <div>
            <h1 className="text-2xl font-bold">
              <span className="gradient-text">Explor</span>
              <span className="text-explorAI-darkBlue">AI</span>
            </h1>
            <p className="text-sm text-explorAI-darkGray">Recomendações de viagem personalizadas</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a href="#como-funciona" className="text-sm text-explorAI-darkGray hover:text-explorAI-blue transition-colors px-3 py-1">
            Como Funciona
          </a>
          <a href="#destinos" className="text-sm text-explorAI-darkGray hover:text-explorAI-blue transition-colors px-3 py-1">
            Destinos
          </a>
          <button 
            onClick={handleExplore} 
            className="flex items-center space-x-1 bg-explorAI-blue text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm"
          >
            <Map className="h-4 w-4" />
            <span>Explorar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
