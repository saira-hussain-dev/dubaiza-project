
import { useEffect, useState } from 'react'

export default function PromoModal({ onClose, onPostAd }) {
  const [left, setLeft] = useState(24 * 60 * 60)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <span className="promo-pill">30% OFF for your first Ad</span>
        <h2>Welcome! Get 30% off</h2>
        <p>Use this code on your first ad. We have also sent this code to your email.</p>
        <div className="countdown">{h} : {m} : {s}</div>
        <div className="code-box">
          <strong>SHOZON30</strong>
          <button onClick={() => { navigator.clipboard?.writeText('SHOZON30'); setCopied(true) }}>
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <button className="btn-red full" onClick={onPostAd}>Post Ad Now</button>
      </div>
    </div>
  )
}
