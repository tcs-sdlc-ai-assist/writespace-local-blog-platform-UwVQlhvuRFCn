import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { login as loginUser } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { login, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isLoggedIn) {
      // Already logged in, redirect by role
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/posts', { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [isLoggedIn, role]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = loginUser(username.trim(), password);
      if (result.success) {
        login({
          userId: localStorage.getItem('ws_session')
            ? JSON.parse(localStorage.getItem('ws_session')).userId
            : '',
          username,
          role:
            localStorage.getItem('ws_session')
              ? JSON.parse(localStorage.getItem('ws_session')).role
              : 'user',
        });
        // Redirect to previous page or by role
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (
          localStorage.getItem('ws_session') &&
          JSON.parse(localStorage.getItem('ws_session')).role === 'admin'
        ) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/posts', { replace: true });
        }
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (e) {
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign in to WriteSpace</h2>
          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-1 font-medium">
                Username
              </label>
              <input
                id="username"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;