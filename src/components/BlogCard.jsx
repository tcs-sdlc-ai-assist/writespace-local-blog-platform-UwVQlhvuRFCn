import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

/**
 * BlogCard component for displaying a blog post summary.
 * Accent border cycles by index (blue, violet, pink).
 *
 * @param {Object} props
 * @param {Object} props.post - The blog post object
 * @param {boolean} [props.canEdit] - Show edit icon if true
 * @param {number} [props.index] - For accent border color cycling
 */
function BlogCard({ post, canEdit = false, index = 0 }) {
  const accentColors = [
    'border-l-4 border-blue-500',
    'border-l-4 border-violet-500',
    'border-l-4 border-pink-500',
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className={`group bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow hover:shadow-lg transition-all duration-200 p-5 flex flex-col h-full hover:-translate-y-1 relative ${accent}`}
    >
      <div className="flex items-center mb-2">
        <Avatar
          username={post.author || post.username || 'User'}
          role={post.role || 'user'}
          size={8}
          className="mr-2"
        />
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </span>
        {canEdit && (
          <Link
            to={`/posts/${post.id}/edit`}
            className="ml-auto text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
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
      <Link
        to={`/posts/${post.id}`}
        className="text-xl font-bold text-blue-700 dark:text-blue-400 group-hover:underline mb-2"
      >
        {post.title}
      </Link>
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
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.string,
    username: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  canEdit: PropTypes.bool,
  index: PropTypes.number,
};

export default BlogCard;