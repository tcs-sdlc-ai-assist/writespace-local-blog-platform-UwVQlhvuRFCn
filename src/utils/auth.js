/****
 * Authentication/session helpers for WriteSpace Local Blog.
 * Handles login, logout, registration, and role checks.
 */

import {
  getUsers,
  addUser,
  getSession,
  setSession,
  clearSession,
} from './storage';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Object} { success: boolean, error?: string }
 */
export function login(username, password) {
  try {
    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return { success: false, error: 'Invalid username or password.' };
    }
    setSession({ userId: user.id, username: user.username, role: user.role });
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Login failed.' };
  }
}

/**
 * @returns {void}
 */
export function logout() {
  clearSession();
}

/**
 * @param {string} username
 * @param {string} password
 * @param {string} [role] - optional, default 'user'
 * @returns {Object} { success: boolean, error?: string }
 */
export function register(username, password, role = 'user') {
  try {
    const users = getUsers();
    if (users.some((u) => u.username === username)) {
      return { success: false, error: 'Username already exists.' };
    }
    const user = {
      id: Date.now().toString(),
      username,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    addUser(user);
    setSession({ userId: user.id, username: user.username, role: user.role });
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Registration failed.' };
  }
}

/**
 * @returns {boolean}
 */
export function isAdmin() {
  const session = getSession();
  return session && session.role === 'admin';
}

/**
 * @param {string} userId
 * @returns {boolean}
 */
export function isOwner(userId) {
  const session = getSession();
  return session && session.userId === userId;
}