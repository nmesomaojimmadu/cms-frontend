
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Good morning, Ada</h1>
          <p>Here's what's happening with your content.</p>
        </div>

        <button className="create-button">
          + Create Content
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <strong>0</strong>
          <span>Total content</span>
        </div>

        <div className="stat">
          <strong>0</strong>
          <span>Published</span>
        </div>

        <div className="stat">
          <strong>0</strong>
          <span>Drafts</span>
        </div>

        <div className="stat">
          <strong>0</strong>
          <span>Views</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="recent-content">
          <div className="section-title">
            <h2>Recent Content</h2>
          </div>

          <div className="empty-content">
            <h3>No content yet</h3>
            <p>
              Create your first piece of content to see it appear here.
            </p>

            <button className="create-button">
              + Create Content
            </button>
          </div>
        </section>

        <aside className="dashboard-side">
          <section className="views-section">
            <div className="section-title">
              <h2>Views, last 7 days</h2>
            </div>

            <div className="empty-chart">
              <p>No views yet</p>
            </div>
          </section>

          <section className="quick-actions">
            <div className="section-title">
              <h2>Quick Actions</h2>
            </div>

            <button>View Content</button>
            <button>Manage Drafts</button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;

