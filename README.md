# Habit Tracker API

A backend system for tracking daily habits, monitoring streaks, and analyzing progress through dashboard analytics.

This project is built as a **SaaS-style habit tracking backend** using Node.js and MongoDB.
It demonstrates authentication, REST API design, analytics endpoints, and habit tracking logic.

---

## Features

### Authentication

* User registration
* User login
* JWT authentication
* Protected routes

### Habit Management

* Create habits
* Update habits
* Delete habits
* View all habits
* Pagination support

### Habit Status

Each habit can have a status:

* active
* paused
* archived

This allows users to temporarily pause or archive habits.

---

### Habit Categories

Habits can be organized into categories such as:

* Health
* Fitness
* Learning
* Productivity
* Mindfulness

Example:

Workout → Fitness
Reading → Learning

---

### Habit Completion Logs

Users mark habits as completed each day.

Example log:

```
Habit: Workout
Date: 2026-03-06
Completed: true
```

---

### Streak System

The application calculates:

**Current Streak**

Number of consecutive days the habit has been completed.

**Longest Streak**

Highest streak the user has ever achieved.

Example:

```
Mon Tue Wed Thu
Current streak = 4
Longest streak = 7
```

---

### Dashboard Analytics

The dashboard provides statistics such as:

* Total habits
* Total completions
* Current streak
* Longest streak

---

### Weekly Completion Chart

Shows how many habits were completed each day of the week.

Example:

```
Mon → 3
Tue → 2
Wed → 4
Thu → 1
Fri → 0
Sat → 2
Sun → 3
```

This feature uses MongoDB aggregation.

---

## Tech Stack

Backend built using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## Project Structure

```
src
 ├── controllers
 ├── models
 ├── routes
 ├── middlewares
 ├── utils
 └── app.js
```

Main controllers:

* Auth Controller
* Habit Controller
* Habit Log Controller
* Dashboard Controller

---

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

### Habits

```
POST /api/habits
GET /api/habits
PATCH /api/habits/:id
DELETE /api/habits/:id
```

---

### Habit Logs

```
POST /api/habit-log
GET /api/habit-log/:habitId
```

---

### Dashboard

```
GET /api/dashboard/stats
GET /api/dashboard/weekly-chart
GET /api/dashboard/streak
```

---

## Database Schema

### User

```
name
email
password
```

### Habit

```
title
category
status
userId
createdAt
```

### HabitLog

```
habitId
userId
date
completed
```

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/yourusername/habit-tracker.git
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Create environment file

Create a `.env` file and add:

```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 4. Run the server

```
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## Future Improvements

Planned features:

* Reminder notifications
* Monthly habit heatmap
* Mobile-friendly frontend
* Social habit sharing

---

## Author

Prashant Khuva

Full Stack Developer (Learning Phase)

---

## License

This project is for educational and portfolio purposes.
