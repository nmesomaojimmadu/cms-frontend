function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the CREATE CMS Dashboard.</p>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Posts</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Categories</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Comments</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Users</h3>
          <p>0</p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard