# Habit Tracker – Product Requirements Document (PRD)

## 1. Overview

Habit Tracker is a full-stack web application that helps users build and maintain daily habits.
Users can create habits, mark them as completed, track streaks, and analyze their progress using dashboard analytics.

The goal of the project is to simulate a real SaaS-style habit tracking platform with authentication, analytics, and habit management features.

---

## 2. Objectives

* Help users track daily habits consistently
* Provide progress insights through analytics
* Encourage long-term consistency using streak tracking
* Build a production-style backend system for learning full-stack development

---

## 3. Target Users

* Students building productivity habits
* Developers learning consistency
* Individuals tracking daily routines
* Anyone wanting to improve daily discipline

---

## 4. Core Features

### 4.1 Authentication System

Users must be able to securely access their accounts.

Features:

* User registration
* User login
* JWT authentication
* Secure protected routes

---

### 4.2 Habit Management

Users can manage their personal habits.

Features:

* Create a habit
* Update a habit
* Delete a habit
* View all habits
* Pagination support

Habit example:

```
Workout
Read 10 pages
Meditation
```

---

### 4.3 Habit Status

Each habit can have a status.

Status values:

```
active
paused
archived
```

Purpose:

* Active habits appear in dashboard
* Paused habits temporarily stop tracking
* Archived habits are stored but hidden

---

### 4.4 Habit Categories

Habits can be grouped into categories.

Examples:

```
Health
Fitness
Learning
Productivity
Mindfulness
```

Example:

```
Workout → Fitness
Reading → Learning
Meditation → Health
```

---

### 4.5 Habit Completion Logs

Users mark habits as completed each day.

Example log:

```
User: 123
Habit: Workout
Date: 2026-03-06
Completed: true
```

These logs power the analytics features.

---

### 4.6 Streak System

The system calculates streaks based on habit completion.

Types:

**Current Streak**
Number of consecutive days the habit is currently maintained.

**Longest Streak**
The highest streak the user has ever achieved.

Example:

```
Mon Tue Wed Thu
Current streak = 4
Longest streak = 7
```

---

### 4.7 Dashboard Analytics

The dashboard provides user insights.

Features:

* Total habits
* Total completions
* Current streak
* Longest streak
* Weekly completion statistics

---

### 4.8 Weekly Completion Chart

Displays the number of habits completed each day of the week.

Example data:

```
Mon → 3
Tue → 2
Wed → 4
Thu → 1
Fri → 0
Sat → 2
Sun → 3
```

Implementation uses MongoDB aggregation pipeline:

* `$match`
* `$group`

---

## 5. Backend Architecture

Backend built using:

* Node.js
* Express.js
* MongoDB
* Mongoose

Main modules:

```
Auth Controller
Habit Controller
Habit Log Controller
Dashboard Controller
```

---

## 6. API Endpoints

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

## 7. Database Design

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

Indexes:

```
userId
habitId
date
```

---

## 8. Deployment Plan

Backend deployment:

* Node.js API hosted on Render or Railway
* MongoDB Atlas for database

Example API URL:

```
https://habit-tracker-api.onrender.com
```

---

## 9. Frontend (Future Phase)

Frontend built using React.

Pages:

```
Login
Register
Dashboard
Habits List
Habit Progress
Analytics
```

Charts:

* Weekly completion chart
* Streak visualization

---

## 10. Future Improvements

Potential upgrades:

* Reminder notifications
* Mobile app
* Habit sharing
* Social accountability
* Monthly heatmap like GitHub contributions

---

## 11. Project Goal

The purpose of this project is to build a **production-style full-stack application** demonstrating:

* Authentication systems
* REST API design
* MongoDB aggregation
* Data analytics features
* Scalable backend architecture
