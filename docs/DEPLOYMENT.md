# Deployment Guide

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

## Production Notes

- Rotate any database password shared during development.
- Use a strong production `JWT_SECRET`.
- Add the deployed frontend URL to `CLIENT_URL`.
- Add the backend URL to `client/.env` as `VITE_API_BASE_URL`.
- Keep `.env` files out of Git.

## Suggested Hosting

- Frontend: Vercel or Netlify.
- Backend: Render, Railway, or a Node-capable VPS.
- Database: MongoDB Atlas.
