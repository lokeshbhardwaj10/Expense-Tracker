# Expense Tracker

A full-stack expense tracker application with a React frontend and Node.js/Express/MongoDB backend.

## Project Description

This app allows users to sign up, authenticate, and manage expense records. The frontend is built with React, while the backend provides REST API routes for authentication and expense CRUD operations.

## Folder Structure

- `frontend/` — React user interface and client-side logic
- `backend/` — Express API server, database models, authentication, and expense routes

## Environment Setup

Create a `.env` file in the `backend/` folder with the following values:

```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_strong_secret_here
PORT=5000
```

Then install dependencies in both folders:

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Running the Project

### Backend

From `backend/`:

```bash
npm run dev
```

This starts the backend server with `nodemon` and listens on port `5000`.

### Frontend

From `frontend/`:

```bash
npm start
```

The frontend runs on `http://localhost:3000` and proxies API requests to the backend.

## API Endpoints

### Authentication

- `POST /api/auth/signup` — Register a new user and return a JWT token.
- `POST /api/auth/login` — Log in an existing user and return a JWT token.

### Expenses

- `GET /api/expenses` — Get all expenses for the authenticated user.
- `POST /api/expenses` — Create a new expense for the authenticated user.
- `PUT /api/expenses/:id` — Update an expense by ID.
- `DELETE /api/expenses/:id` — Delete an expense by ID.

## Notes

- The frontend proxy is configured to forward API requests to `http://localhost:5000`.
- The backend only allows CORS requests from `http://localhost:3000`.
- Ensure `JWT_SECRET` is set in `backend/.env` before starting the backend.
