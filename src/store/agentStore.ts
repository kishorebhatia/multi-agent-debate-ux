import { create } from 'zustand'

interface Message {
  agent: string
  content: string
  timestamp: Date
  type: 'response' | 'info'
  color?: string
}

interface AgentState {
  messages: Message[]
  addMessage: (message: Omit<Message, 'timestamp'>) => void
  clearMessages: () => void
}

export const useAgentStore = create<AgentState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }],
    })),
  clearMessages: () => set({ messages: [] }),
}))
