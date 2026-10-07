import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
} from 'react-router-dom'

import Welcome from './pages/Welcome'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Posts from './pages/Posts'
import Comments from './pages/Comments'
import Users from './pages/Users'


import './App.css'

function DashboardLayout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">CREATE</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/categories">
            Categories
          </NavLink>

          <NavLink to="/posts">
            Posts
          </NavLink>

          <NavLink to="/comments">
            Comments
          </NavLink>

          <NavLink to="/users">
            Users
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-button">
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search your content..."
            />
          </div>

          <div className="topbar-actions">
            <button className="notification-button">
              ♟
            </button>

            <div className="profile-avatar">
              AO
            </div>
          </div>
        </header>

        <section className="content">
          <Outlet />
        </section>
      </main>
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

        <Route element={<DashboardLayout />}>

        
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/posts"
            element={<Posts />}
          />

          <Route
            path="/comments"
            element={<Comments />}
          />

          <Route
            path="/users"
            element={<Users />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App