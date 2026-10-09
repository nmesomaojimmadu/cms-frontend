
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import "./CreatePost.css";

const USER_STORAGE_KEY = "createLoggedInUser";
const CATEGORY_STORAGE_KEY = "createCategories";
const POSTS_STORAGE_KEY = "createDraftPosts";

function getCurrentUserName() {
  try {
    const user = JSON.parse(
      localStorage.getItem(USER_STORAGE_KEY) || "null"
    );

    return (
      user?.fullName ||
      user?.name ||
      user?.username ||
      user?.email ||
      "User"
    );
  } catch {
    return "User";
  }
}

function getSavedCategories() {
  try {
    const categories = JSON.parse(
      localStorage.getItem(CATEGORY_STORAGE_KEY) || "[]"
    );

    return Array.isArray(categories) ? categories : [];
  } catch {
    return [];
  }
}

function CreatePost() {
  const navigate = useNavigate();
  const [categories] = useState(getSavedCategories);

  const [formData, setFormData] = useState({
    title: "",
    type: "Article",
    category: "",
    excerpt: "",
    content: "",
    status: "Draft",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSuccessMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please enter a content title.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Please write your content.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      setSuccessMessage("");
      return;
    }

    try {
      const existingPosts = JSON.parse(
        localStorage.getItem(POSTS_STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(existingPosts)) {
        setSuccessMessage(
          "Your existing content could not be read. Please check your saved data."
        );
        return;
      }

      const newPost = {
        id: crypto.randomUUID(),
        ...formData,
        author: getCurrentUserName(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        POSTS_STORAGE_KEY,
        JSON.stringify([newPost, ...existingPosts])
      );

      setSuccessMessage(
        formData.status === "Published"
          ? "Your content has been saved as published in this browser."
          : "Your content has been saved as a draft in this browser."
      );
    } catch {
      setSuccessMessage(
        "Your content could not be saved. Please try again."
      );
    }
  }

  return (
    <div className="create-post-page">
      <button
        type="button"
        className="create-post-back"
        onClick={() => navigate("/posts")}
      >
        <ArrowLeft size={17} />
        Back to Posts
      </button>

      <header className="create-post-header">
        <div>
          <p className="create-post-eyebrow">CONTENT MANAGEMENT</p>
          <h1>Create content</h1>
          <p>
            Write and organise an article, news story, or announcement.
          </p>
        </div>
      </header>

      <form className="create-post-form" onSubmit={handleSubmit}>
        <section className="create-post-section">
          <div className="create-post-section-heading">
            <h2>Content details</h2>
            <p>Add the basic information about your content.</p>
          </div>

          <div className="create-post-field">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter a clear, descriptive title"
              value={formData.title}
              onChange={handleChange}
              maxLength={180}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <span className="create-post-error">{errors.title}</span>
            )}
          </div>

          <div className="create-post-fields-row">
            <div className="create-post-field">
              <label htmlFor="type">Content type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Article">Article</option>
                <option value="News">News</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>

            <div className="create-post-field">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                aria-invalid={Boolean(errors.category)}
              >
                <option value="">
                  {categories.length > 0
                    ? "Select a category"
                    : "No categories available"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors.category && (
                <span className="create-post-error">
                  {errors.category}
                </span>
              )}

              {categories.length === 0 && (
                <span className="create-post-hint">
                  Create a category on the Categories page before saving
                  content.
                  {" "}
                  <button
                    type="button"
                    onClick={() => navigate("/categories")}
                    className="create-post-category-link"
                  >
                    Manage categories
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="create-post-field">
            <label htmlFor="excerpt">Short description</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              maxLength={300}
              placeholder="Briefly describe what this content is about."
              value={formData.excerpt}
              onChange={handleChange}
            />
            <span className="create-post-hint">
              {formData.excerpt.length}/300 characters
            </span>
          </div>
        </section>

        <section className="create-post-section">
          <div className="create-post-section-heading">
            <h2>Write your content</h2>
            <p>Enter the main body of your article or announcement.</p>
          </div>

          <div className="create-post-field">
            <label htmlFor="content">Content body *</label>
            <textarea
              id="content"
              name="content"
              rows={12}
              placeholder="Start writing your content here..."
              value={formData.content}
              onChange={handleChange}
              aria-invalid={Boolean(errors.content)}
            />
            {errors.content && (
              <span className="create-post-error">{errors.content}</span>
            )}
          </div>
        </section>

        <section className="create-post-section">
          <div className="create-post-section-heading">
            <h2>Publishing</h2>
            <p>Choose whether to save this content as a draft or publish it.</p>
          </div>

          <div className="create-post-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Draft">Save as draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </section>

        {successMessage && (
          <div className="create-post-success" role="status">
            {successMessage}
          </div>
        )}

        <div className="create-post-footer">
          <button
            type="button"
            className="create-post-cancel"
            onClick={() => navigate("/posts")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-post-submit"
          >
            {formData.status === "Published" ? (
              <Send size={17} />
            ) : (
              <Save size={17} />
            )}
            {formData.status === "Published"
              ? "Save as published"
              : "Save draft"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;