import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl w-full mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-blue-400">404</h1>
          <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;