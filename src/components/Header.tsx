
import React from 'react';
import { Compass, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const handleExplore = () => {
    // First navigate to home page if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const preferencesSection = document.querySelector('.bg-explorAI-gray');
        if (preferencesSection) {
          preferencesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const preferencesSection = document.querySelector('.bg-explorAI-gray');
      if (preferencesSection) {
        preferencesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHowItWorks = () => {
    // First navigate to home page if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Already on home page, just scroll
      document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDestinations = () => {
    // First navigate to home page if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Already on home page, just scroll
      document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0 cursor-pointer" onClick={() => navigate('/')}>
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
          <button 
            onClick={handleHowItWorks}
            className="text-sm text-explorAI-darkGray hover:text-explorAI-blue transition-colors px-3 py-1 hover:bg-explorAI-lightBlue rounded-md"
          >
            Como Funciona
          </button>
          <button 
            onClick={handleDestinations}
            className="text-sm text-explorAI-darkGray hover:text-explorAI-blue transition-colors px-3 py-1 hover:bg-explorAI-lightBlue rounded-md"
          >
            Destinos
          </button>
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
