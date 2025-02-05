import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Anthropic client
const anthropicClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'x-api-key': process.env.ANTHROPIC_API_KEY
  }
});

// Retry logic for API calls
const retryWithExponentialBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      // Check if we should retry
      const isOverloaded = error.response?.data?.error?.type === 'overloaded_error';
      const shouldRetry = (isOverloaded || error.response?.status === 429) && retries < maxRetries;
      
      if (!shouldRetry) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(`Retrying after ${delay}ms (attempt ${retries} of ${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// API Routes
app.post('/api/generate', async (req, res) => {
  const { prompt, side, provider } = req.body;

  if (!prompt || !side || !provider) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    let content;

    if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });
      content = response.choices[0].message.content;
    } else if (provider === 'anthropic') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'Anthropic API key not configured' });
      }

      const response = await retryWithExponentialBackoff(async () => {
        const result = await anthropicClient.post('/messages', {
          model: "claude-2",
          messages: [{
            role: "user",
            content: prompt
          }],
          max_tokens: 1024,
          temperature: 0.7
        });
        return result;
      });
      
      if (response.data && response.data.content) {
        content = response.data.content;
      } else {
        throw new Error('Invalid response format from Anthropic API');
      }
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error('LLM API Error:', error.response?.data || error);
    
    // Enhanced error messages for specific cases
    if (error.response?.data?.error?.type === 'overloaded_error') {
      return res.status(503).json({ 
        error: 'Anthropic API is currently overloaded. Please try again in a few moments.',
        retryAfter: 5000 // Suggest retry after 5 seconds
      });
    }
    
    return res.status(500).json({ 
      error: error.response?.data?.error?.message || error.message || 'Failed to generate response',
      type: error.response?.data?.error?.type || 'unknown'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 