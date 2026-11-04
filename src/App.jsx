
import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ListingCard from './components/ListingCard.jsx'
import Footer from './components/Footer.jsx'
import PromoModal from './components/PromoModal.jsx'
import ListingModal from './components/ListingModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import MessagesPanel from './components/MessagesPanel.jsx'
import NotificationsPanel from './components/NotificationsPanel.jsx'
import PostAdModal from './components/PostAdModal.jsx'
import { listings, projects } from './data/listings.js'
import { initialConversations, initialNotifications } from './data/inbox.js'

function Section({ title, action, children, id }) {
  return (
    <section className="section" id={id}>
      <div className="container">
        <div className="section-head">
          <h2>{title}</h2>
          {action && <button className="view-all" onClick={action.onClick}>{action.label} →</button>}
        </div>
        {children}
      </div>
    </section>
  )
}

export default function App() {
  const [allListings, setAllListings] = useState(listings)
  const [search, setSearch] = useState({ scope: 'All', query: '', city: 'All Cities' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [favs, setFavs] = useState(new Set())
  const [favsOnly, setFavsOnly] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showPromo, setShowPromo] = useState(true)
  const [toast, setToast] = useState('')
  const [email, setEmail] = useState('')
  const [sort, setSort] = useState('newest')

  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [showMessages, setShowMessages] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPostAd, setShowPostAd] = useState(false)
  const [conversations, setConversations] = useState(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState('c1')
  const [notifications, setNotifications] = useState(initialNotifications)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dubaiza_session')
      if (saved) setUser(JSON.parse(saved))
    } catch {
      // Ignore corrupt session
    }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const toggleFav = (id) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        showToast('Removed from favorites')
      } else {
        next.add(id)
        showToast('Added to favorites ♥')
      }
      return next
    })
  }

  const contact = (type, item) => {
    if (type === 'Call') {
      showToast(`Calling seller for: ${item.title} (demo - no real number stored)`)
      return
    }

    const seller = `Seller - ${item.title}`

    setConversations((prev) => {
      const existing = prev.find((c) => c.listing === item.title)

      if (existing) {
        setActiveConversationId(existing.id)
        return prev
      }

      const convo = {
        id: `c${Date.now()}`,
        name: seller,
        listing: item.title,
        unread: 0,
        messages: [
          {
            id: 'm1',
            from: 'them',
            text: `Hi, thanks for your interest in "${item.title}". How can I help?`,
          },
        ],
      }

      setActiveConversationId(convo.id)
      return [convo, ...prev]
    })

    setSelected(null)
    setShowMessages(true)
  }

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setFavsOnly(false)
    setSearch({ scope: 'All', query: '', city: 'All Cities' })
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSearch = (s) => {
    setSearch(s)
    setActiveCategory('All')
    setFavsOnly(false)
  }

  const filtered = useMemo(() => {
    let list = [...allListings]

    if (favsOnly) list = list.filter((l) => favs.has(l.id))
    if (activeCategory !== 'All') list = list.filter((l) => l.category === activeCategory)

    if (search.scope !== 'All' && search.scope !== 'Community') {
      list = list.filter((l) => l.category === search.scope)
    }

    if (search.scope === 'Community') {
      list = list.filter((l) => l.category === 'Community')
    }

    if (search.city !== 'All Cities') {
      list = list.filter((l) => l.city === search.city)
    }

    if (search.query.trim()) {
      const q = search.query.toLowerCase()
      list = list.filter((l) =>
        `${l.title} ${l.location} ${l.category} ${l.spec}`.toLowerCase().includes(q)
      )
    }

    if (sort === 'price-low') {
      list.sort((a, b) =>
        parseInt(a.price.replace(/\D/g, '') || 0) -
        parseInt(b.price.replace(/\D/g, '') || 0)
      )
    }

    if (sort === 'price-high') {
      list.sort((a, b) =>
        parseInt(b.price.replace(/\D/g, '') || 0) -
        parseInt(a.price.replace(/\D/g, '') || 0)
      )
    }

    return list
  }, [search, activeCategory, sort, allListings, favs, favsOnly])

  const bySectionAll = (s) => allListings.filter((l) => l.section === s)

  const hasSearch =
    search.query.trim() ||
    search.scope !== 'All' ||
    search.city !== 'All Cities' ||
    activeCategory !== 'All' ||
    favsOnly

  const unreadMessages = conversations.reduce((n, c) => n + c.unread, 0)
  const unreadNotifications = notifications.filter((n) => !n.read).length

  const openConversation = (id) => {
    setActiveConversationId(id)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    )
  }

  const sendMessage = (convoId, text) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: `m${Date.now()}`, from: 'me', text },
              ],
            }
          : c
      )
    )
  }

  const handleAuthSuccess = (u) => {
    setUser(u)
    localStorage.setItem('dubaiza_session', JSON.stringify(u))
    setAuthMode(null)
    showToast(`Welcome, ${u.name}!`)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dubaiza_session')
    showToast('Logged out.')
  }

  const resultsTitle = favsOnly
    ? 'Your Favorites'
    : activeCategory !== 'All'
      ? `${activeCategory} Listings`
      : 'Search Results'

  return (
    <div className="app">
      <Header
        favCount={favs.size}
        onCategory={handleCategory}
        activeCategory={activeCategory}
        onPostAd={() => (user ? setShowPostAd(true) : setAuthMode('login'))}
        onNotifications={() => setShowNotifications(true)}
        onMessages={() => setShowMessages(true)}
        onFavorites={() => {
          setFavsOnly(true)
          setActiveCategory('All')
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
        }}
        onLogin={() => setAuthMode('login')}
        onRegister={() => setAuthMode('register')}
        user={user}
        onLogout={logout}
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <Hero onSearch={handleSearch} />

      <main>
        <Section
          title={resultsTitle}
          id="results"
          action={
            hasSearch
              ? {
                  label: 'Clear filters',
                  onClick: () => {
                    setSearch({ scope: 'All', query: '', city: 'All Cities' })
                    setActiveCategory('All')
                    setFavsOnly(false)
                  },
                }
              : null
          }
        >
          <div className="filter-bar">
            <span>
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              {favsOnly ? ' in your favorites' : ''}
            </span>

            <label>
              Sort:
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="empty">
              {favsOnly
                ? 'No favorites yet. Click the heart on any listing to save it here.'
                : (
                  <>
                    No listings match your search. Try a different keyword or city, or{' '}
                    <button
                      className="link-btn"
                      onClick={() => {
                        setSearch({ scope: 'All', query: '', city: 'All Cities' })
                        setActiveCategory('All')
                      }}
                    >
                      clear the filters
                    </button>.
                  </>
                )}
            </p>
          ) : (
            <div className="grid">
              {filtered.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  isFav={favs.has(item.id)}
                  onFav={toggleFav}
                  onOpen={setSelected}
                  onContact={contact}
                />
              ))}
            </div>
          )}
        </Section>

        <Section
          title="⚡ Trending Today"
          action={{ label: 'View All', onClick: () => handleCategory('All') }}
        >
          <div className="grid">
            {bySectionAll('trending').map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFav={favs.has(item.id)}
                onFav={toggleFav}
                onOpen={setSelected}
                onContact={contact}
              />
            ))}
          </div>
        </Section>

        <Section
          title="New Projects Launching"
          action={{ label: 'View All Projects', onClick: () => handleCategory('Property') }}
        >
          <div className="grid grid-2">
            {projects.map((p) => (
              <article
                className="card project-card"
                key={p.id}
                onClick={() =>
                  setSelected({
                    ...p,
                    category: 'Property',
                    spec: 'Off-plan project',
                    desc: 'New launch project in Dubai. Register your interest to get floor plans and payment plans.',
                  })
                }
              >
                <div className="card-img tall">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <span className="card-badge">{p.badge}</span>
                </div>
                <div className="card-body">
                  <div className="card-meta">PROPERTY • {p.time}</div>
                  <h3>{p.title}</h3>
                  <p className="card-spec">📍 {p.location}</p>
                  <p className="price">{p.price}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Jobs">
          <div className="jobs-grid">
            <div className="job-panel">
              <h3>💼 Job Seekers</h3>
              <p className="job-title">Find your dream job</p>
              <p>Browse thousands of job vacancies from top companies in the UAE.</p>
              <div>
                <button className="btn-red" onClick={() => handleCategory('Jobs')}>Browse Jobs</button>{' '}
                <button className="btn-outline" onClick={() => showToast('Upload CV: attach a PDF in a real version (demo)')}>Upload CV</button>
              </div>
            </div>

            <div className="job-panel dark">
              <h3>🏢 Employers</h3>
              <p className="job-title">Hire the best talent</p>
              <p>Post job openings and find the perfect candidate for your company.</p>
              <div>
                <button className="btn-white" onClick={() => (user ? setShowPostAd(true) : setAuthMode('login'))}>Post a Job</button>{' '}
                <button className="btn-outline-white" onClick={() => showToast('Searching CVs (demo)')}>Search CVs</button>
              </div>
            </div>
          </div>

          <div className="grid" style={{ marginTop: 20 }}>
            {bySectionAll('jobs').map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFav={favs.has(item.id)}
                onFav={toggleFav}
                onOpen={setSelected}
                onContact={contact}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Top Motors"
          action={{ label: 'View All Cars', onClick: () => handleCategory('Motors') }}
        >
          <div className="grid">
            {bySectionAll('motors').map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFav={favs.has(item.id)}
                onFav={toggleFav}
                onOpen={setSelected}
                onContact={contact}
              />
            ))}
          </div>

          <div className="why-grid">
            <div>
              <h4>✓ Verified Sellers</h4>
              <p>We verify identity and ownership to ensure a safe transaction.</p>
            </div>
            <div>
              <h4>📋 Detailed Specs</h4>
              <p>Get all the technical details, history, and condition reports.</p>
            </div>
            <div>
              <h4>💰 Best Prices</h4>
              <p>Compare prices instantly and get the best deal in the market.</p>
            </div>
          </div>
        </Section>

        <section className="section spotlight">
          <div className="container spotlight-inner">
            <span className="spot-pill">NEW FEATURE</span>
            <h2>Sell your items faster with Spotlight</h2>
            <p>Boost your ads to the top of the list and get up to 10x more views.</p>
            <button
              className="btn-white"
              onClick={() => showToast('Spotlight: boost your ad (demo - payment needs a backend)')}
            >
              Try Spotlight
            </button>
          </div>
        </section>

        <Section
          title="Premium Properties"
          action={{ label: 'View All Properties', onClick: () => handleCategory('Property') }}
        >
          <div className="grid">
            {bySectionAll('properties').map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFav={favs.has(item.id)}
                onFav={toggleFav}
                onOpen={setSelected}
                onContact={contact}
              />
            ))}
          </div>
        </Section>

        <Section title="Fresh Recommendations">
          <div className="grid">
            {bySectionAll('fresh').map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFav={favs.has(item.id)}
                onFav={toggleFav}
                onOpen={setSelected}
                onContact={contact}
              />
            ))}
          </div>
        </Section>

        <section className="section app-section">
          <div className="container app-inner">
            <div>
              <h2>Get the full DubaiZA experience</h2>
              <p>Download our app for faster browsing, real-time chat alerts, and exclusive app-only deals. Available on iOS and Android.</p>
              <div className="store-btns">
                <button onClick={() => showToast('App Store link (demo - add your real store link here)')}>
                   DOWNLOAD ON THE<br /><strong>App Store</strong>
                </button>
                <button onClick={() => showToast('Google Play link (demo - add your real store link here)')}>
                  ▶ GET IT ON<br /><strong>Google Play</strong>
                </button>
              </div>
            </div>
            <div className="app-phone">📱<span>DubaiZA<br />App</span></div>
          </div>
        </section>

        <section className="section newsletter">
          <div className="container newsletter-inner">
            <h2>Subscribe to our Newsletter</h2>
            <p>The latest deals, news, and updates sent straight to your inbox.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!email.includes('@')) {
                  showToast('Please enter a valid email')
                  return
                }
                showToast(`Subscribed: ${email} (demo - email is not sent without a backend)`)
                setEmail('')
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
              />
              <button className="btn-red" type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <Footer />

      <nav className="mobile-nav">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>🏠 Home</a>
        <a href="#results" onClick={(e) => { e.preventDefault(); document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }) }}>🔍 Search</a>
        <button className="sell-btn" onClick={() => (user ? setShowPostAd(true) : setAuthMode('login'))}>+</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMessages(true) }}>
          💬 Chat {unreadMessages > 0 && <span>{unreadMessages}</span>}
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); user ? showToast(`Hi ${user.name} — profile page is the next step (demo)`) : setAuthMode('login') }}>👤 Profile</a>
      </nav>

      {toast && <div className="toast">{toast}</div>}

      {showPromo && (
        <PromoModal
          onClose={() => setShowPromo(false)}
          onPostAd={() => {
            setShowPromo(false)
            user ? setShowPostAd(true) : setAuthMode('login')
          }}
        />
      )}

      {selected && (
        <ListingModal
          item={selected}
          onClose={() => setSelected(null)}
          onFav={toggleFav}
          isFav={favs.has(selected.id)}
          onContact={contact}
        />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthMode(null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showMessages && (
        <MessagesPanel
          conversations={conversations}
          onClose={() => setShowMessages(false)}
          onSend={sendMessage}
          activeId={activeConversationId}
          setActiveId={openConversation}
        />
      )}

      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
          onMarkAllRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onClear={() => setNotifications([])}
        />
      )}

      {showPostAd && (
        <PostAdModal
          user={user}
          onClose={() => setShowPostAd(false)}
          onNeedLogin={() => {
            setShowPostAd(false)
            setAuthMode('login')
          }}
          onPost={(ad) => {
            setAllListings((prev) => [ad, ...prev])
            setShowPostAd(false)
            setActiveCategory('All')
            setSearch({ scope: 'All', query: '', city: 'All Cities' })
            setFavsOnly(false)
            showToast(`Ad published: ${ad.title}`)
            document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      )}
    </div>
  )
}
