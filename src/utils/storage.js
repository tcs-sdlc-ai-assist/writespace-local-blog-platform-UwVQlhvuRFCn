/**
 * Utility functions for localStorage access with error handling.
 * Handles users, posts, and session management.
 */

/**
 * @returns {Array} users array or []
 */
export function getUsers() {
  try {
    const stored = localStorage.getItem('ws_users');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * @param {Object} user - user object to add
 * @returns {boolean} success
 */
export function addUser(user) {
  try {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('ws_users', JSON.stringify(users));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param {string} userId
 * @returns {boolean} success
 */
export function deleteUser(userId) {
  try {
    const users = getUsers();
    const filtered = users.filter((u) => u.id !== userId);
    localStorage.setItem('ws_users', JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns {Array} posts array or []
 */
export function getPosts() {
  try {
    const stored = localStorage.getItem('ws_posts');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * @param {Object} post - post object to add
 * @returns {boolean} success
 */
export function addPost(post) {
  try {
    const posts = getPosts();
    posts.unshift(post);
    localStorage.setItem('ws_posts', JSON.stringify(posts));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param {string} postId
 * @param {Object} updates - { title, content }
 * @returns {boolean} success
 */
export function editPost(postId, updates) {
  try {
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return false;
    posts[idx] = { ...posts[idx], ...updates };
    localStorage.setItem('ws_posts', JSON.stringify(posts));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param {string} postId
 * @returns {boolean} success
 */
export function deletePost(postId) {
  try {
    const posts = getPosts();
    const filtered = posts.filter((p) => p.id !== postId);
    localStorage.setItem('ws_posts', JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns {Object|null} session object or null
 */
export function getSession() {
  try {
    const stored = localStorage.getItem('ws_session');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

/**
 * @param {Object} session
 * @returns {boolean} success
 */
export function setSession(session) {
  try {
    localStorage.setItem('ws_session', JSON.stringify(session));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns {boolean} success
 */
export function clearSession() {
  try {
    localStorage.removeItem('ws_session');
    return true;
  } catch (e) {
    return false;
  }
}