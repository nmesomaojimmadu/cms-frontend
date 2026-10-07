import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Register.css'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">CREATE.</div>

        <div className="auth-box">
          <h1>Create your account</h1>

          <p className="auth-intro">
            Start your content journey with CREATE.
          </p>

          <form>
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone number</label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <p className="password-hint">
                Use at least 8 characters, including a letter, number,
                and special character.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="password-input">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="auth-switch">
              <span>Already registered?</span>
              <Link to="/login">Login</Link>
            </div>

            <button type="submit" className="auth-button">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register