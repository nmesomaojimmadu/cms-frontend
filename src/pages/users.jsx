import { useEffect, useState } from "react";
import {
Search,
Users as UsersIcon,
ShieldCheck,
UserRound,
Trash2,
ChevronDown,
} from "lucide-react";
import "./Users.css";

const USERS_STORAGE_KEY = "createUsers";
const CURRENT_USER_KEY = "createLoggedInUser";

function getSavedUsers() {
try {
const saved = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
return Array.isArray(saved) ? saved : [];
} catch {
return [];
}
}

function getCurrentUser() {
try {
return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
} catch {
return null;
}
}

function getUserName(user) {
return user?.fullName || user?.name || user?.username || "User";
}

function getUserEmail(user) {
return user?.email || "";
}

function Users() {
const [users, setUsers] = useState(getSavedUsers);
const [searchTerm, setSearchTerm] = useState("");
const [roleFilter, setRoleFilter] = useState("All");
const [message, setMessage] = useState("");
const currentUser = getCurrentUser();
const currentEmail = getUserEmail(currentUser).toLowerCase();

useEffect(() => {
localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}, [users]);

const filteredUsers = users.filter((user) => {
const matchesSearch =
getUserName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
getUserEmail(user).toLowerCase().includes(searchTerm.toLowerCase());


const matchesRole = roleFilter === "All" || (user.role || "Editor") === roleFilter;

return matchesSearch && matchesRole;


});

const adminCount = users.filter((user) => user.role === "Admin").length;
const editorCount = users.filter((user) => user.role === "Editor").length;

function changeRole(userId, newRole) {
setUsers((previousUsers) =>
previousUsers.map((user) =>
user.id === userId ? { ...user, role: newRole } : user
)
);
setMessage("User role updated.");
}

function deleteUser(user) {
if (getUserEmail(user).toLowerCase() === currentEmail && currentEmail) {
setMessage("You cannot remove your own account here.");
return;
}


const confirmed = window.confirm(
  `Are you sure you want to remove ${getUserName(user)} from this user list?`
);

if (!confirmed) return;

setUsers((previousUsers) =>
  previousUsers.filter((item) => item.id !== user.id)
);
setMessage("User removed from the list.");


}

function addCurrentUser() {
if (!currentUser || !getUserEmail(currentUser)) {
setMessage("No logged-in user was found. Sign in first.");
return;
}


const alreadyExists = users.some(
  (user) => getUserEmail(user).toLowerCase() === currentEmail
);

if (alreadyExists) {
  setMessage("Your account is already on the list.");
  return;
}

const newUser = {
  id: `user-${Date.now()}`,
  fullName: getUserName(currentUser),
  email: getUserEmail(currentUser),
  role: currentUser.role || "Editor",
  status: "Active",
  joinedAt: new Date().toISOString(),
};

setUsers((previousUsers) => [...previousUsers, newUser]);
setMessage("Your account was added to the list.");


}

return ( <div className="users-page"> <div className="users-header"> <div> <span className="users-eyebrow">WORKSPACE MANAGEMENT</span> <h1>Users</h1> <p>Manage the people who contribute to your content.</p> </div>


    <button className="users-add-button" onClick={addCurrentUser}>
      <UsersIcon size={17} />
      Add my account
    </button>
  </div>

  {message && (
    <div className="users-message" role="status">
      <span>{message}</span>
      <button onClick={() => setMessage("")} aria-label="Dismiss message">
        ×
      </button>
    </div>
  )}

  <div className="users-stats">
    <div className="users-stat-card">
      <div className="users-stat-icon">
        <UsersIcon size={20} />
      </div>
      <span>Total users</span>
      <strong>{users.length}</strong>
      <small>Accounts in this directory</small>
    </div>

    <div className="users-stat-card">
      <div className="users-stat-icon">
        <ShieldCheck size={20} />
      </div>
      <span>Administrators</span>
      <strong>{adminCount}</strong>
      <small>Users assigned the Admin role</small>
    </div>

    <div className="users-stat-card">
      <div className="users-stat-icon">
        <UserRound size={20} />
      </div>
      <span>Editors</span>
      <strong>{editorCount}</strong>
      <small>Users assigned the Editor role</small>
    </div>
  </div>

  <section className="users-panel">
    <div className="users-panel-heading">
      <div>
        <h2>User directory</h2>
        <p>Search accounts and manage their assigned roles.</p>
      </div>
      <span className="users-count">{filteredUsers.length} shown</span>
    </div>

    <div className="users-toolbar">
      <div className="users-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="users-filter">
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          aria-label="Filter users by role"
        >
          <option value="All">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
        </select>
        <ChevronDown size={16} />
      </div>
    </div>

    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => {
            const isCurrentUser =
              getUserEmail(user).toLowerCase() === currentEmail &&
              currentEmail;

            return (
              <tr key={user.id || user.email}>
                <td>
                  <div className="users-person">
                    <div className="users-avatar">
                      {getUserName(user).charAt(0).toUpperCase()}
                    </div>
                    <div className="users-person-details">
                      <strong>
                        {getUserName(user)}
                        {isCurrentUser && (
                          <span className="users-you-label">You</span>
                        )}
                      </strong>
                      <span>{getUserEmail(user) || "No email provided"}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <select
                    className="users-role-select"
                    value={user.role || "Editor"}
                    onChange={(event) =>
                      changeRole(user.id, event.target.value)
                    }
                    aria-label={`Change role for ${getUserName(user)}`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                  </select>
                </td>

                <td>
                  <span className="users-status">
                    <span className="users-status-dot" />
                    {user.status || "Active"}
                  </span>
                </td>

                <td>
                  {user.joinedAt && !Number.isNaN(Date.parse(user.joinedAt))
                    ? new Date(user.joinedAt).toLocaleDateString()
                    : "—"}
                </td>

                <td>
                  <button
                    className="users-delete-button"
                    onClick={() => deleteUser(user)}
                    disabled={Boolean(isCurrentUser)}
                    title={
                      isCurrentUser
                        ? "You cannot remove your own account"
                        : "Remove user"
                    }
                    aria-label={`Remove ${getUserName(user)}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5">
                <div className="users-empty">
                  <UsersIcon size={30} />
                  <h3>No users found</h3>
                  <p>
                    {users.length === 0
                      ? "Add your account to start this directory."
                      : "Try a different search term or role filter."}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>

  <p className="users-note">
    This directory is a local frontend prototype. Role changes here do not
    change backend permissions or registered accounts.
  </p>
</div>


);
}

export default Users;
