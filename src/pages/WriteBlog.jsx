import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getPosts, addPost, editPost } from '../utils/storage';
import { isAdmin, isOwner } from '../utils/auth';

const TITLE_MAX = 80;
const CONTENT_MAX = 2000;

function BlogForm({ initial, onSave, loading, error }) {
  const [title, setTitle] = React.useState(initial?.title || '');
  const [content, setContent] = React.useState(initial?.content || '');
  const [touched, setTouched] = React.useState(false);

  const titleLen = title.length;
  const contentLen = content.length;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (
      !title.trim() ||
      !content.trim() ||
      title.length > TITLE_MAX ||
      content.length > CONTENT_MAX
    ) {
      return;
    }
    onSave({ title: title.trim(), content: content.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div>
        <label htmlFor="title" className="block mb-1 font-medium">
          Title
        </label>
        <input
          id="title"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX + 10}
          disabled={loading}
          required
        />
        <div className="flex justify-end text-xs mt-1">
          <span
            className={
              titleLen > TITLE_MAX
                ? 'text-red-500'
                : titleLen > TITLE_MAX - 10
                ? 'text-yellow-600'
                : 'text-gray-400'
            }
          >
            {titleLen}/{TITLE_MAX}
          </span>
        </div>
        {touched && !title.trim() && (
          <div className="text-xs text-red-500 mt-1">Title is required.</div>
        )}
        {touched && titleLen > TITLE_MAX && (
          <div className="text-xs text-red-500 mt-1">
            Title exceeds {TITLE_MAX} characters.
          </div>
        )}
      </div>
      <div>
        <label htmlFor="content" className="block mb-1 font-medium">
          Content
        </label>
        <textarea
          id="content"
          className="w-full px-3 py-2 border rounded min-h-[140px] focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={CONTENT_MAX + 50}
          disabled={loading}
          required
        />
        <div className="flex justify-end text-xs mt-1">
          <span
            className={
              contentLen > CONTENT_MAX
                ? 'text-red-500'
                : contentLen > CONTENT_MAX - 100
                ? 'text-yellow-600'
                : 'text-gray-400'
            }
          >
            {contentLen}/{CONTENT_MAX}
          </span>
        </div>
        {touched && !content.trim() && (
          <div className="text-xs text-red-500 mt-1">Content is required.</div>
        )}
        {touched && contentLen > CONTENT_MAX && (
          <div className="text-xs text-red-500 mt-1">
            Content exceeds {CONTENT_MAX} characters.
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={
            loading ||
            !title.trim() ||
            !content.trim() ||
            titleLen > TITLE_MAX ||
            contentLen > CONTENT_MAX
          }
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <Link
          to="/posts"
          className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-800 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

BlogForm.propTypes = {
  initial: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

function WriteBlog() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isLoggedIn } = useAuth();

  const [initial, setInitial] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [notFound, setNotFound] = React.useState(false);
  const [forbidden, setForbidden] = React.useState(false);

  // If editing, fetch post and check ownership
  React.useEffect(() => {
    if (id) {
      setLoading(true);
      try {
        const posts = getPosts();
        const found = posts.find((p) => p.id === id);
        if (!found) {
          setNotFound(true);
        } else if (
          !isAdmin() &&
          found.userId &&
          !isOwner(found.userId)
        ) {
          setForbidden(true);
        } else {
          setInitial({ title: found.title, content: found.content });
        }
      } catch (e) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line
  }, [id]);

  function handleSave({ title, content }) {
    setError(null);
    setLoading(true);
    try {
      if (id) {
        // Edit mode
        const ok = editPost(id, { title, content });
        if (!ok) {
          setError('Failed to save changes.');
          setLoading(false);
          return;
        }
        navigate(`/posts/${id}`);
      } else {
        // Create mode
        if (!isLoggedIn || !session) {
          setError('You must be logged in to write a post.');
          setLoading(false);
          return;
        }
        const newPost = {
          id: Date.now().toString(),
          title,
          content,
          createdAt: new Date().toISOString(),
          userId: session.userId,
          author: session.username,
          role: session.role,
        };
        const ok = addPost(newPost);
        if (!ok) {
          setError('Failed to create post.');
          setLoading(false);
          return;
        }
        navigate(`/posts/${newPost.id}`);
      }
    } catch (e) {
      setError('Failed to save post.');
      setLoading(false);
    }
  }

  // Not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true, state: { from: location } });
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {id ? 'Edit Blog Post' : 'Write a New Blog Post'}
          </h1>
        </div>
        {loading ? (
          <div className="py-24 text-center text-gray-500">Loading...</div>
        ) : notFound ? (
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
        ) : forbidden ? (
          <div className="py-24 text-center text-red-600">
            You do not have permission to edit this post.
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
          <BlogForm
            initial={initial}
            onSave={handleSave}
            loading={loading}
            error={error}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default WriteBlog;