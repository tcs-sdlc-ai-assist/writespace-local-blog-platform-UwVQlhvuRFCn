import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { getPosts, deletePost } from '../utils/storage';
import { isAdmin, isOwner } from '../utils/auth';

function DeleteConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-sm w-full border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-3 text-red-600">Delete Post</h2>
        <div className="mb-6 text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this post? This action cannot be undone.
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmModal.propTypes = {
  open: React.PropTypes.bool.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
};

function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, isLoggedIn } = useAuth();

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showDelete, setShowDelete] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const posts = getPosts();
      const found = posts.find((p) => p.id === id);
      if (!found) {
        setError('Post not found.');
        setPost(null);
      } else {
        setPost(found);
      }
    } catch (e) {
      setError('Failed to load post.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  function canEditOrDelete(postObj) {
    if (!isLoggedIn || !session || !postObj) return false;
    if (isAdmin()) return true;
    if (postObj.userId && isOwner(postObj.userId)) return true;
    return false;
  }

  function handleDelete() {
    setDeleteError(null);
    setDeleting(true);
    try {
      const ok = deletePost(post.id);
      if (!ok) {
        setDeleteError('Failed to delete post.');
        setDeleting(false);
        return;
      }
      setDeleting(false);
      setShowDelete(false);
      navigate('/posts');
    } catch (e) {
      setDeleteError('Failed to delete post.');
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        {loading ? (
          <div className="py-24 text-center text-gray-500">Loading post...</div>
        ) : error ? (
          <div className="py-24 text-center text-red-600">
            {error}
            <div className="mt-8">
              <Link
                to="/posts"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                &larr; Back to Posts
              </Link>
            </div>
          </div>
        ) : !post ? (
          <div className="py-24 text-center text-red-600">
            Post not found.
            <div className="mt-8">
              <Link
                to="/posts"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                &larr; Back to Posts
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center">
              <Avatar
                username={post.author || post.username || 'User'}
                role={post.role || 'user'}
                size={8}
                className="mr-2"
              />
              <span className="text-sm text-gray-500">
                {post.author || post.username || 'User'}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
            <div className="prose dark:prose-invert mb-8 whitespace-pre-line">
              {post.content}
            </div>
            <div className="flex items-center space-x-4">
              {canEditOrDelete(post) && (
                <>
                  <Link
                    to={`/posts/${post.id}/edit`}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    disabled={deleting}
                  >
                    Delete
                  </button>
                </>
              )}
              <Link
                to="/posts"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Back to Posts
              </Link>
            </div>
            <DeleteConfirmModal
              open={showDelete}
              onCancel={() => setShowDelete(false)}
              onConfirm={handleDelete}
            />
            {deleteError && (
              <div className="mt-4 text-red-600">{deleteError}</div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ReadBlog;