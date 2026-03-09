# Product Requirements Document (PRD)

## Product Name

Habit Tracker

---

# Overview

Habit Tracker is a backend system that helps users track daily habits and analyze their consistency.

The system allows users to create habits, log daily completion, track streaks, and analyze progress through dashboard analytics.

The goal of this project is to simulate a real-world SaaS habit tracking platform.

---

# Objectives

* Help users maintain daily habits
* Provide insights into user consistency
* Encourage long-term habit building
* Provide analytics through a dashboard

---

# Target Users

* Students building productive habits
* Professionals tracking routines
* Developers learning consistency
* Anyone wanting to improve discipline

---

# Core Features

## Authentication

Users must be able to securely access their accounts.

Features:

* Register account
* Login account
* JWT authentication
* Protected API routes

---

## Habit Management

Users can manage their habits.

Capabilities:

* Create habit
* Update habit
* Delete habit
* View habits

---

## Habit Categories

Habits can be grouped into categories.

Examples:

* Health
* Fitness
* Learning
* Productivity
* Mindfulness

---

## Habit Status

Habits support status tracking.

Possible states:

* active
* paused
* archived

This allows users to temporarily stop habits without deleting them.

---

## Habit Logs

Users log daily habit completion.

Example log:

```
User: 123
Habit: Workout
Date: 2026-03-10
Completed: true
```

---

## Streak Tracking

The system calculates streaks.

Types:

Current streak

Longest streak

Example:

```
Mon Tue Wed Thu
Current streak = 4
Longest streak = 10
```

---

## Dashboard Analytics

Users can view their performance metrics.

Dashboard includes:

* Total habits
* Completed habits today
* Completion rate
* Weekly completion data
* Current streak
* Longest streak

---

## Reminder System

A scheduled job runs daily to check incomplete habits.

If habits are incomplete, the system sends reminders.

---

# Backend Architecture

Technologies used:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* express-validator

---

# Database Models

### User

```
email
username
password
fullname
```

---

### Habit

```
title
description
category
status
user
```

---

### HabitLog

```
habit
user
date
completed
```

---

# API Design

RESTful API structure.

Main modules:

* Authentication
* Habits
* Habit Logs
* Dashboard

---

# Future Enhancements

Possible future features:

* Habit heatmap analytics
* Email notifications
* AI habit suggestions
* Social accountability
* Mobile app support

---

# Project Goal

The goal of this project is to demonstrate backend development skills including:

* Authentication systems
* API design
* Database modeling
* Analytics queries
* Background jobs
