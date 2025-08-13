# Calorie Tracker Frontend (React)

A modern, responsive React application for food lovers to log meals, track calories, view dashboards, and search a food database. This project is designed as a lightweight MVP with a clean UI, environment-based configuration, and secure user authentication.

## Features

- Secure authentication (register, login, logout)
- Meal logging (add, list, delete)
- Dashboard with 7-day calorie trends (Chart.js)
- Food database search
- Responsive layout and dark mode
- Environment-based API configuration

## Getting Started

1. Install dependencies:
   npm install

2. Configure environment:
   - Copy .env.example to .env and set the variables:
     - REACT_APP_API_BASE_URL (e.g., http://localhost:4000)
     - REACT_APP_SITE_URL (optional; used by certain auth flows)

3. Start development server:
   npm start
   App will be available at http://localhost:3000

4. Run tests (non-interactive):
   npm test

5. Build for production:
   npm run build

## Routes

- /login - Authenticate users
- /register - Create a new account
- /dashboard - Authenticated dashboard with charts
- /meals - Manage meal entries
- /search - Food database lookup

Protected routes are wrapped by a ProtectedRoute component; unauthenticated users are redirected to /login.

## Environment Variables

- REACT_APP_API_BASE_URL
  Base URL for backend API endpoints.
- REACT_APP_SITE_URL
  Public site URL; used for auth providers that require redirect links.

Never hardcode secrets. Values are injected via .env at build time.

## Tech

- React 18
- React Router v6
- Chart.js via react-chartjs-2
- Vanilla CSS (see src/App.css)

## Notes

- Authentication expects the backend to expose:
  - POST /auth/register
  - POST /auth/login
  - GET /auth/me
- Meals endpoints:
  - GET /meals
  - POST /meals
  - DELETE /meals/:id
- Food search endpoint:
  - GET /foods/search?q=term

Adjust services in src/services if your backend differs.

To learn React, check out the [React documentation](https://reactjs.org/).
