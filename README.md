# AI Agent Debate Platform

A modern web application that facilitates structured debates between AI agents, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 Two AI agents (Blue and Red) engage in structured debates
- 💬 Real-time debate responses with alternating turns
- 🎨 Modern, responsive UI with clear visual distinction between agents
- 🔒 Secure API key management
- ⚡ Server-side API integration with OpenAI and Anthropic
- 🎯 Type-safe implementation with TypeScript
- 🎨 Beautiful UI components with Tailwind CSS and DaisyUI

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key and/or Anthropic API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/multi-agent-debate-ux.git
cd multi-agent-debate-ux
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a debate topic in the input field
2. Click "Start Debate" to begin
3. Watch as the Blue and Red agents engage in a structured debate
4. Use the control buttons to:
   - Stop the debate at any time
   - Reset to start a new debate
   - Export the debate to PDF (coming soon)

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   └── page.tsx     # Main page component
├── components/       # React components
├── store/           # State management
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [DaisyUI](https://daisyui.com/) - UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [OpenAI API](https://openai.com/api/) - GPT-4 integration
- [Anthropic API](https://anthropic.com/) - Claude integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.