# WriteSpace Local Blog

A simple, privacy-first, local-first blogging platform built with React 18, Vite, and Tailwind CSS. Write, edit, and manage your blog posts right in your browser—no backend, no accounts required. All data is stored locally in your browser's storage.

---

## Features

- ✍️ **Local-first**: All posts and users are stored in your browser's localStorage.
- 🔒 **User Authentication**: Register, login, and logout with local persistence.
- 🛡️ **Role-based Access**: Admin and user roles, with admin dashboard for management.
- 📝 **Blog Management**: Create, edit, and delete posts (ownership and role checks enforced).
- 📱 **Responsive UI**: Works great on desktop and mobile, with dark mode support.
- ⚡ **Modern Stack**: Built with React 18, Vite, Tailwind CSS, and react-router-dom.
- 🚫 **No Backend**: 100% local, no cloud, no tracking, no external APIs.

---

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-router-dom](https://reactrouter.com/)
- LocalStorage (for all data persistence)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/writespace-local-blog.git
   cd writespace-local-blog
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Start the development server:**

   ```
   npm run dev
   ```

4. **Open your browser:**

   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Folder Structure

```
writespace-local-blog/
├── public/                # Static assets (favicon, index.html)
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, Avatar, BlogCard, etc.)
│   ├── context/           # React context providers (AuthContext)
│   ├── pages/             # Page components (LandingPage, BlogList, AdminDashboard, etc.)
│   ├── utils/             # Utility functions (auth, storage)
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind CSS imports
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

---

## Usage

- **Register**: Create a new user (first user can be admin).
- **Login**: Sign in to access posts and admin features.
- **Write Posts**: Create, edit, and delete your own posts.
- **Admin Dashboard**: Manage all users and posts (admin only).
- **Dark Mode**: Follows your system preference or browser setting.
- **Data Persistence**: All data is stored in your browser. Clearing browser storage will reset all users and posts.

---

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the codebase
- `npm run test` — Run tests (if any)

---

## License

**Private Project** — All rights reserved. Not for redistribution or commercial use.

---

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-router-dom](https://reactrouter.com/)

---

**WriteSpace Local Blog** — A local-first, privacy-focused blogging platform.