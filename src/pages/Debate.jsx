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
          <Group spacing="xs">
            <Loader size="xs" />
            <Text size="sm">Thinking...</Text>
          </Group>
        </Paper>
      )}
    </Stack>
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

  useEffect(() => {
    // Check if API keys are configured
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    setApiConfigured(!!openaiKey || !!anthropicKey);
    
    // Set default provider based on available API keys
    if (!openaiKey && anthropicKey) {
      setProvider('anthropic');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!topic) {
      setError('Please enter a debate topic')
      return
    }

    if (!apiConfigured) {
      setError('No API keys configured. Please add your API keys to the .env file.')
      return
    }

    setIsLoading(true)
    setError('')
    setDebate({ forResponses: [], againstResponses: [] })

    try {
      const [forResponse, againstResponse] = await Promise.all([
        generateResponse(topic, 'for', provider),
        generateResponse(topic, 'against', provider)
      ]);

      setDebate({
        forResponses: [forResponse],
        againstResponses: [againstResponse]
      });
    } catch (err) {
      setError(err.message || 'Failed to generate debate responses. Please check your API configuration and try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
            />
          )}

          {inputType === 'file' && (
            <Dropzone onDrop={(files) => console.log('dropped files', files)}>
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
            />
          </Group>

          <Button 
            onClick={handleSubmit} 
            size="lg"
            loading={isLoading}
            disabled={isLoading || !apiConfigured}
          >
            Start Debate
          </Button>
        </Stack>
      </Paper>

      {debate && (
        <Grid gutter={32}>
          <Grid.Col span={6}>
            <DebateAgent 
              color="blue" 
              side="left"
              responses={debate.forResponses}
              isTyping={isLoading}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DebateAgent 
              color="red" 
              side="right"
              responses={debate.againstResponses}
              isTyping={isLoading}
            />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  )
}
