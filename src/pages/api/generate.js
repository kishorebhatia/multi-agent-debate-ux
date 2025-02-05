import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Anthropic client
const anthropicClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

      const response = await anthropicClient.post('/messages', {
        model: "claude-2",
        max_tokens_to_sample: 500,
        messages: [{ role: "user", content: prompt }]
      });
      content = response.data.content[0].text;
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error('LLM API Error:', error);
    return res.status(500).json({ 
      error: error.response?.data?.error || error.message || 'Failed to generate response' 
    });
  }
} 