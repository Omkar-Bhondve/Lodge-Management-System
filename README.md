# Lodge Management System

A full-stack lodge booking web app built with React, Node.js/Express, and PostgreSQL.

## Tech Stack

- **Frontend** — React 19, Vite, Tailwind CSS, React Router
- **Backend** — Node.js, Express 5
- **Database** — PostgreSQL
- **Auth** — JWT (JSON Web Tokens)

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/download/) v14 or higher
- Git

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Omkar-Bhondve/Lodge-Management-System.git
cd Lodge-Management-System
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Create the PostgreSQL database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE "Lodge-Management-System";
```

### 5. Configure environment variables

Inside the `server/` folder, create a `.env` file:

```bash
# server/.env
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/Lodge-Management-System

JWT_SECRET=replace-with-a-long-random-secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourPassword@123456
```

> Replace `YOUR_PASSWORD` with your PostgreSQL password.  
> `ADMIN_PASSWORD` must be at least 12 characters.

### 6. Run database migrations

```bash
cd server
npm run migrate
```

This creates the `users`, `rooms`, and `bookings` tables and seeds 4 starter rooms.

### 7. Create the admin account

```bash
npm run seed:admin
```

This creates the admin user using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`.

---

## Running the App

You need **two terminals** running at the same time:

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
```
Runs at `http://localhost:4000`

**Terminal 2 — Frontend:**
```bash
cd Lodge-Management-System
npm run dev
```
Runs at `http://localhost:5173`

---

## Admin Login

Use the credentials you set in `server/.env`:

- **Email:** value of `ADMIN_EMAIL`
- **Password:** value of `ADMIN_PASSWORD`

After logging in you'll be redirected to the admin dashboard at `/admin`.

---

## Features

- User registration and login (JWT auth)
- Browse and search rooms by city or name
- Room detail page with Reserve button
- Booking with check-in/check-out dates and guest count
- Pay at counter — no online payment
- My Bookings page for users
- Admin dashboard:
  - Stats (rooms, users, active bookings, revenue)
  - All bookings with guest details, room info, dates, amount
  - Change booking status (Pending / Confirmed / Cancelled / Completed)
  - Add new rooms

---

## Project Structure

```
Lodge-Management-System/
├── src/                  # React frontend
│   ├── pages/            # Page components
│   ├── components/       # Shared components
│   ├── context/          # Auth context
│   ├── hooks/            # Custom hooks
│   └── lib/              # API helper
├── server/               # Express backend
│   ├── migrations/       # SQL migration files
│   └── src/
│       ├── routes/       # API routes
│       ├── middleware/    # Auth middleware
│       └── scripts/      # migrate + seedAdmin
└── README.md
```
