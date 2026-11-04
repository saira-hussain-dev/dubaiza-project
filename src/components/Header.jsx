import { CATEGORIES } from '../data/listings.js'

// FIXED: every header icon is now a real button with an onClick handler.
export default function Header({
  favCount,
  onCategory,
  onPostAd,
  activeCategory,
  onNotifications,
  onMessages,
  onFavorites,
  onLogin,
  onRegister,
  user,
  onLogout,
  unreadNotifications,
  unreadMessages
}) {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="top-links">
            <a href="#footer">About DubaiZA</a>
            <a href="#footer">Advertising</a>
            <a href="#footer">Business</a>
          </div>
          <div className="top-links">
            <span>EN ▾</span>
            <span>UAE ▾</span>
          </div>
        </div>
      </div>

      <div className="mainbar">
        <div className="container mainbar-inner">
          <a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault()
              onCategory('All')
            }}
          >
            <span className="logo-mark">D</span>
            <span className="logo-text">
              Dubai<span>ZA</span>
            </span>
          </a>

          <div className="header-actions">
            <button
              className="icon-btn"
              title="Notifications"
              onClick={onNotifications}
            >
              🔔
              {unreadNotifications > 0 && (
                <span className="badge">{unreadNotifications}</span>
              )}
            </button>

            <button
              className="icon-btn"
              title="Messages"
              onClick={onMessages}
            >
              💬
              {unreadMessages > 0 && (
                <span className="badge">{unreadMessages}</span>
              )}
            </button>

            <button
              className="icon-btn"
              title="Favorites"
              onClick={onFavorites}
            >
              ♥
              {favCount > 0 && (
                <span className="badge">{favCount}</span>
              )}
            </button>

            {user ? (
              <span className="login-link">
                Hi, {user.name}
                <button className="link-btn" onClick={onLogout}>
                  Log out
                </button>
              </span>
            ) : (
              <span className="login-link">
                <button className="link-btn" onClick={onLogin}>
                  Log in
                </button>
                <span> | </span>
                <button className="link-btn" onClick={onRegister}>
                  Register
                </button>
              </span>
            )}

            <button className="btn-red" onClick={onPostAd}>
              + Post Ad
            </button>
          </div>
        </div>
      </div>

      <nav className="catnav">
        <div className="container catnav-inner">
          <button
            className={activeCategory === 'All' ? 'cat-btn active' : 'cat-btn'}
            onClick={() => onCategory('All')}
          >
            All ▾
          </button>

          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={activeCategory === c ? 'cat-btn active' : 'cat-btn'}
              onClick={() => onCategory(c)}
            >
              {c} ▾
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}