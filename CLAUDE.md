# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
npm run dev
```
- Runs Vite development server on port 3000
- Enables hot module replacement for fast development

**Build for production:**
```bash
npm run build
```
- Creates optimized production build in `dist/` directory

**Lint code:**
```bash
npm run lint
```
- Runs ESLint to check code quality and React best practices
- Configuration includes React, React Hooks, and React Refresh plugins

**Preview production build:**
```bash
npm run preview
```
- Serves the built application locally for testing

## Architecture Overview

This is a React 18 application built with Vite and React Router DOM for the Immpression project frontend.

### Core Architecture Pattern
- **Component-based**: Each feature is organized as a self-contained component with its own CSS file
- **Route-based navigation**: Uses React Router with centralized route definitions
- **Context-based state**: Authentication state managed via React Context (AuthProvider)
- **Environment-aware API**: Dynamic API URL configuration based on environment

### Key Directories Structure
- `src/components/`: Feature components (each with .jsx and .css files)
- `src/state/`: Global state management (AuthProvider)
- `src/utils/`: Utility functions and route helpers
- `src/constants/`: Global CSS and constants
- `src/assets/`: Images, backgrounds, and static assets
- `public/`: Public assets accessible via URL

### Application Flow
1. **Entry Point**: `main.jsx` → `App.jsx` → `AuthProvider` wrapper
2. **Authentication**: Context-based auth state with localStorage persistence
3. **Routing**: Currently using guest-only routes (user routes commented out)
4. **Component Structure**: Navbar → Routes (content) → Footer layout

### State Management
- **AuthProvider** (`src/state/AuthProvider.jsx`): Manages user authentication state
- **localStorage**: Persists user session data
- **Route-based state**: Navigation handled through `src/routes.js` and `src/utils/helpers.jsx`

### API Configuration
- **Environment-based**: Production vs development API URLs in `src/API_URL.js`
- **Production**: `https://immpression-backend.vercel.app`
- **Development**: `http://localhost:4000`
- Uses `VITE_APP_ENV` environment variable

### Current Feature State
- Landing page and informational pages are active
- User authentication system implemented but currently disabled
- Guest navigation includes: Landing Page, Policy Page, About Us, Contact Us

### Tech Stack
- **React 18** with JSX
- **Vite** for build tooling and development server
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests
- **Framer Motion** for animations
- **ESLint** for code quality