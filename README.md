# Expense Tracker

A full-featured expense and income tracking application built with React, Node.js, Express, and MongoDB. Track your finances with beautiful charts, comprehensive filtering, and recurring transaction support.

## 🎯 Features

- **User Authentication** — Secure signup/login with JWT tokens
- **Dashboard** — Summary cards showing total income, expenses, balance, and transaction count
- **Transaction Management** — Create, read, update, and delete transactions
- **Advanced Filtering** — Filter transactions by type, category, and date range
- **Recurring Transactions** — Set up daily, weekly, or monthly recurring transactions
- **Analytics Hub** — Three interactive charts:
  - Spending by Category (Pie Chart)
  - Monthly Income vs Expense (Bar Chart)
  - Daily Spending Trend (Line Chart)
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** — Built with Tailwind CSS for a clean, intuitive interface

## 📁 Project Structure

```
expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx           # Login & Signup page
│   │   │   ├── DashboardPage.jsx      # Dashboard with summary cards
│   │   │   ├── TransactionsPage.jsx   # Transactions list with filters
│   │   │   ├── AddTransactionPage.jsx # Add transaction form
│   │   │   └── ChartsPage.jsx         # Analytics dashboard
│   │   ├── components/
│   │   │   └── Navbar.jsx             # Responsive navigation
│   │   ├── api.js                     # Axios client with interceptors
│   │   ├── App.js                     # Main router component
│   │   ├── index.js                   # React entry point
│   │   └── index.css                  # Global styles with Tailwind
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   └── package.json                   # Frontend dependencies
│
└── backend/
    ├── models/
    │   ├── User.js                    # User schema with role support
    │   └── Expense.js                 # Transaction/Expense schema
    ├── routes/
    │   ├── authRoutes.js              # Authentication endpoints
    │   ├── transactionRoutes.js       # CRUD endpoints for transactions
    │   └── summaryRoutes.js           # Aggregation endpoints for analytics
    ├── middleware/
    │   └── authMiddleware.js          # JWT token verification
    ├── server.js                      # Express server setup
    ├── .env                           # Environment variables
    └── package.json                   # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Environment Setup

#### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/expense-tracker

# JWT secret key (use a strong random string in production)
JWT_SECRET=your_very_strong_secret_key_here_12345

# Server port
PORT=5000
```

#### Frontend Configuration

The frontend is already configured to proxy API calls to `http://localhost:5000` via the `proxy` field in `package.json`.

### Installation

1. **Clone the repository**
   ```bash
   cd EXPENSE TRACKER
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Start the Backend (from `backend/` directory)

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`.

#### Start the Frontend (from `frontend/` directory)

In a new terminal:

```bash
npm start
```

The frontend will open at `http://localhost:3000`.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_mongo_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/auth/login`
Log in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_mongo_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Transaction Endpoints

All transaction endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

#### POST `/expenses/`
Create a new transaction (income or expense).

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 1500,
  "type": "expense",
  "category": "Food",
  "date": "2026-04-14",
  "notes": "Weekly grocery shopping",
  "isRecurring": false,
  "recurringFrequency": null
}
```

**Response (201):**
```json
{
  "_id": "transaction_id",
  "userId": "user_id",
  "title": "Grocery Shopping",
  "amount": 1500,
  "type": "expense",
  "category": "Food",
  "date": "2026-04-14",
  "notes": "Weekly grocery shopping",
  "isRecurring": false,
  "createdAt": "2026-04-14T10:00:00.000Z",
  "updatedAt": "2026-04-14T10:00:00.000Z"
}
```

#### GET `/expenses/`
Fetch all transactions for the logged-in user with optional filtering.

**Query Parameters:**
- `type` — Filter by type: `income` or `expense`
- `category` — Filter by category
- `startDate` — Filter transactions on or after this date (ISO format)
- `endDate` — Filter transactions on or before this date (ISO format)

**Example Request:**
```
GET /expenses/?type=expense&category=Food&startDate=2026-04-01&endDate=2026-04-30
```

**Response (200):**
```json
[
  {
    "_id": "transaction_id",
    "userId": "user_id",
    "title": "Grocery Shopping",
    "amount": 1500,
    "type": "expense",
    "category": "Food",
    "date": "2026-04-14",
    "notes": "Weekly grocery shopping",
    "isRecurring": false,
    "createdAt": "2026-04-14T10:00:00.000Z",
    "updatedAt": "2026-04-14T10:00:00.000Z"
  }
]
```

#### GET `/expenses/:id`
Fetch a single transaction by ID.

**Response (200):**
```json
{
  "_id": "transaction_id",
  "userId": "user_id",
  "title": "Grocery Shopping",
  "amount": 1500,
  "type": "expense",
  "category": "Food",
  "date": "2026-04-14",
  "notes": "Weekly grocery shopping",
  "isRecurring": false,
  "createdAt": "2026-04-14T10:00:00.000Z",
  "updatedAt": "2026-04-14T10:00:00.000Z"
}
```

#### PUT `/expenses/:id`
Update an existing transaction.

