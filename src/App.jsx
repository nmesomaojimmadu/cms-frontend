
import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import Welcome from './pages/Welcome'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
import ContentDetails from './pages/ContentDetails'
import Comments from './pages/Comments'
import Users from './pages/Users'

import './App.css'

const SESSION_KEY = 'createLoggedInUser'

function ProtectedLayout() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  let currentUser = null

  try {
    currentUser = JSON.parse(
      localStorage.getItem(SESSION_KEY) || 'null'
    )
  } catch {
    currentUser = null
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    setShowLogoutConfirm(false)
    navigate('/', { replace: true })
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const initials = (currentUser.fullName || 'User')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">CREATE.</div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/posts">Posts</NavLink>
          <NavLink to="/comments">Comments</NavLink>
          <NavLink to="/users">Users</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="logout-button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search your content..."
              aria-label="Search your content"
            />
          </div>

          <div className="topbar-actions">
            <div
              className="profile-avatar"
              title={currentUser.fullName || 'User'}
              aria-label={`Logged-in user: ${currentUser.fullName || 'User'}`}
            >
              {initials}
            </div>
          </div>
        </header>

        <section className="content">
          <Outlet />
        </section>
      </main>

      {showLogoutConfirm && (
        <div
          className="confirm-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="logout-title">Log out?</h2>

            <p>Are you sure you want to log out of CREATE?</p>

            <div className="confirm-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-logout-button"
                onClick={handleLogout}
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/:postId" element={<ContentDetails />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
