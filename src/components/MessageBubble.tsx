'use client'

export default function MessageBubble({ message }) {
  const getMessageStyle = () => {
    if (message.type === 'info') {
      return 'bg-info/10 text-info'
    }
    return message.agent === 'Blue Agent' 
      ? 'bg-primary/10 text-primary'
      : 'bg-secondary/10 text-secondary'
  }

  return (
    <div className={`message-bubble rounded-lg p-4 ${getMessageStyle()}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{message.agent}</span>
        <span className="text-xs opacity-60">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  )
}
