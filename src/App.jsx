import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">WriteSpace Local Blog</h1>
      <p className="mb-6 text-lg">Welcome to your local-first blogging platform. Start writing and managing your posts right in your browser!</p>
      <Link
        to="/posts"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View Posts
      </Link>
    </div>
  );
}

function PostsList() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('ws_posts');
      setPosts(stored ? JSON.parse(stored) : []);
      setLoading(false);
    } catch (e) {
      setError('Failed to load posts.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="py-12 text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Posts</h2>
        <Link
          to="/posts/new"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          New Post
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Create your first post!</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 rounded border bg-white dark:bg-slate-800">
              <Link
                to={`/posts/${post.id}`}
                className="text-xl font-semibold text-blue-700 hover:underline dark:text-blue-400"
              >
                {post.title}
              </Link>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}

function PostForm({ onSave, initial }) {
  const [title, setTitle] = React.useState(initial?.title || '');
  const [content, setContent] = React.useState(initial?.content || '');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      onSave({ title, content });
    } catch (e) {
      setError('Failed to save post.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block mb-1 font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          className="w-full px-3 py-2 border rounded min-h-[120px] focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={saving}
          required
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

PostForm.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  initial: React.PropTypes.shape({
    title: React.PropTypes.string,
    content: React.PropTypes.string,
  }),
};

function NewPost() {
  const [error, setError] = React.useState(null);
  const [redirect, setRedirect] = React.useState(false);

  function handleSave({ title, content }) {
    try {
      const stored = localStorage.getItem('ws_posts');
      const posts = stored ? JSON.parse(stored) : [];
      const newPost = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('ws_posts', JSON.stringify([newPost, ...posts]));
      setRedirect(true);
    } catch (e) {
      setError('Failed to save post.');
    }
  }

  if (redirect) {
    window.location.href = '/posts';
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">New Post</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <PostForm onSave={handleSave} />
      <div className="mt-8">
        <Link to="/posts" className="text-blue-600 hover:underline dark:text-blue-400">
          &larr; Back to Posts
        </Link>
      </div>
    </div>
  );
}

function PostDetail() {
  const { pathname } = useLocation();
  const postId = pathname.split('/').pop();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('ws_posts');
      const posts = stored ? JSON.parse(stored) : [];
      const found = posts.find((p) => p.id === postId);
      if (!found) {
        setError('Post not found.');
      } else {
        setPost(found);
      }
      setLoading(false);
    } catch (e) {
      setError('Failed to load post.');
      setLoading(false);
    }
  }, [postId]);

  if (loading) {
    return <div className="py-12 text-center">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-red-600">
        {error}
        <div className="mt-8">
          <Link to="/posts" className="text-blue-600 hover:underline dark:text-blue-400">
            &larr; Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
      <div className="text-sm text-gray-500 mb-6">
        {new Date(post.createdAt).toLocaleString()}
      </div>
      <div className="prose dark:prose-invert mb-8 whitespace-pre-line">{post.content}</div>
      <div className="flex space-x-4">
        <Link
          to={`/posts/${post.id}/edit`}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Edit
        </Link>
        <Link
          to="/posts"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          Back to Posts
        </Link>
      </div>
    </div>
  );
}

function EditPost() {
  const { pathname } = useLocation();
  const postId = pathname.split('/').slice(-2, -1)[0];
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [redirect, setRedirect] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('ws_posts');
      const posts = stored ? JSON.parse(stored) : [];
      const found = posts.find((p) => p.id === postId);
      if (!found) {
        setError('Post not found.');
      } else {
        setPost(found);
      }
      setLoading(false);
    } catch (e) {
      setError('Failed to load post.');
      setLoading(false);
    }
  }, [postId]);

  function handleSave({ title, content }) {
    try {
      const stored = localStorage.getItem('ws_posts');
      const posts = stored ? JSON.parse(stored) : [];
      const idx = posts.findIndex((p) => p.id === postId);
      if (idx === -1) {
        setError('Post not found.');
        return;
      }
      posts[idx] = { ...posts[idx], title, content };
      localStorage.setItem('ws_posts', JSON.stringify(posts));
      setRedirect(true);
    } catch (e) {
      setError('Failed to save post.');
    }
  }

  if (redirect) {
    window.location.href = `/posts/${postId}`;
    return null;
  }

  if (loading) {
    return <div className="py-12 text-center">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-red-600">
        {error}
        <div className="mt-8">
          <Link to="/posts" className="text-blue-600 hover:underline dark:text-blue-400">
            &larr; Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <PostForm onSave={handleSave} initial={post} />
      <div className="mt-8">
        <Link to={`/posts/${postId}`} className="text-blue-600 hover:underline dark:text-blue-400">
          &larr; Back to Post
        </Link>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-24 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Not Found</h2>
      <p className="mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
        &larr; Back to Home
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;