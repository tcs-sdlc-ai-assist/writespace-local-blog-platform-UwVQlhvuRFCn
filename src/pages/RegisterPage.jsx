import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { register as registerUser } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { login, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
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

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password || !confirm) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = registerUser(trimmedUsername, password);
      if (result.success) {
        login({
          userId: localStorage.getItem('ws_session')
            ? JSON.parse(localStorage.getItem('ws_session')).userId
            : '',
          username: trimmedUsername,
          role:
            localStorage.getItem('ws_session')
              ? JSON.parse(localStorage.getItem('ws_session')).role
              : 'user',
        });
        if (
          localStorage.getItem('ws_session') &&
          JSON.parse(localStorage.getItem('ws_session')).role === 'admin'
        ) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/posts', { replace: true });
        }
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (e) {
      setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Register for WriteSpace</h2>
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
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block mb-1 font-medium">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-700"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;