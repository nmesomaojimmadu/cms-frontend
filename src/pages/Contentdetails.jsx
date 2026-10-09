
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CalendarDays,
  Pencil,
  Save,
  X,
} from "lucide-react";
import "./ContentDetails.css";

const STORAGE_KEY = "createDraftPosts";

function getSavedPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ContentDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [posts, setPosts] = useState(getSavedPosts);
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const post = posts.find((item) => String(item.id) === postId);

  const [formData, setFormData] = useState({
    title: "",
    type: "Article",
    category: "",
    excerpt: "",
    content: "",
    status: "Draft",
  });

  useEffect(() => {
    const savedPosts = getSavedPosts();
    setPosts(savedPosts);

    const currentPost = savedPosts.find(
      (item) => String(item.id) === postId
    );

    if (currentPost) {
      setFormData({
        title: currentPost.title || "",
        type: currentPost.type || "Article",
        category: currentPost.category || "",
        excerpt: currentPost.excerpt || "",
        content: currentPost.content || "",
        status: currentPost.status || "Draft",
      });
    }

    setIsEditing(searchParams.get("edit") === "true");
  }, [postId, searchParams]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!formData.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a category.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Please enter the content body.");
      return;
    }

    const updatedPosts = posts.map((item) =>
      String(item.id) === postId
        ? {
            ...item,
            ...formData,
            title: formData.title.trim(),
            category: formData.category.trim(),
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      setIsEditing(false);
      setMessage("Your changes have been saved.");
      navigate(`/posts/${postId}`, { replace: true });
    } catch {
      setError("Your changes could not be saved. Please try again.");
    }
  }

  function handleCancelEdit() {
    const savedPost = getSavedPosts().find(
      (item) => String(item.id) === postId
    );

    if (savedPost) {
      setFormData({
        title: savedPost.title || "",
        type: savedPost.type || "Article",
        category: savedPost.category || "",
        excerpt: savedPost.excerpt || "",
        content: savedPost.content || "",
        status: savedPost.status || "Draft",
      });
    }

    setError("");
    setIsEditing(false);
    navigate(`/posts/${postId}`, { replace: true });
  }

  if (!post) {
    return (
      <div className="content-details-page">
        <Link to="/posts" className="content-details-back">
          <ArrowLeft size={18} />
          Back to Posts
        </Link>

        <div className="content-details-card">
          <h1>Content not found</h1>
          <p>
            This content may have been deleted or is no longer available.
          </p>
          <Link to="/posts" className="content-details-button">
            Return to Posts
          </Link>
        </div>
      </div>
    );
  }

  const updatedDate = post.updatedAt || post.createdAt;

  return (
    <div className="content-details-page">
      <div className="content-details-navigation">
        <Link to="/posts" className="content-details-back">
          <ArrowLeft size={18} />
          Back to Posts
        </Link>

        {!isEditing && (
          <button
            type="button"
            className="content-details-edit-button"
            onClick={() => {
              setError("");
              setMessage("");
              setIsEditing(true);
              navigate(`/posts/${postId}?edit=true`, { replace: true });
            }}
          >
            <Pencil size={17} />
            Edit content
          </button>
        )}
      </div>

      <header className="content-details-header">
        <div>
          <p className="content-details-eyebrow">CONTENT MANAGEMENT</p>
          <h1>{isEditing ? "Edit content" : "Content details"}</h1>
          <p>
            {isEditing
              ? "Make your changes and save them to update this content."
              : "View the complete information for this content."}
          </p>
        </div>
      </header>

      {error && <div className="content-details-error">{error}</div>}
      {message && <div className="content-details-message">{message}</div>}

      {isEditing ? (
        <form className="content-details-card" onSubmit={handleSave}>
          <div className="content-details-form-grid">
            <label className="content-details-field">
              Title
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Enter content title"
              />
            </label>

            <label className="content-details-field">
              Content type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Article">Article</option>
                <option value="News">News</option>
                <option value="Announcement">Announcement</option>
              </select>
            </label>

            <label className="content-details-field">
              Category
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Enter category"
              />
            </label>

            <label className="content-details-field">
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </label>

            <label className="content-details-field content-details-full">
              Short description
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="Write a short summary"
              />
            </label>

            <label className="content-details-field content-details-full">
              Content body
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                required
                placeholder="Write your content here"
              />
            </label>
          </div>

          <div className="content-details-form-actions">
            <button
              type="button"
              className="content-details-cancel-button"
              onClick={handleCancelEdit}
            >
              <X size={17} />
              Cancel
            </button>

            <button type="submit" className="content-details-save-button">
              <Save size={17} />
              Save changes
            </button>
          </div>
        </form>
      ) : (
        <article className="content-details-card">
          <div className="content-details-top">
            <span className="content-details-type">
              <FileText size={17} />
              {post.type || "Article"}
            </span>

            <span
              className={`content-details-status content-details-status-${(
                post.status || "Draft"
              ).toLowerCase()}`}
            >
              {post.status || "Draft"}
            </span>
          </div>

          <h2 className="content-details-title">
            {post.title || "Untitled content"}
          </h2>

          <div className="content-details-meta">
            <span>Category: {post.category || "Uncategorised"}</span>
            <span>Author: {post.author || "Current user"}</span>
          </div>

          <div className="content-details-date">
            <CalendarDays size={17} />
            Last updated: {formatDate(updatedDate)}
          </div>

          {post.excerpt && (
            <section className="content-details-section">
              <h3>Short description</h3>
              <p className="content-details-excerpt">{post.excerpt}</p>
            </section>
          )}

          <section className="content-details-section">
            <h3>Content body</h3>
            <div className="content-details-body">
              {post.content || "No content body was provided."}
            </div>
          </section>
        </article>
      )}
    </div>
  );
}

export default ContentDetails;