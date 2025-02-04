export class LLMClient {
  constructor(private config: { provider: string; apiKey: string }) {}

  async generateResponse(prompt: string, role: string): Promise<string> {
    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          role,
          provider: this.config.provider,
          apiKey: this.config.apiKey
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate response')
      }

      const data = await response.json()
      return data.response
    } catch (error: any) {
      throw new Error(`API Error: ${error.message}`)
    }
  }
}
