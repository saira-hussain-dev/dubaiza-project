
import { useState } from 'react'
import { CITIES } from '../data/listings.js'

const SCOPES = [
  { key: 'All', label: 'All', icon: '🔍' },
  { key: 'Motors', label: 'Motors', icon: '🚗' },
  { key: 'Property', label: 'Property', icon: '🏠' },
  { key: 'Jobs', label: 'Jobs', icon: '💼' },
  { key: 'Classifieds', label: 'Classifieds', icon: '🏷️' },
  { key: 'Community', label: 'Community', icon: '👥' },
]

export default function Hero({ onSearch }) {
  const [scope, setScope] = useState('All')
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('All Cities')
  const [showAi, setShowAi] = useState(false)
  const [aiText, setAiText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSearch({ scope, query, city })
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <h1>The Marketplace for <span>Everything</span></h1>
        <p>Buy, sell, and find anything from cars and homes to jobs and services.</p>
        <form className="search-card" onSubmit={submit}>
          <div className="search-tabs">
            <span className="search-label">SEARCHING IN:</span>
            {SCOPES.map((s) => (
              <button key={s.key} type="button" className={scope === s.key ? 'tab active' : 'tab'} onClick={() => setScope(s.key)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <div className="search-row">
            <div className="field">
              <span>🔍</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for anything..." />
            </div>
            <div className="field">
              <span>📍</span>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn-red search-btn" type="submit">Search</button>
          </div>
          <div className="ai-strip">
            <span>Not sure what you want? Let AI help.</span>
            <button type="button" className="ai-link" onClick={() => setShowAi(!showAi)}>Ask AI Assistant →</button>
          </div>
          {showAi && (
            <div className="ai-box">
              <input value={aiText} onChange={(e) => setAiText(e.target.value)} placeholder="Ask AI Assistant — Describe what you need..." />
              <button type="button" className="btn-red" onClick={() => { if (aiText.trim()) { setQuery(aiText); onSearch({ scope, query: aiText, city }); document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }) } }}>
                Ask
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
