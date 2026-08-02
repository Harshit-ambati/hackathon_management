# Deployment Guide

## Current Deployment Resources

Render backend service created:

```text
https://codearena-api-12d4.onrender.com
```

Render dashboard:

```text
https://dashboard.render.com/web/srv-d9nliv142hec73fstr4g
```

Important: Render builds from GitHub `main`. If the local branch is ahead of `origin/main`, push the local commits before relying on the deployed backend.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `server/.env` from `server/.env.example`:

```text
PORT=5000
MONGO_URI=<your mongodb atlas connection string>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run both apps:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000/api/health
```

## Sample Users And Smoke Checks

Run the offline model and validator smoke test:

```bash
npm run smoke:models --workspace server
```

Seed sample users into the configured MongoDB database:

```bash
npm run seed --workspace server
```

Sample seeded login accounts:

```text
admin@codearena.test / Password123
organizer@codearena.test / Password123
judge@codearena.test / Password123
participant1@codearena.test / Password123
participant2@codearena.test / Password123
```

The seed script creates a sample hackathon, approved registrations, a team, a submission, and a completed judge review.

## Render Backend

Service settings:

```text
Runtime: Node
Build command: npm install
Start command: npm run start --workspace server
Branch: main
```

Required environment variables:

```text
NODE_ENV=production
MONGO_URI=<mongodb atlas connection string>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<comma-separated frontend origins>
```

After the frontend is deployed, update `CLIENT_URL` on Render to include the real Vercel URL.

## Vercel Frontend

The repo includes `vercel.json` for the React SPA build:

```text
Build command: npm install && npm run build --workspace client
Output directory: client/dist
```

Set this Vercel environment variable:

```text
VITE_API_BASE_URL=https://codearena-api-12d4.onrender.com/api
```

Then deploy the frontend from the repo after pushing the latest commits:

```bash
vercel --prod
```

## Production Notes

- Rotate any database password shared during development.
- Use a strong production `JWT_SECRET`.
- Add the deployed frontend URL to Render `CLIENT_URL`.
- Add the Render backend URL to Vercel as `VITE_API_BASE_URL`.
- Keep `.env` files out of Git.
