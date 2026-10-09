import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Newspaper,
  Megaphone,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";
import "./Posts.css";

const STORAGE_KEY = "createDraftPosts";

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

function Posts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState(() => getSavedPosts());
  const [search, setSearch] = useState("");
  const [contentType, setContentType] = useState("All");
  const [status, setStatus] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function refreshPosts() {
      setPosts(getSavedPosts());
    }

    window.addEventListener("storage", refreshPosts);
    window.addEventListener("focus", refreshPosts);

    return () => {
      window.removeEventListener("storage", refreshPosts);
      window.removeEventListener("focus", refreshPosts);
    };
  }, []);

  const counts = useMemo(() => {
    return {
      all: posts.length,
      articles: posts.filter(
        (post) => (post.type || "Article").toLowerCase() === "article"
      ).length,
      news: posts.filter(
        (post) => (post.type || "").toLowerCase() === "news"
      ).length,
      announcements: posts.filter(
        (post) => (post.type || "").toLowerCase() === "announcement"
      ).length,
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        (post.title || "").toLowerCase().includes(searchTerm) ||
        (post.category || "").toLowerCase().includes(searchTerm) ||
        (post.author || "").toLowerCase().includes(searchTerm);

      const matchesType =
        contentType === "All" ||
        (post.type || "Article").toLowerCase() === contentType.toLowerCase();

      const matchesStatus =
        status === "All" ||
        (post.status || "Draft").toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [posts, search, contentType, status]);

  function handleDelete() {
    if (!deletePost) return;

    const updatedPosts = posts.filter(
      (post) => String(post.id) !== String(deletePost.id)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    setDeletePost(null);
    setOpenMenu(null);
    setMessage("Content deleted successfully.");

    window.setTimeout(() => setMessage(""), 3000);
  }

  function handleView(post) {
    setOpenMenu(null);
    navigate(`/posts/${post.id}`);
  }

  function handleEdit(post) {
    setOpenMenu(null);
    navigate(`/posts/${post.id}?edit=true`);
  }

  return (
    <div className="posts-page">
      <div className="posts-header">
        <div>
          <p className="posts-eyebrow">CONTENT MANAGEMENT</p>
          <h1>Posts</h1>
          <p className="posts-subtitle">
            Create, organise and manage your content in one place.
          </p>
        </div>

        <Link to="/posts/new" className="posts-create-button">
          <Plus size={18} />
          Create content
        </Link>
      </div>

      {message && <div className="posts-message">{message}</div>}

      <div className="posts-summary">
        <button
          type="button"
          className={`posts-summary-card ${contentType === "All" ? "active" : ""}`}
          onClick={() => setContentType("All")}
        >
          <span className="posts-summary-icon">
            <FileText size={20} />
          </span>
          <span className="posts-summary-label">All content</span>
          <strong>{counts.all}</strong>
        </button>

        <button
          type="button"
          className={`posts-summary-card ${contentType === "Article" ? "active" : ""}`}
          onClick={() => setContentType("Article")}
        >
          <span className="posts-summary-icon">
            <FileText size={20} />
          </span>
          <span className="posts-summary-label">Articles</span>
          <strong>{counts.articles}</strong>
        </button>

        <button
          type="button"
          className={`posts-summary-card ${contentType === "News" ? "active" : ""}`}
          onClick={() => setContentType("News")}
        >
          <span className="posts-summary-icon">
            <Newspaper size={20} />
          </span>
          <span className="posts-summary-label">News</span>
          <strong>{counts.news}</strong>
        </button>

        <button
          type="button"
          className={`posts-summary-card ${contentType === "Announcement" ? "active" : ""}`}
          onClick={() => setContentType("Announcement")}
        >
          <span className="posts-summary-icon">
            <Megaphone size={20} />
          </span>
          <span className="posts-summary-label">Announcements</span>
          <strong>{counts.announcements}</strong>
        </button>
      </div>

      <section className="posts-panel">
        <div className="posts-panel-header">
          <div>
            <h2>All content</h2>
            <p>View and manage your saved content.</p>
          </div>
          <span className="posts-result-count">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="posts-toolbar">
          <div className="posts-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search by title, category or author..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter by content type"
            value={contentType}
            onChange={(event) => setContentType(event.target.value)}
          >
            <option value="All">All types</option>
            <option value="Article">Articles</option>
            <option value="News">News</option>
            <option value="Announcement">Announcements</option>
          </select>

          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="posts-empty">
            <span className="posts-empty-icon">
              <FileText size={28} />
            </span>

            <h3>{posts.length === 0 ? "No content yet" : "No matching content"}</h3>

            <p>
              {posts.length === 0
                ? "Your articles, news and announcements will appear here when you create them."
                : "Try changing your search or filters to find the content you need."}
            </p>

            {posts.length === 0 && (
              <Link to="/posts/new" className="posts-create-button">
                <Plus size={18} />
                Create your first content
              </Link>
            )}
          </div>
        ) : (
          <div className="posts-table-wrapper">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Last updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPosts.map((post) => {
                  const TypeIcon = getTypeIcon(post.type);

                  return (
                    <tr key={post.id}>
                      <td>
                        <div className="posts-title-cell">
                          <span className="posts-title-icon">
                            <TypeIcon size={18} />
                          </span>
                          <div>
                            <strong>{post.title || "Untitled content"}</strong>
                            <span>{post.author || "Current user"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{post.type || "Article"}</td>

                      <td>{post.category || "Uncategorised"}</td>

                      <td>
                        <span
                          className={`posts-status posts-status-${(
                            post.status || "Draft"
                          ).toLowerCase()}`}
                        >
                          {post.status || "Draft"}
                        </span>
                      </td>

                      <td>
                        <span className="posts-date">
                          <CalendarDays size={15} />
                          {formatDate(post.updatedAt || post.createdAt)}
                        </span>
                      </td>

                      <td>
                        <div className="posts-actions">
                        <button
  type="button"
  className="posts-view-button"
  onClick={() => handleView(post)}
>
  <Eye size={16} />
  <span>View</span>
</button>

                          <button
                            type="button"
                            className="posts-action-button"
                            title="Edit content"
                            aria-label={`Edit ${post.title || "content"}`}
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil size={17} />
                          </button>

                          <div className="posts-menu-container">
                            <button
                              type="button"
                              className="posts-action-button"
                              title="More actions"
                              aria-label="More actions"
                              aria-expanded={openMenu === post.id}
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === post.id ? null : post.id
                                )
                              }
                            >
                              <MoreHorizontal size={19} />
                            </button>

                            {openMenu === post.id && (
                              <div className="posts-dropdown">
                                <button
                                  type="button"
                                  onClick={() => handleView(post)}
                                >
                                  <Eye size={16} />
                                  View content
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleEdit(post)}
                                >
                                  <Pencil size={16} />
                                  Edit content
                                </button>

                                <button
                                  type="button"
                                  className="posts-delete-action"
                                  onClick={() => {
                                    setDeletePost(post);
                                    setOpenMenu(null);
                                  }}
                                >
                                  <Trash2 size={16} />
                                  Delete content
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {deletePost && (
        <div
          className="posts-modal-overlay"
          onClick={() => setDeletePost(null)}
        >
          <div
            className="posts-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="posts-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="posts-delete-icon">
              <Trash2 size={22} />
            </span>

            <h2 id="posts-delete-title">Delete this content?</h2>

            <p>
              You are about to delete{" "}
              <strong>{deletePost.title || "Untitled content"}</strong>. This
              action cannot be undone.
            </p>

            <div className="posts-modal-actions">
              <button
                type="button"
                className="posts-cancel-button"
                onClick={() => setDeletePost(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="posts-confirm-delete-button"
                onClick={handleDelete}
              >
                Delete content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;