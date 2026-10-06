# Roleprint

**Know your fit before you apply.**

Roleprint helps job seekers search for jobs, check how well their CV matches a job description (JD), and track their applications.

## Project layout

| Folder | What it is | Port |
|---|---|---|
| `roleprint-client` | React + Vite + TypeScript + Tailwind | 5174 |
| `roleprint-backend` | Express + TypeScript + Prisma + PostgreSQL | 4100 |

The client proxies `/api` requests to the backend (see `roleprint-client/vite.config.ts`).

## Running locally

```bash
# 1. Backend
cd roleprint-backend
npm install
cp .env.example .env        # then set DATABASE_URL
npm run dev

# 2. Client (in a second terminal)
cd roleprint-client
npm install
npm run dev
```

Open http://localhost:5174 and go to **Match**.

## Roadmap

### Phase 1: CV vs JD match (in progress)
- [x] Match page: paste CV + JD, get score, matched and missing skills
- [x] `POST /api/match` with keyword-based scoring
- [ ] Create the database and run the first migration
- [ ] User sign-up and login (JWT)
- [ ] Save resumes and match results

### Phase 2: Smarter matching
- [ ] Upload CV as PDF/DOCX and extract the text
- [ ] AI-based scoring with a breakdown: skills, experience, responsibilities, education
- [ ] Suggestions for improving the CV for a specific JD

### Phase 3: Job search
- [ ] Search jobs from a jobs API
- [ ] Show a match score on every job in the results
- [ ] Save jobs

### Phase 4: Applications
- [ ] Track applications (Saved → Applied → Interview → Offer / Rejected)
- [ ] Notes and reminders
- [ ] Tailored cover letters

## Brand checklist
- [ ] Run the IP India trademark search for ROLEPRINT (classes 9, 35, 42)
- [ ] Register roleprint.in, roleprint.ai / roleprint.app, roleprint.io
- [ ] Claim @roleprint on Instagram, X, LinkedIn, YouTube, GitHub
