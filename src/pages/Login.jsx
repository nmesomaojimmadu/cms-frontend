
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Login.css'

const USERS_KEY = 'createRegisteredUsers'
const SESSION_KEY = 'createLoggedInUser'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    if (isLoading) return

    setError('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1400))

    let registeredUsers = []

    try {
      registeredUsers = JSON.parse(
        localStorage.getItem(USERS_KEY) || '[]'
      )

      if (!Array.isArray(registeredUsers)) {
        registeredUsers = []
      }
    } catch {
      setError('Unable to check registered accounts. Please try again.')
      setIsLoading(false)
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    const matchedUser = registeredUsers.find(
      (user) =>
        user.email?.toLowerCase() === normalizedEmail &&
        user.password === password
    )

    if (!matchedUser) {
      setError('Invalid email or password. Please check your details or register first.')
      setIsLoading(false)
      return
    }

    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          fullName: matchedUser.fullName,
          email: matchedUser.email,
          phone: matchedUser.phone,
        })
      )
    } catch {
      setError('Unable to start your session. Please try again.')
      setIsLoading(false)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">CREATE</div>

        <div className="auth-box">
          <h1>Welcome back</h1>
          <p className="auth-intro">
            Sign in to continue to your content.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                  }}
                  required
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="auth-switch">
              <span>New to CREATE?</span>
              <Link to="/register">Register</Link>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner" aria-hidden="true" />
                  Logging in...
                </>
              ) : (
                'LOG IN'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login