# Changelog

## v1.0.0 (2024-06-07)

### Features

- Local-first blogging platform built with React 18, Vite, and Tailwind CSS.
- User authentication (register, login, logout) with localStorage persistence.
- Role-based access: admin and user roles.
- Admin dashboard with user and post management.
- Create, edit, delete blog posts (with ownership and role checks).
- Responsive UI with dark mode support.
- Posts and users stored in browser localStorage (no backend).
- Modern UI: Navbar, Footer, Avatar, BlogCard, ProtectedRoute, etc.
- Error handling and loading states for all async operations.
- Routing with react-router-dom.
- All styling via Tailwind CSS utility classes.
- No external dependencies beyond React, react-router-dom, and Tailwind.

### Setup

- Clone the repo.
- `npm install`
- `npm run dev` to start local dev server.
- All data is local to your browser; clearing browser storage resets all users/posts.

---

For future releases, see this file for new features, bug fixes, and improvements.