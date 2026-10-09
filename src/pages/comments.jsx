
import { useEffect, useState } from "react";
import {
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Check,
  X,
} from "lucide-react";
import "./Comments.css";

const COMMENTS_STORAGE_KEY = "createComments";

function getSavedComments() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(COMMENTS_STORAGE_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Comments() {
  const [comments, setComments] = useState(getSavedComments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      COMMENTS_STORAGE_KEY,
      JSON.stringify(comments)
    );
  }, [comments]);

  const filteredComments = comments.filter((comment) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (comment.author || "").toLowerCase().includes(search) ||
      (comment.content || "").toLowerCase().includes(search) ||
      (comment.postTitle || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || comment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = comments.filter(
    (comment) => comment.status === "Pending"
  ).length;

  const approvedCount = comments.filter(
    (comment) => comment.status === "Approved"
  ).length;

  const rejectedCount = comments.filter(
    (comment) => comment.status === "Rejected"
  ).length;

  function updateStatus(id, status) {
    setComments((current) =>
      current.map((comment) =>
        comment.id === id
          ? { ...comment, status, updatedAt: new Date().toISOString() }
          : comment
      )
    );

    setMessage(`Comment ${status.toLowerCase()} successfully.`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    setComments((current) =>
      current.filter((comment) => comment.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    setMessage("Comment deleted successfully.");
  }

  function addSampleComments() {
    const samples = [
      {
        id: crypto.randomUUID(),
        author: "Ada Johnson",
        email: "ada@example.com",
        postTitle: "Welcome to CREATE CMS",
        content:
          "This is a helpful introduction. I look forward to reading more.",
        status: "Pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        author: "Michael James",
        email: "michael@example.com",
        postTitle: "The Future of Digital Publishing",
        content:
          "Great article. The points about content organization are useful.",
        status: "Approved",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        author: "Grace Williams",
        email: "grace@example.com",
        postTitle: "Getting Started with Content Management",
        content:
          "Could you share more examples for beginners?",
        status: "Rejected",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    setComments((current) => [...samples, ...current]);
    setMessage("Sample comments added for testing.");
  }

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="comments-page">
      <header className="comments-header">
        <div>
          <span className="comments-eyebrow">COMMUNITY MANAGEMENT</span>
          <h1>Comments</h1>
          <p>Review and moderate comments on your content.</p>
        </div>

        <button
          type="button"
          className="comments-sample-button"
          onClick={addSampleComments}
        >
          <MessageSquare size={17} />
          Add sample comments
        </button>
      </header>

      <section className="comments-stats">
        <div className="comments-stat-card">
          <span className="comments-stat-icon">
            <MessageSquare size={19} />
          </span>
          <div>
            <p>Total comments</p>
            <strong>{comments.length}</strong>
          </div>
        </div>

        <div className="comments-stat-card">
          <span className="comments-stat-icon pending">
            <Clock size={19} />
          </span>
          <div>
            <p>Pending</p>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="comments-stat-card">
          <span className="comments-stat-icon approved">
            <CheckCircle size={19} />
          </span>
          <div>
            <p>Approved</p>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="comments-stat-card">
          <span className="comments-stat-icon rejected">
            <XCircle size={19} />
          </span>
          <div>
            <p>Rejected</p>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </section>

      <section className="comments-panel">
        <div className="comments-toolbar">
          <div>
            <h2>All comments</h2>
            <p>Manage feedback from your readers.</p>
          </div>

          <div className="comments-controls">
            <div className="comments-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search comments"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter comments by status"
              className="comments-filter"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {message && (
          <div className="comments-message" role="status">
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {filteredComments.length > 0 ? (
          <div className="comments-table-wrapper">
            <table className="comments-table">
              <thead>
                <tr>
                  <th>Comment</th>
                  <th>Content</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredComments.map((comment) => (
                  <tr key={comment.id}>
                    <td>
                      <div className="comments-author">
                        <strong>{comment.author || "Anonymous"}</strong>
                        <span>{comment.email || "No email provided"}</span>
                      </div>
                    </td>

                    <td className="comments-content-cell">
                      <p>{comment.content}</p>
                    </td>

                    <td className="comments-date">
                      {formatDate(comment.createdAt)}
                    </td>

                    <td>
                      <span
                        className={`comments-status comments-status-${(
                          comment.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {comment.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <div className="comments-actions">
                        {comment.status !== "Approved" && (
                          <button
                            type="button"
                            className="comments-approve"
                            onClick={() =>
                              updateStatus(comment.id, "Approved")
                            }
                            aria-label={`Approve comment by ${comment.author}`}
                            title="Approve"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                        )}

                        {comment.status !== "Rejected" && (
                          <button
                            type="button"
                            className="comments-reject"
                            onClick={() =>
                              updateStatus(comment.id, "Rejected")
                            }
                            aria-label={`Reject comment by ${comment.author}`}
                            title="Reject"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="comments-delete"
                          onClick={() => setDeleteTarget(comment)}
                          aria-label={`Delete comment by ${comment.author}`}
                          title="Delete"
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
          <div className="comments-empty">
            <MessageSquare size={34} />
            <h3>
              {comments.length === 0
                ? "No comments yet"
                : "No matching comments"}
            </h3>
            <p>
              {comments.length === 0
                ? "Add sample comments to test the moderation tools."
                : "Try changing your search or status filter."}
            </p>
          </div>
        )}
      </section>

      {deleteTarget && (
        <div
          className="comments-modal-overlay"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="comments-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comments-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="comments-modal-icon">
              <Trash2 size={22} />
            </div>

            <h2 id="comments-delete-title">Delete this comment?</h2>
            <p>
              This will permanently remove the comment by{" "}
              <strong>{deleteTarget.author || "Anonymous"}</strong> from
              this browser's saved comments.
            </p>

            <div className="comments-modal-actions">
              <button
                type="button"
                className="comments-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="comments-confirm-delete"
                onClick={confirmDelete}
              >
                Delete comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comments;