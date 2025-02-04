export class BaseAgent {
  constructor(
    private name: string,
    private role: string,
    private context: any[] = []
  ) {}

  async processInput(input: string): Promise<string> {
    // Implement agent processing logic
    return ''
  }

  async generateResponse(topic: string, context: any[]): Promise<string> {
    // Implement response generation
    return ''
  }
}
