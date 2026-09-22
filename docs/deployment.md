# HIGH SCHOOL YOUTH CLUB — PRODUCTION DEPLOYMENT & DEVOPS GUIDE

## Architecture Overview
The application is structured as a monorepo containing two decoupled, independently deployable services:
1. **Frontend**: Next.js 14+ (App Router) — Optimized for Vercel, Netlify, or Docker Node.js container.
2. **Backend**: Express.js REST API with TypeScript — Optimized for Railway, Render, Fly.io, AWS ECS, or DigitalOcean App Platform.

---

## 1. Environment Configuration

### Backend Environment Variables (`backend/.env`)
```env
# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://highschoolyouthclub.org

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/high_school_youth_club?retryWrites=true&w=majority

# Supabase Identity
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Email Notifications (Resend)
RESEND_API_KEY=re_<your-resend-key>
EMAIL_FROM="High School Youth Club <notifications@highschoolyouthclub.org>"
SUPER_ADMIN_EMAIL=superadmin@highschoolyouthclub.org
```

### Frontend Environment Variables (`frontend/.env.local` or Vercel Environment)
```env
NEXT_PUBLIC_APP_URL=https://highschoolyouthclub.org
NEXT_PUBLIC_API_URL=https://api.highschoolyouthclub.org/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## 2. Deployment Instructions

### Option A: Vercel (Frontend) + Railway (Backend)

#### Backend on Railway:
1. Link your GitHub repository on Railway.
2. Set Root Directory to `/backend`.
3. Build Command: `npm run build`
4. Start Command: `npm run start`
5. Add all Backend Environment Variables under Variables tab.
6. Generate public domain (e.g. `api.highschoolyouthclub.org`).

#### Frontend on Vercel:
1. Import repository in Vercel.
2. Set Root Directory to `frontend`.
3. Framework Preset: `Next.js`.
4. Add all Frontend Environment Variables under Environment Variables.
5. Deploy.

---

### Option B: Docker Container Deployment

#### Backend Dockerfile (`backend/Dockerfile`):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

#### Frontend Dockerfile (`frontend/Dockerfile`):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 3. Post-Deployment Verification Checklist
- [ ] Verify `GET /api/v1/health` returns `status: "healthy"` and `database: "connected"`.
- [ ] Test registration flow with a new volunteer email.
- [ ] Confirm user profile row is created in MongoDB upon registration.
- [ ] Test Cloudinary signed upload from the Admin Gallery page.
- [ ] Verify rate limiting blocks after exceeding thresholds.
- [ ] Test Contact Form submission and notification delivery.
