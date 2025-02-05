import axios from 'axios';

const API_BASE_URL = '/api';

export const generateResponse = async (prompt, side, provider) => {
  try {
    console.log(`Sending request to ${provider} for ${side} side`);
    
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      prompt,
      side,
      provider
    });
    
    if (!response.data || !response.data.content) {
      throw new Error('Invalid response format from API');
    }
    
    console.log(`Received response from ${provider}`);
    return response.data.content;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle overloaded API case
    if (error.response?.data?.type === 'overloaded_error') {
      throw new Error('The AI service is currently busy. The system will automatically retry in a moment.');
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment before continuing.');
    }
    
    // Handle other API errors
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to generate response'
    );
  }
}
