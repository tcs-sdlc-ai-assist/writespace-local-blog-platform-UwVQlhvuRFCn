# Deployment Guide: WriteSpace Local Blog

This document describes how to deploy the WriteSpace Local Blog app to production, including environment variables, Vercel hosting, and SPA routing configuration.

---

## 1. Build for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

---

## 2. Environment Variables

This app does **not** require any environment variables for basic operation. All data is stored in the browser's `localStorage`.

If you want to customize Vite settings (such as base path), you can use `.env` files:

- `.env.production` for production-specific settings
- `.env` for defaults

Example:

```
# .env.production
VITE_APP_NAME=WriteSpace Local Blog
```

---

## 3. Hosting on Vercel

### Recommended: Vercel (https://vercel.com/)

Vercel is ideal for static sites and SPAs. This project includes a `vercel.json` file for SPA routing.

#### Steps:

1. **Push your code to GitHub/GitLab.**
2. **Import your repo into Vercel.**
3. **Set the build command and output directory:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **No environment variables are required.**
5. **Vercel will auto-detect the project as Vite/React.**

#### SPA Routing

The included `vercel.json` ensures all routes are served via `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This is required for client-side routing with React Router.

---

## 4. Hosting Elsewhere

You can deploy the contents of the `dist/` folder to any static hosting provider (Netlify, GitHub Pages, Firebase Hosting, etc.).

**Important:**  
For client-side routing to work, configure your host to redirect all requests to `index.html` (SPA fallback).

- **Netlify:** Add a `_redirects` file with:
  ```
  /*    /index.html   200
  ```
- **Firebase:** In `firebase.json`:
  ```json
  "rewrites": [ { "source": "**", "destination": "/index.html" } ]
  ```
- **GitHub Pages:** Use a custom 404.html that loads the SPA.

---

## 5. Notes

- **No backend required:** All data is local to the user's browser.
- **Clearing browser storage resets all users and posts.**
- **HTTPS recommended** for privacy and security.

---

## 6. Troubleshooting

- **Blank page after deploy:**  
  Ensure SPA routing is configured (see above).
- **404s on refresh:**  
  Your host must serve `index.html` for all routes.

---

## 7. Useful Commands

- `npm run dev` — Start local dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

---

**WriteSpace Local Blog** — Local-first, privacy-focused blogging.