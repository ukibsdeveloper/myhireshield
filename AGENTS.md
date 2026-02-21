# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MyHireShield is an employee background and performance verification platform. It has three user roles: **company**, **employee**, and **admin**. Companies register employees, submit performance reviews, and upload/verify documents. Employees view their reputation reports and can pay (via Razorpay) to access them. Admins moderate reviews and manage users. Real-time notifications are delivered via WebSocket.

## Repository Layout

This is a monorepo with three independent `package.json` files — each directory must have dependencies installed separately:

- `client/` — React 19 SPA (Vite, Tailwind CSS 3, react-router-dom v7)
- `server/` — Express.js REST API (Mongoose/MongoDB, JWT auth, ES modules)
- `tests/` — Vitest unit tests + Playwright E2E tests (separate package)

The root `package.json` only holds the `razorpay` dependency and is not the main entry point for either app.

## Build & Run Commands

### Server (from `server/`)
```
npm install
npm run dev          # nodemon hot-reload (development)
npm start            # node server.js (production)
```
Server runs on port 5000 by default. Requires `server/.env` (see `server/.env.example`).

### Client (from `client/`)
```
npm install
npm run dev          # Vite dev server on port 3000, proxies /api → localhost:5000
npm run build        # Production build → client/dist/
```
Client requires `client/.env` (VITE_API_URL). In dev mode, the Vite proxy handles API requests so VITE_API_URL can be empty.

### Tests (from `tests/`)
```
npm install
npm test             # Run Vitest unit tests
npm run test:coverage # Vitest with V8 coverage (80% threshold)
npm run test:e2e     # Playwright E2E (requires client dev server running)
npm run test:e2e:ui  # Playwright with interactive UI
```
Unit tests use `jsdom` environment with MSW for API mocking (`tests/mocks/server`). Vitest config defines path aliases: `@` → `client/src`, `@server` → `server/`, `@tests` → `tests/`.

## Architecture

### Server

**Request flow:** `server.js` → security middleware stack (order matters, numbered 1–13 in server.js) → route → controller → model → response.

- **Auth:** JWT Bearer tokens stored in `localStorage` on the client. `protect` middleware verifies tokens and attaches `req.user`. `authorize(...roles)` provides RBAC. `optionalAuth` is available for routes where login is helpful but not required.
- **Roles & constants:** Defined in `server/config/constants.js` (`ROLES`, `REVIEW_STATUS`, `DOCUMENT_STATUS`, `EMPLOYMENT_TYPE`, `AUDIT_EVENTS`, `HTTP_STATUS`). Use these instead of string literals.
- **Models:** `User`, `Company`, `Employee`, `Review`, `Document`, `AuditLog` (all in `server/models/` with `.model.js` suffix).
- **Security middleware** (`server/middleware/security.middleware.js`): requestId, ipTracker, xssSanitizer, securityHeaders, payloadValidator, suspiciousRequestDetector. CSRF protection is applied selectively to state-changing routes (reviews, documents, payments, admin).
- **Caching:** `server/utils/cache.js` provides three `NodeCache` tiers (short=1min, medium=5min, long=1hr) with a `cacheMiddleware` factory and cache invalidation helpers.
- **WebSocket:** `server/services/websocket.js` initializes on the same HTTP server for real-time notification delivery.
- **File uploads:** Handled via `multer` middleware in `server/middleware/upload.middleware.js`. Uploaded files go to `server/uploads/`.
- **Email:** `server/utils/email.js` uses Nodemailer (Gmail SMTP) for verification emails, password resets, etc.
- **Validation:** `server/middleware/validation.middleware.js` uses `express-validator` for request validation.
- **Error handling:** Custom `AppError` class (`server/utils/AppError.js`) + `asyncHandler` wrapper (`server/utils/asyncHandler.js`) + centralized `errorHandler` middleware.
- **Database script:** `server/scripts/rebuildDatabase.js` for database rebuild operations.

### Client

**Provider hierarchy:** `HelmetProvider` → `BrowserRouter` → `AuthProvider` → `AccessibilityProvider` → `App` (see `client/src/main.jsx`).

- **Routing:** `App.jsx` defines all routes with `ProtectedRoute` (role-gated) and `PublicRoute` (redirect if already logged in) guards. Dashboard pages are lazy-loaded; auth pages are eagerly loaded.
- **State management:** React Context only — `AuthContext` (auth state, login/logout/register), `ThemeContext` (dark mode via CSS custom properties), `AccessibilityContext`, `ResponsiveContext`, `WebSocketContext`.
- **API layer:** Two API clients exist:
  - `client/src/utils/api.js` — Primary. Axios instance with auth interceptor and domain-specific API objects (`authAPI`, `employeeAPI`, `companyAPI`, `reviewAPI`, `documentAPI`, `notificationAPI`, `analyticsAPI`, `auditAPI`, `consentAPI`, `adminAPI`). All API routes are prefixed with the resource name (e.g., `/auth/login`, `/reviews`, `/documents`).
  - `client/src/utils/secureAPI.js` — Enhanced client with CSRF token management. Singleton class.
- **Styling:** Tailwind CSS 3 with CSS custom properties for theming (`tailwind.config.js` defines `primary`, `secondary`, `background`, `surface`, etc. as `var(--color-*)` values). Dark mode via `class` strategy. Font: Inter.
- **Axios base URL:** Set in `App.jsx` — uses `localhost:5000` when running locally, `https://myhireshield.com` in production. Token is attached via a global axios interceptor.

### Deployment

- GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys on push to `main` via SSH to VPS.
- Deploy rebuilds client, copies dist to web root, restarts backend via PM2 (`hireshield-api`), and purges Nginx cache.
- Production domain: `myhireshield.com`

## Key Conventions

- All server modules use **ES module** syntax (`import`/`export`), configured via `"type": "module"` in both client and server `package.json`.
- Server error/status messages are written in a mix of English and Hinglish (transliterated Hindi). Maintain this style when adding new messages to the auth middleware or controllers.
- API responses follow the pattern `{ success: boolean, message: string, data?: any }`.
- Route files use `.routes.js` suffix, controllers use `.controller.js`, models use `.model.js`.
- The `server/.env` file must contain: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `EMAIL_HOST/PORT/USER/PASSWORD`, `RAZORPAY_KEY_ID/KEY_SECRET`, `FRONTEND_URL`, `PRODUCTION_URL`.
