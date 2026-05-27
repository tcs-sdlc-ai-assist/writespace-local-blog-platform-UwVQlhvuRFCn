import React from 'react';

function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-700 dark:text-blue-400">WriteSpace</span>
          <span className="text-gray-400">|</span>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-300"
          >
            GitHub
          </a>
          <a
            href="https://vitejs.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-blue-600 hover:underline dark:text-blue-300"
          >
            Built with Vite
          </a>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} WriteSpace Local Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;