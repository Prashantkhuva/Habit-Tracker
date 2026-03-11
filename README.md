# Habit Tracker API

A production-ready backend API for tracking habits, streaks, and analytics.
Built using **Node.js, Express.js, and MongoDB** with JWT authentication.

---

## Live API

Base URL

```
https://habit-tracker-t0o0.onrender.com/api/v1
```

Health Check

```
https://habit-tracker-t0o0.onrender.com/api/v1/healthcheck
```

---

# Features

* User Authentication (JWT)
* Habit CRUD
* Habit Completion Logs
* Habit Streak Tracking
* Weekly Analytics
* Dashboard Statistics
* Secure API Routes
* Validation Middleware
* Error Handling
* Production Deployment

---

# Tech Stack

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Authentication

* JWT (Access + Refresh Token)

Tools

* Postman
* Render Deployment

---

# Installation

Clone repository

```
git clone https://github.com/Prashantkhuva/Habit-Tracker.git
```

Install dependencies

```
npm install
```

Create `.env` file

```
PORT=5000
MONGODB_URL=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
```

Run server

```
npm run dev
```

---

# API Endpoints

## User Routes

### Register

POST `/api/v1/users/register`

Body

```
{
 "username": "prashantkhuva",
 "email": "prashant@user.com",
 "password": "password1234"
}
```

---

### Login

POST `/api/v1/users/login`

```
{
 "email": "prashant@user.com",
 "password": "password1234"
}
```

---

### Refresh Token

POST `/api/v1/users/refresh-token`

---

### Logout

POST `/api/v1/users/logout`

Authorization required

```
Bearer TOKEN
```

---

# Habit Routes

### Create Habit

POST `/api/v1/habits/create-habit`

```
{
 "title": "Cycling",
 "category": "Fitness",
 "description": "Daily workout",
 "frequency": "daily"
}
```

---

### Get Habits

GET `/api/v1/habits/get-habits`

---

### Update Habit

PATCH `/api/v1/habits/update-habit/:habitId`

---

### Delete Habit

DELETE `/api/v1/habits/delete-habit`

---

# Habit Log Routes

### Complete Habit

POST

```
/api/v1/habitlog/:habitId/complete
```

---

### Habit Logs

GET

```
/api/v1/habitlog/:habitId/logs
```

---

### Habit Streak

GET

```
/api/v1/habitlog/:habitId/streak
```

---

# Dashboard Routes

### Dashboard Stats

GET

```
/api/v1/dashboard/getstats
```

---

### Longest Streak

GET

```
/api/v1/dashboard/longest-streak
```

---

### Weekly Data

GET

```
/api/v1/dashboard/weeklydata
```

---

# Testing API

Import the **Postman collection** provided in this repository.

```
postman_collection.json
```

---

# Author

Prashant Khuva

Backend Developer
Learning in public 🚀
