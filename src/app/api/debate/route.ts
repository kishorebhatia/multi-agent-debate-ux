import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const { prompt, role, provider, apiKey } = await request.json()

    if (!prompt || !role || !provider || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    let response = ''

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey })
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ${role} in a formal debate. Provide clear, logical arguments based on facts and evidence. Keep responses concise and focused.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
      response = completion.choices[0]?.message?.content || ''
    } else if (provider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey })
      const completion = await anthropic.messages.create({
        model: 'claude-2',
        max_tokens: 500,
        system: `You are ${role} in a formal debate. Provide clear, logical arguments based on facts and evidence. Keep responses concise and focused.`,
        messages: [{ role: 'user', content: prompt }]
      })
      response = completion.content[0].text
    }

    return NextResponse.json({ response })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
