import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../utils/storage';
import { isAdmin, isOwner } from '../utils/auth';

function BlogCard({ post, canEdit }) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow hover:shadow-lg transition-all duration-200 p-5 flex flex-col h-full hover:-translate-y-1 relative">
      <Link
        to={`/posts/${post.id}`}
        className="text-xl font-bold text-blue-700 dark:text-blue-400 group-hover:underline mb-2"
      >
        {post.title}
      </Link>
      <div className="text-sm text-gray-500 mb-3">
        {new Date(post.createdAt).toLocaleString()}
      </div>
      <div className="text-gray-700 dark:text-gray-200 flex-1 mb-2 whitespace-pre-line line-clamp-3">
        {post.content}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <Link
          to={`/posts/${post.id}`}
          className="inline-block text-blue-600 dark:text-blue-300 hover:underline text-sm font-medium"
        >
          Read more &rarr;
        </Link>
        {canEdit && (
          <Link
            to={`/posts/${post.id}/edit`}
            className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
            title="Edit post"
            aria-label="Edit post"
          >
            <svg
              className="w-5 h-5 inline"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 012-2z"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    userId: PropTypes.string,
  }).isRequired,
  canEdit: PropTypes.bool,
};

function BlogList() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { session, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const loaded = getPosts();
      setPosts(loaded);
      setLoading(false);
    } catch (e) {
      setError('Failed to load posts.');
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  function canEditPost(post) {
    if (!session) return false;
    if (isAdmin()) return true;
    if (post.userId && isOwner(post.userId)) return true;
    // fallback: allow edit if no userId and admin
    return false;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Blog Posts</h1>
          <Link
            to="/posts/new"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
          >
            + New Post
          </Link>
        </div>
        {loading ? (
          <div className="py-24 text-center text-gray-500">Loading posts...</div>
        ) : error ? (
          <div className="py-24 text-center text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-2xl font-bold mb-4">No posts yet</div>
            <div className="mb-8 text-gray-600 dark:text-gray-300">
              Start your blogging journey by creating your first post!
            </div>
            <Link
              to="/posts/new"
              className="px-8 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Create New Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                canEdit={canEditPost(post)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default BlogList;