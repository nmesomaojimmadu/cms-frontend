
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Register.css'

const USERS_KEY = 'createRegisteredUsers'

function validatePassword(password) {
  if (password.length < 8 || password.length > 12) {
    return 'Password must be between 8 and 12 characters.'
  }

  if (!/[a-z]/i.test(password)) {
    return 'Password must contain at least one letter.'
  }

  if (!/\d/.test(password)) {
    return 'Your password is not strong enough. Add at least one number. You may also add a special character.'
  }

  if (/[A-Z]/.test(password.slice(1))) {
    return 'If you use an uppercase letter, it must be the first character.'
  }

  if (/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};:',.<>/?|~`"\\]/.test(password)) {
    return 'Password contains an unsupported character.'
  }

  return ''
}

function Register() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'phone') {
      if (value !== '' && !/^\d+$/.test(value)) {
        return
      }

      if (value.length > 11) {
        return
      }
    }

    let updatedValue = value

    if (name === 'fullName') {
      updatedValue = value
        .toLowerCase()
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    }

    setFormData((previous) => ({
      ...previous,
      [name]: updatedValue,
    }))

    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) return

    setError('')
    setSuccess('')

    const fullName = formData.fullName.trim().replace(/\s+/g, ' ')
    const email = formData.email.trim().toLowerCase()
    const phone = formData.phone
    const { password, confirmPassword } = formData

    if (!fullName) {
      setError('Please enter your full name.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!/^\d{11}$/.test(phone)) {
      setError('Phone number must contain exactly 11 digits.')
      return
    }

    const passwordError = validatePassword(password)

    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    let registeredUsers = []

    try {
      registeredUsers = JSON.parse(
        localStorage.getItem(USERS_KEY) || '[]'
      )

      if (!Array.isArray(registeredUsers)) {
        registeredUsers = []
      }
    } catch {
      setError('Unable to check existing registrations. Please try again.')
      return
    }

    const emailExists = registeredUsers.some(
      (user) => user.email?.toLowerCase() === email
    )

    if (emailExists) {
      setError('This email address is already registered.')
      return
    }

    const phoneExists = registeredUsers.some(
      (user) => user.phone === phone
    )

    if (phoneExists) {
      setError('This phone number is already registered.')
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 450))

    registeredUsers.push({
      fullName,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
    })

    try {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(registeredUsers)
      )
    } catch {
      setError('Registration could not be saved. Please try again.')
      setIsSubmitting(false)
      return
    }

    setSuccess('Registration successful! Redirecting to login...')

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    })

    setIsSubmitting(false)

    setTimeout(() => {
      navigate('/login')
    }, 700)
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">CREATE</div>

        <div className="auth-box">
          <h1>Create your account</h1>

          <p className="auth-intro">
            Start your content journey with CREATE.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="Enter your 11-digit phone number"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8–12 characters"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={12}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <p className="password-hint">
                Use 8–12 characters, including at least one letter and
                one number. Special characters are optional. If you use
                an uppercase letter, it must be the first character.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="password-input">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={12}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="form-success" role="status">
                {success}
              </p>
            )}

            <div className="auth-switch">
              <span>Already registered?</span>
              <Link to="/login">Login</Link>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="loading-spinner"
                    aria-hidden="true"
                  />
                  Creating account...
                </>
              ) : (
                'REGISTER'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register