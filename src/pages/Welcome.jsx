import { Link } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  return (
    <main className="welcome-page">
      <div className="welcome-content">
        <div className="welcome-brand">CREATE</div>

        <p className="welcome-message">
          Welcome to the content world, enjoy your experience!
        </p>

        <div className="welcome-actions">
          <Link to="/register" className="welcome-primary">
            Get started
          </Link>

          <Link to="/login" className="welcome-secondary">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Welcome