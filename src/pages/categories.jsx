import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, FolderOpen, X } from "lucide-react";
import "./Categories.css";

const CATEGORY_STORAGE_KEY = "createCategories";
const POSTS_STORAGE_KEY = "createDraftPosts";

function getSavedCategories() {
try {
const saved = JSON.parse(
localStorage.getItem(CATEGORY_STORAGE_KEY) || "[]"
);


return Array.isArray(saved) ? saved : [];


} catch {
return [];
}
}

function getSavedPosts() {
try {
const saved = JSON.parse(
localStorage.getItem(POSTS_STORAGE_KEY) || "[]"
);


return Array.isArray(saved) ? saved : [];


} catch {
return [];
}
}

function Categories() {
const [categories, setCategories] = useState(getSavedCategories);
const [posts, setPosts] = useState(getSavedPosts);
const [searchTerm, setSearchTerm] = useState("");
const [categoryName, setCategoryName] = useState("");
const [editingId, setEditingId] = useState(null);
const [error, setError] = useState("");
const [message, setMessage] = useState("");
const [deleteTarget, setDeleteTarget] = useState(null);

useEffect(() => {
localStorage.setItem(
CATEGORY_STORAGE_KEY,
JSON.stringify(categories)
);
}, [categories]);

const filteredCategories = categories.filter((category) =>
category.name.toLowerCase().includes(searchTerm.toLowerCase())
);

function resetForm() {
setCategoryName("");
setEditingId(null);
setError("");
}

function handleSubmit(event) {
event.preventDefault();


const trimmedName = categoryName.trim();

setError("");
setMessage("");

if (!trimmedName) {
  setError("Please enter a category name.");
  return;
}

const duplicate = categories.some(
  (category) =>
    category.name.toLowerCase() === trimmedName.toLowerCase() &&
    category.id !== editingId
);

if (duplicate) {
  setError("A category with this name already exists.");
  return;
}

if (editingId) {
  const oldCategory = categories.find(
    (category) => category.id === editingId
  );

  if (!oldCategory) {
    setError("This category could not be found.");
    return;
  }

  const updatedCategories = categories.map((category) =>
    category.id === editingId
      ? { ...category, name: trimmedName }
      : category
  );

  setCategories(updatedCategories);

  const updatedPosts = posts.map((post) =>
    post.category === oldCategory.name
      ? { ...post, category: trimmedName }
      : post
  );

  if (
    updatedPosts.some(
      (post, index) => post.category !== posts[index]?.category
    )
  ) {
    localStorage.setItem(
      POSTS_STORAGE_KEY,
      JSON.stringify(updatedPosts)
    );
    setPosts(updatedPosts);
  }

  setMessage("Category renamed successfully.");
} else {
  const newCategory = {
    id: crypto.randomUUID(),
    name: trimmedName,
    createdAt: new Date().toISOString(),
  };

  setCategories((current) => [...current, newCategory]);
  setMessage("Category added successfully.");
}

resetForm();


}

function startEditing(category) {
setEditingId(category.id);
setCategoryName(category.name);
setError("");
setMessage("");
}

function confirmDelete() {
if (!deleteTarget) return;


const categoryInUse = posts.some(
  (post) => post.category === deleteTarget.name
);

if (categoryInUse) {
  setError(
    `"${deleteTarget.name}" is used by existing content. Rename it or update those posts before deleting it.`
  );
  setDeleteTarget(null);
  return;
}

setCategories((current) =>
  current.filter((category) => category.id !== deleteTarget.id)
);

if (editingId === deleteTarget.id) {
  resetForm();
}

setMessage("Category deleted successfully.");
setError("");
setDeleteTarget(null);


}

return ( <div className="categories-page"> <div className="categories-header"> <div> <span className="categories-eyebrow">CONTENT ORGANIZATION</span> <h1>Categories</h1> <p>Organize your content into clear, manageable groups.</p> </div>


    <div className="categories-total">
      <FolderOpen size={20} />
      <div>
        <strong>{categories.length}</strong>
        <span>Total categories</span>
      </div>
    </div>
  </div>

  <div className="categories-layout">
    <section className="categories-panel">
      <div className="categories-panel-heading">
        <div>
          <h2>{editingId ? "Edit category" : "Create a category"}</h2>
          <p>
            {editingId
              ? "Update the category name."
              : "Give your content a clear topic."}
          </p>
        </div>
      </div>

      <form className="categories-form" onSubmit={handleSubmit}>
        <label htmlFor="category-name">Category name</label>

        <input
          id="category-name"
          type="text"
          placeholder="e.g. Technology"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          maxLength={60}
        />

        {error && <p className="categories-error">{error}</p>}
        {message && <p className="categories-message">{message}</p>}

        <div className="categories-form-actions">
          <button className="categories-submit" type="submit">
            {editingId ? <Pencil size={16} /> : <Plus size={17} />}
            {editingId ? "Save changes" : "Add category"}
          </button>

          {editingId && (
            <button
              className="categories-cancel"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>

    <section className="categories-panel categories-list-panel">
      <div className="categories-list-heading">
        <div>
          <h2>Your categories</h2>
          <p>{categories.length} categories created</p>
        </div>

        <div className="categories-search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search categories"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search categories"
          />
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="categories-table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="categories-name-cell">
                      <span className="categories-folder-icon">
                        <FolderOpen size={17} />
                      </span>
                      <span>{category.name}</span>
                    </div>
                  </td>

                  <td>
                    {
                      posts.filter(
                        (post) => post.category === category.name
                      ).length
                    }
                  </td>

                  <td>
                    <div className="categories-row-actions">
                      <button
                        type="button"
                        className="categories-edit-action"
                        onClick={() => startEditing(category)}
                        aria-label={`Edit ${category.name}`}
                        title="Edit category"
                      >
                        <Pencil size={16} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="categories-delete-action"
                        onClick={() => {
                          setDeleteTarget(category);
                          setError("");
                          setMessage("");
                        }}
                        aria-label={`Delete ${category.name}`}
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="categories-empty">
          <FolderOpen size={32} />
          <h3>
            {searchTerm ? "No matching categories" : "No categories yet"}
          </h3>
          <p>
            {searchTerm
              ? "Try another search term."
              : "Create your first category using the form."}
          </p>
        </div>
      )}
    </section>
  </div>

  {deleteTarget && (
    <div
      className="categories-modal-overlay"
      onClick={() => setDeleteTarget(null)}
    >
      <div
        className="categories-delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categories-delete-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="categories-modal-close"
          onClick={() => setDeleteTarget(null)}
          aria-label="Close confirmation"
        >
          <X size={19} />
        </button>

        <div className="categories-modal-icon">
          <Trash2 size={22} />
        </div>

        <h2 id="categories-delete-title">Delete category?</h2>
        <p>
          You are about to delete <strong>{deleteTarget.name}</strong>.
          Existing content will not be deleted. If the category is
          currently used, deletion will be blocked until you update
          that content.
        </p>

        <div className="categories-modal-actions">
          <button
            type="button"
            className="categories-cancel"
            onClick={() => setDeleteTarget(null)}
          >
            Keep category
          </button>

          <button
            type="button"
            className="categories-confirm-delete"
            onClick={confirmDelete}
          >
            Delete category
          </button>
        </div>
      </div>
    </div>
  )}
</div>


);
}

export default Categories;
