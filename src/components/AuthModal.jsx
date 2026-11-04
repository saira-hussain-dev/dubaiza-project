import { useState } from 'react'

// FRONTEND DEMO AUTH - accounts are stored in localStorage only, not on a server.
// For real login you need Firebase Auth, Supabase Auth, or your own API + database
// with hashed passwords, email verification and secure sessions.
export default function AuthModal({ mode, setMode, onClose, onAuthSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('dubaiza_users') || '[]')
    } catch {
      return []
    }
  }

  const saveUsers = (users) => {
    localStorage.setItem('dubaiza_users', JSON.stringify(users))
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }

      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }

      const users = getUsers()

      if (users.some((u) => u.email === cleanEmail)) {
        setError('This email is already registered. Please log in instead.')
        return
      }

      const user = {
        name: name.trim(),
        email: cleanEmail,
        password
      }

      users.push(user)
      saveUsers(users)

      setSuccess('Account created! You are now logged in.')

      setTimeout(() => {
        onAuthSuccess({ name: user.name, email: user.email })
      }, 600)

    } else {
      const user = getUsers().find((u) => u.email === cleanEmail)

      if (!user) {
        setError('No account found for this email. Please register first.')
        return
      }

      if (user.password !== password) {
        setError('Incorrect password. Please try again.')
        return
      }

      setSuccess('Logged in successfully. Welcome back!')

      setTimeout(() => {
        onAuthSuccess({ name: user.name, email: user.email })
      }, 600)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal wide auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>
          {mode === 'register'
            ? 'Create your DubaiZA account'
            : 'Log in to DubaiZA'}
        </h2>

        <p className="modal-sub">
          Demo login — see the honest note below. No real account is created on a server.
        </p>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => {
              setMode('login')
              setError('')
              setSuccess('')
            }}
          >
            Log in
          </button>

          <button
            className={mode === 'register' ? 'tab active' : 'tab'}
            onClick={() => {
              setMode('register')
              setError('')
              setSuccess('')
            }}
          >
            Register
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <form className="form-col" onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmed Ali"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          {mode === 'register' && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
              />
            </label>
          )}

          <button className="btn-red full" type="submit">
            {mode === 'register' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="form-note">
          {mode === 'login' ? (
            <>
              No account yet?{' '}
              <button
                className="link-btn"
                onClick={() => setMode('register')}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className="link-btn"
                onClick={() => setMode('login')}
              >
                Log in here
              </button>
            </>
          )}
        </p>

        <p className="demo-note">
          <strong>Honest note:</strong> This is frontend-only demo authentication.
          For real login you need a backend (for example Firebase Auth,
          Supabase Auth, or your own Node.js API + database) with hashed passwords,
          email verification and secure sessions. Do not use this demo for real user data.
        </p>
      </div>
    </div>
  )
}