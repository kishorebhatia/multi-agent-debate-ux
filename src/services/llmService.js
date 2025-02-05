import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client only if API key is available
const openai = import.meta.env.VITE_OPENAI_API_KEY ? 
  new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  }) : null;

// Initialize Anthropic client only if API key is available
const anthropicClient = import.meta.env.VITE_ANTHROPIC_API_KEY ? 
  axios.create({
    baseURL: 'https://api.anthropic.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
    }
  }) : null;

export const generateResponse = async (topic, side, provider) => {
  if (provider === 'openai' && !openai) {
    throw new Error('OpenAI API key not configured');
  }
  if (provider === 'anthropic' && !anthropicClient) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = `You are an AI debater taking the ${side} position on the following topic: "${topic}". 
    Provide a clear, logical argument supporting your position. Be persuasive but factual.
    Focus on the strongest points that support your ${side} stance.`;

  try {
    if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });
      return response.choices[0].message.content;
    } else if (provider === 'anthropic') {
      const response = await anthropicClient.post('/messages', {
        model: "claude-2",
        max_tokens_to_sample: 500,
        messages: [{ role: "user", content: prompt }]
      });
      return response.data.content[0].text;
    }
  } catch (error) {
    console.error('LLM API Error:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
}
