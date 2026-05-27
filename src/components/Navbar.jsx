import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const { session, isLoggedIn, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    window.location.href = '/';
  }

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-700 dark:text-blue-400"
            >
              WriteSpace
            </Link>
            <div className="hidden md:flex md:ml-8 md:space-x-6">
              <Link
                to="/posts"
                className={classNames(
                  'hover:underline transition',
                  location.pathname.startsWith('/posts')
                    ? 'font-semibold text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200'
                )}
              >
                Posts
              </Link>
              {isLoggedIn && role === 'admin' && (
                <Link
                  to="/admin"
                  className={classNames(
                    'hover:underline transition',
                    location.pathname.startsWith('/admin')
                      ? 'font-semibold text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-200'
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {!isLoggedIn ? (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-3">
                <span className="flex items-center space-x-2">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold"
                    title={session.username}
                  >
                    {session.username
                      ? session.username.charAt(0).toUpperCase()
                      : 'U'}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {session.username}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
                aria-label="Open main menu"
              >
                <svg
                  className={classNames('h-6 w-6', menuOpen ? 'hidden' : 'block')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={classNames('h-6 w-6', menuOpen ? 'block' : 'hidden')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/posts"
              className={classNames(
                'block px-2 py-2 rounded hover:bg-blue-50 dark:hover:bg-slate-800 transition',
                location.pathname.startsWith('/posts')
                  ? 'font-semibold text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200'
              )}
            >
              Posts
            </Link>
            {isLoggedIn && role === 'admin' && (
              <Link
                to="/admin"
                className={classNames(
                  'block px-2 py-2 rounded hover:bg-blue-50 dark:hover:bg-slate-800 transition',
                  location.pathname.startsWith('/admin')
                    ? 'font-semibold text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200'
                )}
              >
                Admin
              </Link>
            )}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="block px-2 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-2 py-2 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold"
                  title={session.username}
                >
                  {session.username
                    ? session.username.charAt(0).toUpperCase()
                    : 'U'}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {session.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  // No props
};

export default Navbar;