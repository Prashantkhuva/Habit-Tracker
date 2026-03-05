📄 PRODUCT REQUIREMENTS DOCUMENT
Project: Habit Tracker API (Backend Only)

Version: 1.0
Owner: Prashant
Goal: Build first fully self-made backend project

1️⃣ PROJECT OBJECTIVE

Build a REST API that allows users to:

Register & login

Create habits

Track daily completion

View progress

Delete habits

This project must:

Use Node + Express

Use MongoDB

Follow clean folder structure

Be deployable later

2️⃣ DEVELOPMENT PHASES

We build in controlled phases.

🔹 PHASE 1 – Infrastructure (Current Phase)
Objective:

Setup server + DB connection properly.

Requirements:

Express server running

MongoDB connected via mongoose

Environment variables configured

Proper error handling on DB failure

Server should NOT start if DB fails

Deliverable:

Server runs only after successful DB connection

Clean console logs

No hardcoded secrets

🔹 PHASE 2 – User Module
Objective:

Create user system foundation.

Requirements:

User Model:

name (string, required)

email (string, required, unique)

password (string, required)

createdAt

Routes:

POST /api/users/register

POST /api/users/login

Business Logic:

Hash password before saving

Compare password on login

Return JWT token on successful login

Deliverable:

User can register

User can login

Token generated

🔹 PHASE 3 – Habit Module
Objective:

Allow authenticated users to manage habits.

Habit Model:

userId (reference)

title (string, required)

description (optional)

frequency (daily / weekly)

createdAt

Routes:

POST /api/habits

GET /api/habits

DELETE /api/habits/:id

All routes must:

Be protected (JWT middleware)

Deliverable:

Logged-in user can create habits

Only see their own habits

Delete habits

🔹 PHASE 4 – Habit Tracking Logic
Objective:

Track daily completion.

Design Decision Required:
Will you:
A) Store completed dates in array?
B) Create separate HabitLog collection?

Choose scalable option.

Routes:

PATCH /api/habits/:id/complete

GET /api/habits/:id/progress

Deliverable:

Mark habit completed

View completion history

🔹 PHASE 5 – Production Readiness

Requirements:

Central error handler middleware

Proper HTTP status codes

Clean response format

Remove console.logs

Prepare for deployment

3️⃣ NON-FUNCTIONAL REQUIREMENTS

Code must be modular

No copy-paste full tutorials

Use async/await

Proper try/catch

Use meaningful variable names

4️⃣ SUCCESS CRITERIA

Project is complete when:

A new user can register

Login

Create habits

Mark them complete

See history

All via Postman

No frontend required.

5️⃣ CURRENT TASK (RIGHT NOW)

You are in:
PHASE 1 – Infrastructure

Next actions:

Install mongoose + dotenv

Create DB connection module

Connect DB before server start

Handle connection failure properly