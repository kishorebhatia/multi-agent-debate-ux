'use client'

export default function ApiConfig({ config, onConfigChange }) {
  return (
    <div className="space-y-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">LLM Provider</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={config.provider}
          onChange={(e) => onConfigChange({ ...config, provider: e.target.value })}
        >
          <option value="openai">OpenAI (GPT-4)</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">API Key</span>
          <span className="label-text-alt text-gray-500">Required</span>
        </label>
        <input 
          type="password"
          className="input input-bordered w-full"
          value={config.apiKey}
          onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
          placeholder="Enter your API key"
        />
      </div>
    </div>
  )
}
