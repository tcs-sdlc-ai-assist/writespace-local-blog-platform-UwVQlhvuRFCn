import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Avatar from '../components/Avatar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { getUsers, addUser, deleteUser } from '../utils/storage';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function UserForm({ onAdd, loading }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('user');
  const [error, setError] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const trimmed = username.trim();
    if (!trimmed || !password) {
      setError('Username and password are required.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    onAdd({ username: trimmed, password, role }, setError);
    setUsername('');
    setPassword('');
    setRole('user');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label htmlFor="um-username" className="block mb-1 font-medium">
          Username
        </label>
        <input
          id="um-username"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
          autoComplete="off"
          required
        />
      </div>
      <div>
        <label htmlFor="um-password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          id="um-password"
          type="password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <label htmlFor="um-role" className="block mb-1 font-medium">
          Role
        </label>
        <select
          id="um-role"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={role}
          onChange={e => setRole(e.target.value)}
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
}

UserForm.propTypes = {
  onAdd: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool,
};

function UserManagement() {
  const { session } = useAuth();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [addLoading, setAddLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [deleteId, setDeleteId] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    try {
      setUsers(getUsers());
      setLoading(false);
    } catch (e) {
      setError('Failed to load users.');
      setLoading(false);
    }
  }, []);

  function handleAddUser({ username, password, role }, setFormError) {
    setAddLoading(true);
    setFormError(null);
    try {
      const exists = users.some(u => u.username === username);
      if (exists) {
        setFormError('Username already exists.');
        setAddLoading(false);
        return;
      }
      const user = {
        id: Date.now().toString(),
        username,
        password,
        role,
        createdAt: new Date().toISOString(),
      };
      const ok = addUser(user);
      if (!ok) {
        setFormError('Failed to add user.');
        setAddLoading(false);
        return;
      }
      setUsers(prev => [...prev, user]);
      setAddLoading(false);
    } catch (e) {
      setFormError('Failed to add user.');
      setAddLoading(false);
    }
  }

  function handleDeleteUser(userId) {
    setDeleteError(null);
    setDeleting(true);
    try {
      const ok = deleteUser(userId);
      if (!ok) {
        setDeleteError('Failed to delete user.');
        setDeleting(false);
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleting(false);
      setDeleteId(null);
    } catch (e) {
      setDeleteError('Failed to delete user.');
      setDeleting(false);
    }
  }

  // Responsive: show table on md+, cards on mobile
  return (
    <ProtectedRoute roles={['admin']}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">User Management</h1>
            <Link
              to="/admin"
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              &larr; Admin Dashboard
            </Link>
          </div>
          <section className="mb-12">
            <div className="max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Add New User</h2>
              <UserForm onAdd={handleAddUser} loading={addLoading} />
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">All Users</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {users.length} user{users.length !== 1 ? 's' : ''}
              </div>
            </div>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="py-12 text-center text-red-600">{error}</div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No users found.</div>
            ) : (
              <>
                {/* Table for md+ */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Username</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Role</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Joined</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .slice()
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(user => (
                        <tr key={user.id} className="border-t border-gray-100 dark:border-slate-700">
                          <td className="px-4 py-2 flex items-center space-x-2">
                            <Avatar username={user.username} role={user.role} size={6} />
                            <span>{user.username}</span>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={
                                user.role === 'admin'
                                  ? 'text-violet-700 dark:text-violet-300 font-semibold'
                                  : 'text-gray-700 dark:text-gray-200'
                              }
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-500 text-sm">
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            {user.id !== session?.userId && (
                              <button
                                onClick={() => setDeleteId(user.id)}
                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm"
                                disabled={deleting}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Cards for mobile */}
                <div className="md:hidden grid grid-cols-1 gap-5">
                  {users
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(user => (
                    <div
                      key={user.id}
                      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow p-5 flex items-center"
                    >
                      <Avatar username={user.username} role={user.role} size={8} className="mr-3" />
                      <div className="flex-1">
                        <div className="font-semibold">{user.username}</div>
                        <div className={classNames(
                          'text-xs',
                          user.role === 'admin'
                            ? 'text-violet-700 dark:text-violet-300 font-semibold'
                            : 'text-gray-700 dark:text-gray-200'
                        )}>
                          {user.role}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {user.id !== session?.userId && (
                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="ml-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-xs"
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
        <Footer />
        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-sm w-full border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-3 text-red-600">
                Delete User
              </h2>
              <div className="mb-6 text-gray-700 dark:text-gray-200">
                Are you sure you want to delete this user? This action cannot be undone.
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-700 transition"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteId)}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  disabled={deleting}
                >
                  Delete
                </button>
              </div>
              {deleteError && (
                <div className="mt-4 text-red-600">{deleteError}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default UserManagement;