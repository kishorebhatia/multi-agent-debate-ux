import React, { useState, useEffect } from 'react'
import { 
  Stack,
  Title,
  TextInput,
  Select,
  Button,
  Paper,
  Textarea,
  Group,
  Text,
  Loader,
  Alert,
  Grid,
  Avatar,
  Box
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { IconUpload, IconAlertCircle, IconRobot } from '@tabler/icons-react'
import { generateResponse } from '../services/llmService'

const DebateAgent = ({ color, side, responses = [], isTyping }) => (
  <Stack align={side === 'left' ? 'flex-start' : 'flex-end'} spacing="md">
    <Group position={side === 'left' ? 'left' : 'right'} spacing="xs">
      {side === 'right' && <Text size="sm" weight={500}>Agent Red</Text>}
      <Avatar 
        color={color} 
        radius="xl"
      >
        <IconRobot size={24} />
      </Avatar>
      {side === 'left' && <Text size="sm" weight={500}>Agent Blue</Text>}
    </Group>
    
    <Stack spacing="xs" style={{ width: '100%' }}>
      {responses.map((response, index) => (
        <Paper 
          key={index}
          p="md" 
          style={{
            backgroundColor: color === 'blue' ? '#e7f5ff' : '#fff5f5',
            maxWidth: '90%',
            marginLeft: side === 'left' ? 0 : 'auto',
            marginRight: side === 'right' ? 0 : 'auto'
          }}
        >
          <Text>{response}</Text>
        </Paper>
      ))}
    </Stack>
    {isTyping && (
      <Paper 
        p="md" 
        style={{
          backgroundColor: color === 'blue' ? '#e7f5ff' : '#fff5f5',
          maxWidth: '90%',
          marginLeft: side === 'left' ? 0 : 'auto',
          marginRight: side === 'right' ? 0 : 'auto'
        }}
      >
        <Group spacing="xs" align="center">
          <Loader size="sm" color={color === 'blue' ? 'blue' : 'red'} />
          <Text size="sm" color="dimmed">
            {`${color === 'blue' ? 'Blue' : 'Red'} Agent is thinking...`}
          </Text>
        </Group>
      </Paper>
    )}
  </Stack>
)

export default function Debate() {
  const [topic, setTopic] = useState('')
  const [inputType, setInputType] = useState('text')
  const [debateStyle, setDebateStyle] = useState('formal')
  const [provider, setProvider] = useState('openai')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [debate, setDebate] = useState(null)
  const [apiConfigured, setApiConfigured] = useState(false)
  const [isDebating, setIsDebating] = useState(false)
  const [currentAgent, setCurrentAgent] = useState(null)
  const [waitingForNext, setWaitingForNext] = useState(false)

  useEffect(() => {
    // Check if API keys are configured
    const hasOpenAI = import.meta.env.VITE_HAS_OPENAI_KEY === 'true';
    const hasAnthropic = import.meta.env.VITE_HAS_ANTHROPIC_KEY === 'true';
    setApiConfigured(hasOpenAI || hasAnthropic);
    
    // Set default provider based on available API keys
    if (!hasOpenAI && hasAnthropic) {
      setProvider('anthropic');
    }
  }, []);

  const generateDebatePrompt = (side, previousResponses) => {
    const allResponses = previousResponses.map((response, index) => 
      `${index % 2 === 0 ? 'Proponent' : 'Opponent'}: ${response}`
    ).join('\n');
    
    const context = previousResponses.length > 0 
      ? `\nDebate history:\n${allResponses}\n\nNow it's your turn to ${side === 'for' ? 'support' : 'oppose'} the topic.`
      : '';
    
    return `You are participating in a ${debateStyle} debate on the topic: "${topic}".
    
Your role: You are the ${side === 'for' ? 'Proponent (supporting)' : 'Opponent (opposing)'} in this debate.
Your task: ${side === 'for' 
  ? 'Present compelling arguments in favor of the topic and address any counter-arguments raised.' 
  : 'Challenge the proponent\'s position with strong counter-arguments and present opposing viewpoints.'}

Debate style: ${debateStyle === 'formal' 
  ? 'Maintain a formal, academic tone with structured arguments and evidence.' 
  : debateStyle === 'casual' 
    ? 'Keep a conversational, accessible tone while still making clear points.' 
    : 'Use the Socratic method to question assumptions and explore deeper implications.'}

Guidelines:
- Directly address previous arguments when applicable
- Be concise but thorough
- Support your points with reasoning
- Maintain a respectful tone
- Stay focused on the topic${context}

Your response:`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!topic) {
      setError('Please enter a debate topic');
      return;
    }

    if (!apiConfigured) {
      setError('No API keys configured. Please add your API keys to the .env file.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setDebate({ forResponses: [], againstResponses: [] });
      setIsDebating(true);
      setCurrentAgent('for');

      // Start with the proponent (for) side
      console.log('Starting debate with Blue agent (for)');
      const initialResponse = await generateResponse(
        generateDebatePrompt('for', []),
        'for',
        provider
      );

      setDebate({
        forResponses: [initialResponse],
        againstResponses: []
      });

      // Now get the Red agent's response
      setCurrentAgent('against');
      setIsLoading(true);
      console.log('Getting Red agent (against) response');
      
      const againstResponse = await generateResponse(
        generateDebatePrompt('against', [initialResponse]),
        'against',
        provider
      );

      setDebate(prev => ({
        forResponses: prev.forResponses,
        againstResponses: [againstResponse]
      }));

      // Continue the debate
      setIsLoading(false);
      continueDebate('for'); // Start next round with Blue agent
    } catch (err) {
      console.error('Failed to start debate:', err);
      setError(err.message || 'Failed to generate debate responses. Please check your API configuration and try again.');
      stopDebate();
    }
  };

  const continueDebate = async (currentSide) => {
    if (!isDebating) return;

    try {
      setCurrentAgent(currentSide);
      setIsLoading(true);

      // Combine responses in chronological order
      const allResponses = [];
      const maxResponses = Math.max(
        debate?.forResponses?.length || 0,
        debate?.againstResponses?.length || 0
      );
      
      for (let i = 0; i < maxResponses; i++) {
        if (debate?.forResponses[i]) allResponses.push(debate.forResponses[i]);
        if (debate?.againstResponses[i]) allResponses.push(debate.againstResponses[i]);
      }

      console.log(`Generating response for ${currentSide} agent with ${allResponses.length} previous responses`);

      const response = await generateResponse(
        generateDebatePrompt(currentSide, allResponses),
        currentSide,
        provider
      );

      // Update debate state with new response
      setDebate(prev => {
        const newState = {
          forResponses: [...prev.forResponses],
          againstResponses: [...prev.againstResponses]
        };

        if (currentSide === 'for') {
          newState.forResponses.push(response);
        } else {
          newState.againstResponses.push(response);
        }

        return newState;
      });

      // Only continue if we're still debating
      if (isDebating) {
        setIsLoading(false);
        const nextSide = currentSide === 'for' ? 'against' : 'for';
        // Add a small delay to allow state updates and UI to reflect changes
        setTimeout(() => {
          if (isDebating) {
            continueDebate(nextSide);
          }
        }, 500); // Increased delay for better visibility
      }
    } catch (err) {
      console.error('Debate continuation error:', err);
      setError(`Error during debate: ${err.message}`);
      stopDebate();
    }
  };

  const stopDebate = () => {
    console.log('Stopping debate...');
    setIsDebating(false);
    setCurrentAgent(null);
    setIsLoading(false);
  };

  return (
    <Stack spacing="lg">
      <Title order={2}>AI Debate Arena</Title>
      
      {!apiConfigured && (
        <Alert icon={<IconAlertCircle size={16} />} color="yellow">
          No API keys configured. Please add your API keys to the .env file.
        </Alert>
      )}
      
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      )}
      
      <Paper p="md" withBorder>
        <Stack>
          <Select
            label="Input Type"
            value={inputType}
            onChange={setInputType}
            data={[
              { value: 'text', label: 'Text' },
              { value: 'file', label: 'File Upload' },
              { value: 'link', label: 'Link' }
            ]}
          />

          {inputType === 'text' && (
            <Textarea
              label="Debate Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              minRows={4}
              placeholder="Enter your debate topic or question..."
              disabled={isDebating}
            />
          )}

          {inputType === 'file' && (
            <Dropzone onDrop={(files) => console.log('dropped files', files)} disabled={isDebating}>
              <Group position="center" spacing="xl">
                <IconUpload size={50} />
                <div>
                  <Text size="xl">Drop files here or click to select</Text>
                  <Text size="sm" color="dimmed">Upload a document with your debate topic</Text>
                </div>
              </Group>
            </Dropzone>
          )}

          {inputType === 'link' && (
            <TextInput
              label="URL"
              placeholder="Enter URL containing debate topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isDebating}
            />
          )}

          <Group grow>
            <Select
              label="LLM Provider"
              value={provider}
              onChange={setProvider}
              data={[
                { value: 'openai', label: 'OpenAI GPT-4' },
                { value: 'anthropic', label: 'Anthropic Claude' }
              ]}
              disabled={isDebating}
            />

            <Select
              label="Debate Style"
              value={debateStyle}
              onChange={setDebateStyle}
              data={[
                { value: 'formal', label: 'Formal' },
                { value: 'casual', label: 'Casual' },
                { value: 'socratic', label: 'Socratic' }
              ]}
              disabled={isDebating}
            />
          </Group>

          <Group position="apart">
            <Button 
              onClick={handleSubmit} 
              size="lg"
              loading={isLoading && !isDebating}
              disabled={isLoading || !apiConfigured || isDebating}
            >
              Start Debate
            </Button>

            {isDebating && (
              <Button 
                onClick={stopDebate}
                size="lg"
                color="red"
                variant="outline"
              >
                Stop Debate
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>

      {debate && (
        <Grid gutter={32}>
          <Grid.Col span={6}>
            <DebateAgent 
              color="blue" 
              side="left"
              responses={debate.forResponses}
              isTyping={isLoading && currentAgent === 'for'}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DebateAgent 
              color="red" 
              side="right"
              responses={debate.againstResponses}
              isTyping={isLoading && currentAgent === 'against'}
            />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  )
}