**Request Body:** (any field is optional)
```json
{
  "title": "Grocery Shopping Updated",
  "amount": 1600,
  "notes": "Updated notes"
}
```

**Response (200):** Updated transaction object

#### DELETE `/expenses/:id`
Delete a transaction.

**Response (200):**
```json
{
  "message": "Transaction deleted successfully"
}
```

### Summary & Analytics Endpoints

#### GET `/summary/`
Get dashboard summary (total income, expense, balance, transaction count).

**Response (200):**
```json
{
  "totalIncome": 50000,
  "totalExpense": 15000,
  "balance": 35000,
  "transactionCount": 23
}
```

#### GET `/summary/category`
Get spending breakdown grouped by category.

**Response (200):**
```json
[
  {
    "_id": "Food",
    "total": 5000,
    "count": 8,
    "type": "expense"
  },
  {
    "_id": "Transport",
    "total": 3000,
    "count": 5,
    "type": "expense"
  }
]
```

#### GET `/summary/monthly`
Get income and expense aggregated by month for the last 6 months.

**Response (200):**
```json
[
  {
    "_id": {
      "month": 10,
      "year": 2025
    },
    "income": 50000,
    "expense": 15000
  },
  {
    "_id": {
      "month": 11,
      "year": 2025
    },
    "income": 50000,
    "expense": 16000
  }
]
```

#### GET `/summary/daily`
Get daily spending trend for the current month.

**Response (200):**
```json
[
  {
    "_id": {
      "year": 2026,
      "month": 4,
      "day": 1
    },
    "total": 500
  },
  {
    "_id": {
      "year": 2026,
      "month": 4,
      "day": 2
    },
    "total": 1200
  }
]
```

## 🛠️ Technology Stack

### Frontend
- **React 19** — JavaScript library for building user interfaces
- **React Router v7** — Client-side routing
- **Tailwind CSS v4** — Utility-first CSS framework
- **Axios** — HTTP client with JWT interceptors
- **Chart.js** — JavaScript charting library
- **React-ChartJS-2** — React wrapper for Chart.js

### Backend
- **Node.js** — JavaScript runtime
- **Express.js v4** — Web application framework
- **MongoDB v8** — NoSQL database
- **Mongoose** — MongoDB object modeling
- **JWT (jsonwebtoken)** — Token-based authentication
- **bcryptjs** — Password hashing
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment variable management
- **Nodemon** — Development auto-reload (dev dependency)

## 🔐 Security Features

- ✅ JWT-based authentication with 7-day expiration
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ CORS restricted to `http://localhost:3000`
- ✅ Protected API routes with authentication middleware
- ✅ User-scoped data (users can only access their own transactions)
- ✅ Role-based access control setup (for future admin features)
- ✅ Environment variable management for sensitive data

## 📱 Supported Categories

### Income Categories
- Salary
- Freelance
- Other Income

### Expense Categories
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Other

## 🎨 UI Features

- **Fully Responsive Design** — Mobile-first approach with Tailwind CSS breakpoints
- **Dark & Light Mode Ready** — Tailwind CSS utilities support theming
- **Interactive Charts** — Real-time analytics with Chart.js
- **Form Validation** — Client-side validation with helpful error messages
- **Loading States** — Better UX with loading indicators
- **Confirmation Dialogs** — Prevent accidental deletions
- **Color-coded Transactions** — Income in green, expenses in red

## 🗓️ Recurring Transactions (Feature Setup)

The application supports marking transactions as recurring with frequency options:
- **Daily** — Repeats every day
- **Weekly** — Repeats every week
- **Monthly** — Repeats every month

> Note: Automatic recurring transaction generation is ready for backend implementation.

## 📊 Dashboard & Analytics

### Dashboard Page
- Total income card
- Total expense card
- Current balance card
- Total transaction count

### Analytics Page
- **Pie Chart** — Category-wise spending breakdown
- **Bar Chart** — Monthly income vs. expense comparison (6 months)
- **Line Chart** — Daily spending trend for the current month

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` (macOS/Linux) or start MongoDB service (Windows)
- Verify `MONGO_URI` in `.env` file

### JWT Token Errors
- Check that `JWT_SECRET` is set in `.env`
- Ensure token is not expired (7-day expiration)
- Verify `Authorization` header format: `Bearer <token>`

### CORS Errors
- Frontend must run on `http://localhost:3000`
- Backend CORS is configured to accept requests only from `http://localhost:3000`

### Tailwind CSS Not Loading
- Run `npm install` in the frontend directory
- Ensure `tailwind.config.js` and `postcss.config.js` are in the frontend root
- Verify `@tailwind` directives are in `index.css`

## 📝 Scripts

### Backend
```bash
npm start    # Start production server
npm run dev  # Start development server with nodemon
```

### Frontend
```bash
npm start    # Start development server
npm build    # Build for production
npm test     # Run tests
```

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
2. Deploy from Git or use platform CLI

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build: `npm run build`
2. Deploy the `build/` folder

## 📧 Support & Contribution

For issues, questions, or contributions, please open an issue or submit a pull request.

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Tracking! 💹**
