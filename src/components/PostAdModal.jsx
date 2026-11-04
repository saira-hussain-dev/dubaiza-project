import { useState } from 'react'
import { CATEGORIES, CITIES } from '../data/listings.js'

const CATEGORY_IMAGES = {
  Motors: 'photo-1503376780353-7e6692767b70',
  Property: 'photo-1600596542815-ffad4c1539a9',
  Jobs: 'photo-1521737604893-d14cc237f11d',
  Electronics: 'photo-1587202372775-e229f172b9d7',
  'Furniture & Garden': 'photo-1555041469-a586c61ea9bc',
  'Mobile Phones': 'photo-1592750475338-74b7b21085ab',
  Services: 'photo-1621905251189-08b45d6a269e',
  Classifieds: 'photo-1555041469-a586c61ea9bc',
  Community: 'photo-1523240795612-9a054b0db644',
}

// FRONTEND-ONLY posting: the ad appears immediately in this tab.
// A real marketplace needs a backend + database to store ads for other users.
export default function PostAdModal({
  onClose,
  onPost,
  user,
  onNeedLogin
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Motors')
  const [city, setCity] = useState('Dubai')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [spec, setSpec] = useState('')
  const [desc, setDesc] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()

    if (!user) {
      onNeedLogin()
      return
    }

    if (title.trim().length < 5) {
      setError('Please enter a title with at least 5 characters.')
      return
    }

    if (
      !price.trim() ||
      isNaN(Number(price.replace(/,/g, '')))
    ) {
      setError('Please enter a valid numeric price, for example 50000.')
      return
    }

    if (!location.trim()) {
      setError('Please enter a location.')
      return
    }

    if (desc.trim().length < 10) {
      setError('Please write a description with at least 10 characters.')
      return
    }

    const imageId =
      CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Classifieds

    onPost({
      id: Date.now(),
      section: 'fresh',
      category,
      title: title.trim(),
      spec: spec.trim() || category,
      location: location.trim(),
      city,
      price: `AED ${Number(
        price.replace(/,/g, '')
      ).toLocaleString()}`,
      time: 'JUST NOW',
      badge: 'NEW',
      image:
        imageUrl.trim() ||
        `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=80`,
      desc: desc.trim(),
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal wide"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Post an Ad</h2>

        {!user && (
          <p className="form-error">
            Please log in or register first to post an ad.
            Your ad will be saved in this browser only (demo).
          </p>
        )}

        {error && <p className="form-error">{error}</p>}

        <form className="form-col" onSubmit={submit}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Toyota Land Cruiser 2023"
            />
          </label>

          <div className="form-row">
            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              City
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {CITIES.filter(
                  (c) => c !== 'All Cities'
                ).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dubai Marina"
            />
          </label>

          <label>
            Price (AED, numbers only)
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 50000"
            />
          </label>

          <label>
            Details / specs
            <input
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="e.g. 2023 • 10,000 km"
            />
          </label>

          <label>
            Description
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the item, condition, and what is included..."
              rows="3"
            />
          </label>

          <label>
            Image URL (optional — leave blank for a category photo)
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <button className="btn-red full" type="submit">
            Publish Ad
          </button>
        </form>
      </div>
    </div>
  )
}