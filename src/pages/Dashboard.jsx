import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Clock3,
  Eye,
  Plus,
  ArrowRight,
  Newspaper,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import "./Dashboard.css";

const STORAGE_KEY = "createDraftPosts";


const USER_STORAGE_KEY = "createLoggedInUser";

function getCurrentUser() {
  try {
    const user = JSON.parse(
      localStorage.getItem(USER_STORAGE_KEY) || "null"
    );

    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
}

function getUserName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "User"
  );
}

function getSavedPosts() {
  try {
    const savedPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedPosts) ? savedPosts : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTypeIcon(type) {
  const normalizedType = (type || "Article").toLowerCase();

  if (normalizedType === "news") return Newspaper;
  if (normalizedType === "announcement") return Megaphone;

  return FileText;
}

function Dashboard() {
  const posts = getSavedPosts();

  const currentUser = getCurrentUser();
const currentUserName = getUserName(currentUser);

  const publishedCount = posts.filter(
    (post) => (post.status || "Draft").toLowerCase() === "published"
  ).length;

  const draftCount = posts.filter(
    (post) => (post.status || "Draft").toLowerCase() === "draft"
  ).length;

  const stats = [
    {
      title: "Total content",
      value: posts.length,
      description: "All content in your workspace",
      icon: FileText,
      className: "stat-content",
    },
    {
      title: "Published",
      value: publishedCount,
      description: "Content marked as published",
      icon: CheckCircle2,
      className: "stat-published",
    },
    {
      title: "Drafts",
      value: draftCount,
      description: "Content still in progress",
      icon: Clock3,
      className: "stat-drafts",
    },
    {
      title: "Total views",
      value: 0,
      description: "View tracking is not connected yet",
      icon: Eye,
      className: "stat-views",
    },
  ];

  const recentPosts = [...posts]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
          <h1>Dashboard</h1>
          <p>Welcome back {currentUserName}! Here is an overview of your content.</p>
        </div>

        <Link to="/posts/new" className="dashboard-create-button">
          <Plus size={18} />
          Create content
        </Link>
      </div>

      <section className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className={`dashboard-stat-card ${stat.className}`}
              key={stat.title}
            >
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon">
                  <Icon size={21} />
                </span>
              </div>

              <p className="dashboard-stat-label">{stat.title}</p>

              <h2>{stat.value}</h2>

              <p className="dashboard-stat-description">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-recent-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Recent content</h2>
              <p>Your latest articles, news and announcements.</p>
            </div>

            <Link to="/posts" className="dashboard-text-link">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="dashboard-empty-state">
              <span className="dashboard-empty-icon">
                <FileText size={27} />
              </span>

              <h3>No content created yet</h3>

              <p>
                Start building your content library by creating your first
                article, news post or announcement.
              </p>

              <Link to="/posts/new" className="dashboard-empty-button">
                <Plus size={17} />
                Create your first content
              </Link>
            </div>
          ) : (
            <div className="dashboard-recent-list">
              {recentPosts.map((post) => {
                const TypeIcon = getTypeIcon(post.type);

                return (
                  <Link
                    to={`/posts/${post.id}`}
                    className="dashboard-recent-item"
                    key={post.id}
                  >
                    <span className="dashboard-recent-icon">
                      <TypeIcon size={19} />
                    </span>

                    <div className="dashboard-recent-details">
                      <h3>{post.title || "Untitled content"}</h3>

                    
<p>
  {post.type || "Article"}
  <span className="dashboard-meta-dot">·</span>
  {post.category || "Uncategorised"}
</p>

<p className="dashboard-author">
  By{" "}
  {post.author && post.author !== "Current user"
    ? post.author
    : currentUserName}
</p>

                      <span className="dashboard-recent-date">
                        <CalendarDays size={14} />
                        {formatDate(post.updatedAt || post.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`dashboard-status dashboard-status-${(
                        post.status || "Draft"
                      ).toLowerCase()}`}
                    >
                      {post.status || "Draft"}
                    </span>

                    <ArrowRight
                      size={17}
                      className="dashboard-recent-arrow"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-panel dashboard-views-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Content performance</h2>
              <p>Track how your content performs.</p>
            </div>
          </div>

          <div className="dashboard-views-empty">
            <span className="dashboard-views-icon">
              <Eye size={25} />
            </span>

            <h3>Analytics coming soon</h3>

            <p>
              Content view statistics will appear here when view tracking is
              connected to the backend.
            </p>
          </div>

          <div className="dashboard-performance-summary">
            <div>
              <span>Published content</span>
              <strong>{publishedCount}</strong>
            </div>

            <div>
              <span>Draft content</span>
              <strong>{draftCount}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-quick-actions">
        <div>
          <h2>Quick actions</h2>
          <p>Choose what you want to work on next.</p>
        </div>

        <div className="dashboard-action-list">
          <Link to="/posts/new" className="dashboard-action-card">
            <span className="dashboard-action-icon">
              <Plus size={20} />
            </span>

            <span>
              <strong>Create content</strong>
              <small>Write a new article or announcement</small>
            </span>

            <ArrowRight size={17} />
          </Link>

          <Link to="/posts" className="dashboard-action-card">
            <span className="dashboard-action-icon">
              <FileText size={20} />
            </span>

            <span>
              <strong>Manage content</strong>
              <small>Review your existing posts</small>
            </span>

            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;