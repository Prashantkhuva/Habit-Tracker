![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![License](https://img.shields.io/badge/License-MIT-blue)

# Habit Tracker API

A production-ready backend API for tracking habits, streaks, and analytics.
Built using **Node.js, Express.js, and MongoDB** with authentication, cron reminders, and analytics.

---

## Features

* User authentication with JWT
* Create / update / delete habits
* Habit completion logs
* Streak tracking
* Weekly analytics
* Dashboard statistics
* Automated reminder jobs using cron
* Request logging with Winston
* Security middleware and validation
* MongoDB indexing and query optimization

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Node Cron
* Winston Logger

---

## Installation

```bash
git clone https://github.com/Prashantkhuva/Habit-Tracker.git
cd Habit-Tracker
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file using `.env.example`.

---

## API Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register user       |
| POST   | /api/auth/login    | Login user          |
| POST   | /api/habits        | Create habit        |
| GET    | /api/habits        | Get all habits      |
| PATCH  | /api/habits/:id    | Update habit        |
| DELETE | /api/habits/:id    | Delete habit        |
| POST   | /api/logs          | Mark habit complete |

---

## System Architecture

This project follows a **modular backend architecture**:

* Controllers → handle requests and responses
* Services → business logic
* Models → database schemas
* Middleware → authentication, validation, logging
* Jobs → scheduled tasks (cron reminders)

Architecture diagrams are available in the `/docs` folder.

---

## Logging

Logging is implemented using **Winston**:

* Console logs
* File logs
* MongoDB logs

---

## Author

Prashant Khuva
Learning backend development in public 🚀
