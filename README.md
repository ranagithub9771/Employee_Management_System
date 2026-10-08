# Employee Management System

Full-stack MERN-style app: **Next.js** (frontend) + **Node.js / Express** (REST API) + **MongoDB / Mongoose**, secured with **JWT + bcrypt**.

## Features
- Register, Login, Logout, JWT auth, protected routes (frontend guard + backend middleware)
- Employee CRUD: add, list, view details, edit, delete
- Dashboard: total / active / inactive employees, total departments
- Search by name/email (debounced), filter by department and status, pagination
- Loading, error and validation states (client-side + server-side)

## Project structure
```
backend/    Express API  (models, controllers, routes, middleware)
frontend/   Next.js 14 app router (pages, components, context, lib)
postman/    Postman collection
```

## Prerequisites
Node.js 18+, and MongoDB (local install or a free MongoDB Atlas cluster).

## Local setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit values (MONGO_URI, JWT_SECRET)
npm run dev              # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                  # http://localhost:3000
```

Open http://localhost:3000, register an account, and start adding employees.

## Environment variables

| File | Variable | Description |
|------|----------|-------------|
| backend/.env | `PORT` | API port (default 5000) |
| backend/.env | `MONGO_URI` | MongoDB connection string |
| backend/.env | `JWT_SECRET` | Long random secret for signing tokens |
| backend/.env | `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| backend/.env | `CLIENT_URL` | Allowed frontend origin(s) for CORS, comma-separated |
| frontend/.env.local | `NEXT_PUBLIC_API_URL` | Base URL of the API, including `/api` |

## API reference

Auth (public): `POST /api/auth/register`, `POST /api/auth/login`
Auth (protected): `POST /api/auth/logout`, `GET /api/auth/me`

Employees (all require `Authorization: Bearer <token>`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees?search=&department=&status=&page=&limit=` | List with search/filter/pagination |
| GET | `/api/employees/stats` | Dashboard counts + department list |
| GET | `/api/employees/:id` | Employee details |
| POST | `/api/employees` | Create |
| PUT | `/api/employees/:id` | Update |
| DELETE | `/api/employees/:id` | Delete |

Import `postman/Employee-Management-System.postman_collection.json` into Postman. Run **Register** or **Login** first; the token is saved automatically to the collection variable.

## Deployment

**Database:** create a free MongoDB Atlas cluster, allow network access (0.0.0.0/0 for testing), copy the connection string.

**Backend (Render / Railway):**
- Root directory `backend`, build `npm install`, start `npm start`
- Set env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (= your Vercel URL, no trailing slash)

**Frontend (Vercel):**
- Import the repo, set Root Directory to `frontend`
- Set `NEXT_PUBLIC_API_URL` = `https://<your-backend-url>/api`
- Deploy, then update the backend's `CLIENT_URL` with the final Vercel URL

## Live links
- Frontend: _add Vercel URL here_
- Backend API: _add Render URL here_

## Screenshots
Add images to a `screenshots/` folder and link them here: login, register, dashboard, employee list (with filters), add/edit form (with validation errors), employee details.

## Design notes
- Passwords are hashed with bcrypt (`bcryptjs`, a pure-JS implementation with the same algorithm, which avoids native build issues on hosts) and never returned by the API.
- JWT is stored in `localStorage` for simplicity; for production an httpOnly cookie is safer.
- `/api/employees/stats` is an extra endpoint powering the dashboard and department filter.
- Duplicate emails are rejected (unique index), and mongoose validation errors are mapped to per-field messages in the UI.
