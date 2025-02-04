import DebateArena from '../components/DebateArena'

export default function Home() {
  return (
    <main className="min-h-screen debate-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AI Agent Debate Platform
        </h1>
        <DebateArena />
      </div>
    </main>
  )
}
