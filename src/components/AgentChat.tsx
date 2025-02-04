'use client'

import { useEffect, useState } from 'react'
import { useAgentStore } from '../store/agentStore'
import MessageBubble from './MessageBubble'
import { LLMClient } from '../lib/api/llmClient'

export default function AgentChat({ topic, documents, isDebating, apiConfig }) {
  const messages = useAgentStore(state => state.messages)
  const addMessage = useAgentStore(state => state.addMessage)
  const [llmClient, setLlmClient] = useState<LLMClient | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Separate messages by agent
  const blueMessages = messages.filter(m => 
    m.agent === 'Blue Agent' || 
    (m.agent === 'system' && m.type === 'info')
  )
  const redMessages = messages.filter(m => m.agent === 'Red Agent')

  // ... rest of your existing useEffect and debate logic ...

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Blue Agent Window */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="badge badge-primary badge-lg">Blue Agent</div>
          {isProcessing && <span className="loading loading-dots loading-sm"></span>}
        </div>
        <div className="agent-window blue-window">
          {blueMessages.map((message, i) => (
            <div key={i} className="mb-4">
              <MessageBubble message={message} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Red Agent Window */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-end">
          <div className="badge badge-secondary badge-lg">Red Agent</div>
          {isProcessing && <span className="loading loading-dots loading-sm"></span>}
        </div>
        <div className="agent-window red-window">
          {redMessages.map((message, i) => (
            <div key={i} className="mb-4">
              <MessageBubble message={message} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
