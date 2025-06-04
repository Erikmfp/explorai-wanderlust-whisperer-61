
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, CornerDownLeft } from 'lucide-react';
import { ChatMessage, generateAIResponse, UserPreferences } from '@/lib/aiService';
import { v4 as uuidv4 } from 'uuid';

interface ChatInterfaceProps {
  preferences: UserPreferences;
  onNewRecommendationRequest: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ preferences, onNewRecommendationRequest }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: 'ai',
      content: 'Olá! Sou o ExplorAI, seu assistente de viagens personalizadas. Como posso ajudar você a encontrar seu próximo destino?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll para o final da conversa quando novas mensagens são adicionadas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (newMessage.trim() === '') return;

    // Adiciona a mensagem do usuário
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Se a mensagem mencionar recomendações ou destinos, notifica o componente pai
    if (
      newMessage.toLowerCase().includes('recomen') || 
      newMessage.toLowerCase().includes('sugest') || 
      newMessage.toLowerCase().includes('destin') || 
      newMessage.toLowerCase().includes('lugar') ||
      newMessage.toLowerCase().includes('viajar para') ||
      newMessage.toLowerCase().includes('o que me sugere')
    ) {
      onNewRecommendationRequest();
    }

    try {
      // Gera resposta da IA usando Gemini
      const aiContent = await generateAIResponse([...messages, userMessage], preferences);
      
      // Adiciona resposta da IA
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'ai',
        content: aiContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      
      // Mensagem de erro como resposta da IA
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'ai',
        content: 'Desculpe, estou enfrentando dificuldades técnicas no momento. Verifique se a API do Gemini está configurada nas variáveis de ambiente.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  // Sugestões rápidas para ajudar o usuário a iniciar a conversa
  const quickSuggestions = [
    "O que você me sugere?",
    "Você consegue ver minhas preferências?",
    "Quero destinos com praia e cultura",
    "Sugira um lugar para relaxar"
  ];

  return (
    <div className="flex flex-col h-[600px] bg-explorAI-gray rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-explorAI-blue text-white p-4">
        <div>
          <h2 className="font-semibold">Chat com ExplorAI</h2>
          <p className="text-sm text-blue-100">Converse comigo para descobrir seu próximo destino</p>
        </div>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-explorAI-lightBlue scroll-smooth"
      >
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
          >
            {message.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-bubble-ai">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-explorAI-blue animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-explorAI-blue animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-explorAI-blue animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm text-explorAI-darkGray">ExplorAI está pensando...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length === 1 && (
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <p className="text-sm text-explorAI-darkGray mb-2">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="text-xs bg-explorAI-lightBlue text-explorAI-blue px-3 py-2 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => {
                  setNewMessage(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            disabled={isLoading || newMessage.trim() === ''}
            size="icon"
            className="bg-explorAI-blue hover:bg-blue-600 h-[60px] w-[60px] rounded-lg flex-shrink-0"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-explorAI-darkGray">
          <div className="flex items-center">
            <CornerDownLeft className="h-3 w-3 mr-1" />
            <span>Pressione Enter para enviar</span>
          </div>
          <span className="text-explorAI-blue font-medium">Powered by Gemini AI</span>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
