import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component for guarding routes.
 * Redirects guests to /login, enforces role-based access.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Array<string>} [props.roles] - Allowed roles (e.g., ['admin'])
 */
function ProtectedRoute({ children, roles }) {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="mb-8">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;