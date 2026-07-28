# Development Plan

This plan splits the Hackathon Management Platform into 14 commit-friendly phases.

## Phase 1 - Project Planning And Repository Setup

- Add README, project roadmap, and `.gitignore`.
- Choose the platform name.
- Decide the first version of the UI theme and feature scope.

Suggested commit:

```text
docs: add project roadmap and setup notes
```

## Phase 2 - MERN Workspace Setup

- Create `client` React app.
- Create `server` Express app.
- Add basic scripts for frontend, backend, and concurrent development.
- Add `.env.example` files.

Suggested commit:

```text
chore: scaffold client and server apps
```

## Phase 3 - Backend Foundation

- Connect Express to MongoDB.
- Add global error handling.
- Add request logging.
- Add health check route.
- Set up clean folders: `routes`, `controllers`, `models`, `middleware`, `config`, `utils`.

Suggested commit:

```text
feat(server): add express and database foundation
```

## Phase 4 - User Model And Authentication

- Add `User` model with roles: `admin`, `organizer`, `participant`, `judge`.
- Implement signup, login, logout flow.
- Hash passwords with bcrypt.
- Issue JWT tokens.
- Add backend validation for duplicate email and invalid credentials.

Suggested commit:

```text
feat(auth): implement user registration and login
```

## Phase 5 - Authorization And Protected Routes

- Add authentication middleware.
- Add role-based authorization middleware.
- Protect admin, organizer, participant, and judge APIs.
- Add frontend route guards.

Suggested commit:

```text
feat(auth): add protected and role based routes
```

## Phase 6 - Frontend Layout And Core Pages

- Add reusable layout components.
- Add Home, Login, Signup, Profile, Dashboard, 404 pages.
- Add responsive navigation based on login state and role.
- Add loading, empty, success, and error UI states.

Suggested commit:

```text
feat(client): add app layout and core pages
```

## Phase 7 - Hackathon Module

- Add Hackathon model and CRUD APIs.
- Allow organizers to create, edit, delete, open, and close their hackathons.
- Add hackathon listing and detail pages.
- Add search and filters for mode, theme, status, and registration state.

Suggested commit:

```text
feat(hackathons): add hackathon management
```

## Phase 8 - Registration Module

- Add Registration model.
- Allow participants to register and cancel registration.
- Allow organizers to approve or reject teams.
- Show registration status to participants.

Suggested commit:

```text
feat(registrations): add hackathon registration workflow
```

## Phase 9 - Team Management

- Add Team model.
- Allow participants to create teams, invite members, remove members, leave teams, transfer leadership, and delete teams.
- Allow organizers to view registered teams.

Suggested commit:

```text
feat(teams): add participant team management
```

## Phase 10 - Submission Module

- Add Submission model.
- Allow teams to submit project details, repository links, demo URLs, screenshots, presentation PDF links, and demo video links.
- Allow editing before the deadline.
- Track submission statuses: pending, under review, approved, rejected.

Suggested commit:

```text
feat(submissions): add project submission workflow
```

## Phase 11 - Judge Evaluation Module

- Add Review model.
- Assign judges to hackathons or submissions.
- Allow judges to score submissions by criteria.
- Allow judges to add comments and submit evaluations.

Suggested commit:

```text
feat(judging): add project evaluation workflow
```

## Phase 12 - Leaderboard And Results

- Calculate total scores.
- Display rank, team name, project name, total score, and position.
- Allow organizers to publish results and announce winners.

Suggested commit:

```text
feat(results): add leaderboard and winner publishing
```

## Phase 13 - Role Dashboards And Analytics

- Build admin, organizer, participant, and judge dashboards.
- Add summary cards for users, hackathons, teams, submissions, reviews, and results.
- Add basic analytics charts if time allows.

Suggested commit:

```text
feat(dashboards): add role based dashboard summaries
```

## Phase 14 - Polish, Testing, Documentation, And Deployment

- Test APIs before frontend integration.
- Check responsive UI on mobile and desktop.
- Add API documentation.
- Add database schema notes.
- Add screenshots.
- Prepare project report and deployment.

Suggested commit:

```text
docs: add api docs schema notes and final project assets
```
