'use client'

import { useState } from 'react'
import AgentChat from './AgentChat'
import FileUpload from './FileUpload'
import TopicInput from './TopicInput'
import ApiConfig from './ApiConfig'
import { useAgentStore } from '../store/agentStore'
import { savePDF } from '../utils/pdfExport'

export default function DebateArena() {
  const [topic, setTopic] = useState('')
  const [documents, setDocuments] = useState([])
  const [isDebating, setIsDebating] = useState(false)
  const [apiConfig, setApiConfig] = useState({
    provider: 'openai',
    apiKey: ''
  })
  const clearMessages = useAgentStore(state => state.clearMessages)
  const messages = useAgentStore(state => state.messages)

  const startDebate = () => {
    if (!topic || !apiConfig.apiKey) return
    setIsDebating(true)
  }

  const stopDebate = () => {
    setIsDebating(false)
  }

  const resetDebate = () => {
    setIsDebating(false)
    clearMessages()
    setTopic('')
  }

  const exportDebate = () => {
    if (messages.length > 0) {
      savePDF(messages, topic)
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Topic and Files */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Topic & Context</h2>
            <TopicInput onTopicSet={setTopic} />
            <div className="divider">Optional Context</div>
            <FileUpload onUpload={setDocuments} />
          </div>
        </div>

        {/* Right Column - API Config and Controls */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">API Configuration</h2>
            <ApiConfig config={apiConfig} onConfigChange={setApiConfig} />
            
            <div className="divider">Controls</div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                className={`btn btn-primary flex-1 ${(!topic || !apiConfig.apiKey) ? 'btn-disabled' : ''}`}
                onClick={startDebate}
                disabled={isDebating}
              >
                {isDebating ? 'Debate in Progress' : 'Start Debate'}
              </button>
              
              <button 
                className="btn btn-warning flex-1"
                onClick={stopDebate}
                disabled={!isDebating}
              >
                Stop Debate
              </button>
              
              <button 
                className="btn btn-error btn-outline flex-1"
                onClick={resetDebate}
              >
                Reset
              </button>
              
              <button 
                className="btn btn-info btn-outline flex-1"
                onClick={exportDebate}
                disabled={messages.length === 0}
              >
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debate Arena */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Debate Arena</h2>
          <AgentChat 
            topic={topic} 
            documents={documents} 
            isDebating={isDebating}
            apiConfig={apiConfig}
          />
        </div>
      </div>
    </div>
  )
}
