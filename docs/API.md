# API Documentation

Base URL for local development:

```text
http://localhost:5000/api
```

Protected routes require:

```text
Authorization: Bearer <jwt_token>
```

## Health

- `GET /health` - API health check.

## Authentication

- `POST /auth/signup` - Create a user account.
- `POST /auth/login` - Login and receive a JWT.
- `POST /auth/logout` - Client logout helper endpoint.
- `GET /auth/me` - Get the current authenticated user.

## Hackathons

- `GET /hackathons` - List hackathons with optional `search`, `mode`, `theme`, `status`, `timeline`, and `registration` query filters.
- `GET /hackathons/:id` - Get one hackathon.
- `POST /hackathons` - Organizer/admin create hackathon.
- `PUT /hackathons/:id` - Organizer/admin update own hackathon.
- `DELETE /hackathons/:id` - Organizer/admin delete own hackathon.

## Registrations

- `POST /registrations/hackathons/:hackathonId` - Participant registers for a hackathon.
- `GET /registrations/me` - Participant views registrations.
- `DELETE /registrations/:id` - Participant cancels registration.
- `GET /registrations/hackathons/:hackathonId` - Organizer/admin views registrations.
- `PATCH /registrations/:id/review` - Organizer/admin approves or rejects registration.

## Teams

- `POST /teams` - Participant creates a team.
- `GET /teams/me` - Participant views their teams.
- `GET /teams/hackathons/:hackathonId` - Organizer/admin views teams for a hackathon.
- `GET /teams/:id` - View team details.
- `PUT /teams/:id` - Team leader updates details.
- `POST /teams/:id/members` - Team leader adds a participant by email.
- `DELETE /teams/:id/members/:userId` - Team leader removes a member.
- `POST /teams/:id/leave` - Member leaves a team.
- `PATCH /teams/:id/leadership` - Team leader transfers leadership.
- `DELETE /teams/:id` - Team leader deletes team.

## Submissions

- `POST /submissions` - Team leader submits a project.
- `GET /submissions/me` - Participant views team submissions.
- `GET /submissions/hackathons/:hackathonId` - Organizer/admin views submissions.
- `GET /submissions/:id` - View submission details.
- `PUT /submissions/:id` - Team leader edits before deadline.
- `PATCH /submissions/:id/status` - Organizer/admin updates review status.

## Reviews

- `POST /reviews/assign` - Organizer/admin assigns judge to a submission.
- `GET /reviews/assigned` - Judge views assigned reviews.
- `PATCH /reviews/:id` - Judge submits scores and feedback.
- `GET /reviews/hackathons/:hackathonId` - Organizer/admin views reviews.

## Results

- `GET /results/hackathons/:hackathonId/leaderboard` - Public leaderboard.
- `POST /results/hackathons/:hackathonId/publish` - Organizer/admin publishes results.

## Dashboard

- `GET /dashboard/summary` - Role-based dashboard counts.
