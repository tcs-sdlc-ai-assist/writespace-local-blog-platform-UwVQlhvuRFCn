import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ username, role, size = 8, className = '' }) {
  const isAdmin = role === 'admin';
  const emoji = isAdmin ? '👑' : '📖';
  const bg =
    isAdmin
      ? 'bg-violet-100 dark:bg-violet-700 text-violet-700 dark:text-violet-200'
      : 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200';

  const fontSize =
    size >= 10
      ? 'text-xl'
      : size >= 8
      ? 'text-lg'
      : 'text-base';

  return (
    <span
      className={`inline-flex items-center justify-center w-${size} h-${size} rounded-full ${bg} ${fontSize} font-bold ${className}`}
      title={username}
      aria-label={role}
    >
      <span className="mr-1">{emoji}</span>
      {username
        ? username.charAt(0).toUpperCase()
        : 'U'}
    </span>
  );
}

Avatar.propTypes = {
  username: PropTypes.string,
  role: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Avatar;