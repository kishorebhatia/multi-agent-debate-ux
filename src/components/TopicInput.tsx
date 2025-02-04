'use client'

export default function TopicInput({ onTopicSet }) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Debate Topic</span>
      </label>
      <textarea 
        className="textarea textarea-bordered h-24 w-full"
        placeholder="Enter a topic or paste a URL for the agents to debate..."
        onChange={(e) => onTopicSet(e.target.value)}
      />
    </div>
  )
}
