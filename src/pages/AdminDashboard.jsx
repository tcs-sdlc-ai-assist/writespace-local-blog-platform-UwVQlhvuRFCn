import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Avatar from '../components/Avatar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { getUsers, getPosts, deletePost, deleteUser } from '../utils/storage';

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`flex items-center space-x-3 p-5 rounded-lg shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700`}>
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color} text-2xl`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-600 dark:text-gray-300 text-sm">{label}</div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
  icon: React.PropTypes.node.isRequired,
  color: React.PropTypes.string.isRequired,
};

function AdminDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [deleteId, setDeleteId] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    try {
      setUsers(getUsers());
      setPosts(getPosts());
      setLoading(false);
    } catch (e) {
      setError('Failed to load dashboard data.');
      setLoading(false);
    }
  }, []);

  function handleDeletePost(postId) {
    setDeleteError(null);
    setDeleting(true);
    try {
      const ok = deletePost(postId);
      if (!ok) {
        setDeleteError('Failed to delete post.');
        setDeleting(false);
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setDeleting(false);
      setDeleteId(null);
    } catch (e) {
      setDeleteError('Failed to delete post.');
      setDeleting(false);
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
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleting(false);
      setDeleteId(null);
    } catch (e) {
      setDeleteError('Failed to delete user.');
      setDeleting(false);
    }
  }

  // Recent posts: sort by createdAt desc, take 5
  const recentPosts = React.useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [posts]);

  // Recent users: sort by createdAt desc, take 5
  const recentUsers = React.useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [users]);

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <Navbar />
        <main className="flex-1 w-full">
          {/* Banner */}
          <section className="relative bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 py-12 px-4 mb-12">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  Admin Dashboard
                </h1>
                <div className="text-lg text-blue-100">
                  Welcome, <span className="font-bold">{session?.username || 'Admin'}</span>!
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex items-center">
                <Avatar
                  username={session?.username}
                  role={session?.role}
                  size={12}
                  className="shadow-lg border-4 border-white dark:border-slate-900"
                />
              </div>
            </div>
          </section>

          <div className="max-w-5xl mx-auto px-4">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard
                label="Total Users"
                value={users.length}
                icon="👥"
                color="bg-blue-100 dark:bg-blue-900"
              />
              <StatCard
                label="Total Posts"
                value={posts.length}
                icon="📝"
                color="bg-violet-100 dark:bg-violet-900"
              />
              <StatCard
                label="Admins"
                value={users.filter((u) => u.role === 'admin').length}
                icon="👑"
                color="bg-pink-100 dark:bg-pink-900"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-12 space-y-4 md:space-y-0">
              <Link
                to="/posts/new"
                className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                + New Post
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                + Add User
              </Link>
            </div>

            {/* Recent Posts */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Posts</h2>
                <Link
                  to="/posts"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View All
                </Link>
              </div>
              {loading ? (
                <div className="py-8 text-center text-gray-500">Loading posts...</div>
              ) : recentPosts.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No posts found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Title</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Author</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Created</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map((post) => (
                        <tr key={post.id} className="border-t border-gray-100 dark:border-slate-700">
                          <td className="px-4 py-2">
                            <Link
                              to={`/posts/${post.id}`}
                              className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td className="px-4 py-2 flex items-center space-x-2">
                            <Avatar
                              username={post.author || post.username || 'User'}
                              role={post.role || 'user'}
                              size={6}
                            />
                            <span>{post.author || post.username || 'User'}</span>
                          </td>
                          <td className="px-4 py-2 text-gray-500 text-sm">
                            {new Date(post.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 flex space-x-2">
                            <Link
                              to={`/posts/${post.id}/edit`}
                              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteId({ type: 'post', id: post.id })}
                              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-sm"
                              disabled={deleting}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Users</h2>
                <Link
                  to="/register"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Add User
                </Link>
              </div>
              {loading ? (
                <div className="py-8 text-center text-gray-500">Loading users...</div>
              ) : recentUsers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
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
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-t border-gray-100 dark:border-slate-700">
                          <td className="px-4 py-2 flex items-center space-x-2">
                            <Avatar
                              username={user.username}
                              role={user.role}
                              size={6}
                            />
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
                                onClick={() => setDeleteId({ type: 'user', id: user.id })}
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
              )}
            </div>
          </div>
        </main>
        <Footer />

        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-sm w-full border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-3 text-red-600">
                Delete {deleteId.type === 'post' ? 'Post' : 'User'}
              </h2>
              <div className="mb-6 text-gray-700 dark:text-gray-200">
                Are you sure you want to delete this {deleteId.type}? This action cannot be undone.
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
                  onClick={() => {
                    if (deleteId.type === 'post') {
                      handleDeletePost(deleteId.id);
                    } else {
                      handleDeleteUser(deleteId.id);
                    }
                  }}
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

export default AdminDashboard;