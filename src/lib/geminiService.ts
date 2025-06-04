
// Gemini API service with hidden key management
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export const callGeminiAPI = async (
  prompt: string,
  systemPrompt?: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key não configurada. Configure VITE_GEMINI_API_KEY nas variáveis de ambiente.');
  }

  try {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Resposta inválida da API do Gemini');
    }
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    throw error;
  }
};
