import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BlogCard({ post }) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow hover:shadow-lg transition-all duration-200 p-5 flex flex-col h-full hover:-translate-y-1">
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
      <Link
        to={`/posts/${post.id}`}
        className="inline-block mt-auto text-blue-600 dark:text-blue-300 hover:underline text-sm font-medium"
      >
        Read more &rarr;
      </Link>
    </div>
  );
}

BlogCard.propTypes = {
  post: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    createdAt: React.PropTypes.string.isRequired,
  }).isRequired,
};

function AnimatedCard() {
  return (
    <div className="relative w-full max-w-xs mx-auto mt-8">
      <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 via-violet-400 to-pink-400 rounded-xl blur opacity-70 animate-pulse" />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col items-center z-10">
        <span className="text-4xl mb-2">✍️</span>
        <h3 className="text-lg font-bold mb-1 text-blue-700 dark:text-blue-400">Local-first Blogging</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
          Your posts are stored in your browser. No accounts, no cloud, just you and your words.
        </p>
      </div>
    </div>
  );
}

function LandingPage() {
  const [latestPosts, setLatestPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('ws_posts');
      const posts = stored ? JSON.parse(stored) : [];
      setLatestPosts(posts.slice(0, 3));
      setLoading(false);
    } catch (e) {
      setLatestPosts([]);
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-800 dark:text-blue-300">
              Welcome to WriteSpace Local Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8">
              A simple, privacy-first blogging platform. Write, edit, and manage your posts right in your browser—no sign up required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/posts"
                className="px-8 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                View Posts
              </Link>
              <Link
                to="/posts/new"
                className="px-8 py-3 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                Create New Post
              </Link>
            </div>
            <AnimatedCard />
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto py-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why WriteSpace?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-3 text-2xl">
                🔒
              </div>
              <h3 className="font-semibold mb-2">Private & Local</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All your data stays in your browser. No accounts, no tracking, no cloud.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900 mb-3 text-2xl">
                ⚡
              </div>
              <h3 className="font-semibold mb-2">Instant & Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Lightning-fast experience powered by React and Vite. No loading screens, just writing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 mb-3 text-2xl">
                📝
              </div>
              <h3 className="font-semibold mb-2">Simple & Focused</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Minimal UI, distraction-free writing. Focus on your words, not the platform.
              </p>
            </div>
          </div>
        </section>

        {/* Latest Posts Preview */}
        <section className="max-w-5xl mx-auto py-16 px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            <Link
              to="/posts"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading latest posts...</div>
          ) : latestPosts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No posts yet. Be the first to write!</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-slate-800 dark:to-slate-900 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to start writing?
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-8">
              Create your first post and experience the simplicity of WriteSpace.
            </p>
            <Link
              to="/posts/new"
              className="px-8 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Create New Post
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;