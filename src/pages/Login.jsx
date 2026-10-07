import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Login.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">CREATE.</div>

        <div className="auth-box">
          <h1>Welcome back</h1>

          <p className="auth-intro">
            Sign in to continue to your content.
          </p>

          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="auth-switch">
              <span>New?</span>
              <Link to="/register">Register</Link>
            </div>

            <button type="submit" className="auth-button">
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login