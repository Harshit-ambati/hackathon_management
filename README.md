# Hackathon Management Platform

CodeArena is a MERN stack capstone project for managing hackathons, teams, registrations, submissions, judging, dashboards, and leaderboards.

## Project Goal

Build a centralized platform where:

- Administrators manage users, organizers, judges, hackathons, teams, submissions, and analytics.
- Organizers create hackathons, manage registrations, assign judges, and publish results.
- Participants register, create or join teams, submit projects, and view results.
- Judges review assigned submissions and provide scores and feedback.

## Required Stack

- Frontend: React.js, React Router DOM, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT and bcrypt
- Version control: Git and GitHub

## Features Implemented

- JWT signup, login, logout, and current-user endpoint
- Role-based protected routes for admin, organizer, participant, and judge
- Hackathon CRUD with search and filters
- Participant registration with organizer approval workflow
- Team creation, member management, leave team, transfer leadership, and delete team
- Project submission workflow with status management
- Judge assignment and criteria-based project reviews
- Leaderboard calculation and result publishing
- Dynamic dashboard summaries for each role
- Responsive frontend pages with loading, empty, error, and fallback states

## Local Setup

Install dependencies:

```bash
npm install
```

Create `server/.env` using `server/.env.example`:

```text
PORT=5000
MONGO_URI=<your mongodb connection string>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run frontend and backend together:

```bash
npm run dev
```

Run checks:

```bash
npm run lint --workspace client
npm run build --workspace client
npm audit --workspaces
```

## Documentation

- [Development Plan](./DEVELOPMENT_PLAN.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Project Report Notes](./docs/PROJECT_REPORT_NOTES.md)

## Development Rule

This repository was built phase by phase with meaningful commits. Each phase should be understandable, testable, and explainable during evaluation.
