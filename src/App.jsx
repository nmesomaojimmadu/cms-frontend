import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Posts from './pages/Posts'
import Comments from './pages/Comments'
import Users from './pages/Users'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <aside className="sidebar">
          <h2>CREATE</h2>

          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/posts">Posts</Link>
            <Link to="/comments">Comments</Link>
            <Link to="/users">Users</Link>
          </nav>
        </aside>

        <main className="main-content">

          <header className="topbar">
            <h1>CMS Dashboard</h1>
          </header>

          <section className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </section>

        </main>

      </div>
    </BrowserRouter>
  )
}

export default App