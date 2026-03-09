# Habit Tracker API

A backend application that helps users build and maintain daily habits.
Users can create habits, track daily completion, analyze progress, and maintain streaks.

This project is built using **Node.js, Express.js, and MongoDB**.

---

# Features

### Authentication

* User registration
* User login
* JWT based authentication
* Secure protected routes

### Habit Management

* Create habits
* Update habits
* Delete habits
* Get all user habits

### Habit Status

Each habit can have a status:

* active
* paused
* archived

This helps users temporarily stop or archive habits.

---

### Habit Categories

Habits can be grouped by categories:

* Health
* Fitness
* Learning
* Productivity
* Mindfulness

Example:

```
Workout → Fitness
Reading → Learning
Meditation → Health
```

---

### Habit Logs

Users mark habits as completed daily.

Example log:

```
Habit: Workout
Date: 2026-03-10
Completed: true
```

---

### Streak System

The system tracks:

**Current Streak**

Number of consecutive days the habit has been completed.

**Longest Streak**

Highest streak achieved by the user.

---

### Dashboard Analytics

Dashboard provides insights such as:

* Total habits
* Completed habits today
* Completion rate
* Weekly completion data
* Current streak
* Longest streak

---

### Reminder System

The backend runs a scheduled job using **node-cron** that reminds users to complete habits if they have not completed them by the end of the day.

---

# Tech Stack

Backend:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* express-validator

---

# Project Structure

```
src
 ├── controllers
 ├── models
 ├── routes
 ├── middlewares
 ├── validators
 ├── jobs
 ├── utils
 └── config
```

---

# API Routes

### Auth

```
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/logout
POST /api/v1/users/change-password
PATCH /api/v1/users/update-details
```

---

### Habits

```
POST   /api/v1/habits/create-habit
GET    /api/v1/habits/get-habits
PATCH  /api/v1/habits/update-habit/:habitId
PATCH  /api/v1/habits/:habitId/pause
PATCH  /api/v1/habits/:habitId/resume
PATCH  /api/v1/habits/:habitId/archive
```

---

### Habit Logs

```
POST /api/v1/habitlog/:habitId/complete
GET  /api/v1/habitlog/:habitId/logs
GET  /api/v1/habitlog/:habitId/streak
```

---

### Dashboard

```
GET /api/v1/dashboard/getstats
GET /api/v1/dashboard/weeklydata
GET /api/v1/dashboard/longest-streak
```

---

# Setup Instructions

### 1 Clone repository

```
git clone https://github.com/Prashantkhuva/Habit-Tracker.git
```

---

### 2 Install dependencies

```
npm install
```

---

### 3 Create `.env` file

```
PORT=8000
MONGODB_URI=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
```

---

### 4 Run the server

```
npm run dev
```

Server runs at:

```
http://localhost:8000
```

---

# Example Workflow

1. Register user
2. Login user
3. Create habit
4. Mark habit as completed
5. View dashboard stats

---

# Future Improvements

* Habit heatmap analytics
* Frontend dashboard (React)
* Email reminders
* Mobile support

---

# Author

Prashant Khuva

Learning backend development and building projects in public.

---

# License

This project is for learning and portfolio purposes.
