# HIGH SCHOOL YOUTH CLUB — NEPALI YOUTH CLUB PORTAL
> **"युवा सशक्तीकरण, समाज रूपान्तरण"**

A client-ready, enterprise-grade full-stack portal built for **High School Youth Club (Nepali Youth Club)**. Engineered with a decoupled Next.js 14+ frontend and Express.js REST API backend, featuring Supabase Auth, Cloudinary signed media uploads, MongoDB Atlas database with Mongoose schemas, and strict Role-Based Access Control (RBAC).

---

## 🌟 Key Features

### Public Portal
- **Rich Visual Homepage**: Dynamic Hero with Nepali motifs, metrics bar, upcoming event countdowns, urgent notice bulletin bar, core impact pillar cards, and community gallery spotlight.
- **Events Calendar**: Filterable by event type (cultural, sports, social, educational), SEO-friendly detail pages, and attendee RSVP registration modal.
- **Notices & Bulletins**: Real-time alerts with pinned announcements, priority levels (urgent, high, medium, low), and official file attachment downloads.
- **Club Activities Directory**: Showcase of environmental cleanups, tree planting, health & blood donation drives, and youth tournaments.
- **Photo & Media Vault**: Responsive masonry grid gallery with full-screen image lightbox viewer.
- **Executive Board & Roster**: Official leadership directory showing executive roles, designations, contact details, and member bios.
- **Interactive Contact**: Verified contact inquiry form with non-blocking admin notification emails.
- **SEO Ready**: Automatic dynamic `sitemap.xml`, `robots.txt`, and OpenGraph metadata.

### Administrative Control Portal (`/admin`)
- **Protected Layout & RBAC Shell**: Route-level protection for `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER`, and `EVENT_MANAGER`.
- **Overview Dashboard**: High-level metrics for total events, active notices, media count, and club members with quick action shortcuts.
- **Events Manager**: Full CRUD, live publishing toggles, and date/location pickers.
- **Notice Broadcaster**: Real-time pin-to-top toggles, priority tagging, and notice publication.
- **Cloudinary Media Vault**: Signed direct-to-CDN file uploads with drag-and-drop preview and deletion.
- **Member Directory Manager**: Manage executive positions, roles, contact numbers, and profile photos.
- **Site Content CMS**: Live customizer for Homepage Hero, About, Mission, and Contact sections without code deployment.
- **Inquiry Inbox**: Review messages submitted via the public contact form, mark read/unread, and archive.
- **User & Role Management**: Promote users, assign RBAC permissions, or suspend accounts.
- **Immutable Audit Trail**: Security audit logging recording every admin action, timestamp, IP address, and metadata diff.

---

## 🏗️ System Architecture

```
/ (Monorepo Root)
├── frontend/                     # Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui
│   ├── app/
│   │   ├── (public)/             # Public pages (Home, About, Events, Activities, Gallery, Notices, Members, Contact)
│   │   ├── admin/                # Admin Portal (Dashboard, Events, Notices, Gallery, Members, Content, Users, Audit)
│   │   ├── auth/                 # Auth pages (Login, Register, Reset Password)
│   │   ├── layout.tsx            # Root Layout with Font & Auth Providers
│   │   ├── sitemap.ts            # Dynamic XML Sitemap
│   │   └── robots.ts             # Robots.txt
│   ├── components/               # Navbar, Footer, PageHeader, StatCard, DataTable, ImageUploader
│   │   ├── ui/                   # shadcn/ui primitives (Button, Dialog, Badge, Card, Select, etc.)
│   │   └── admin/                # AdminSidebar, AdminHeader, AdminShell
│   ├── hooks/                    # use-queries.ts (TanStack Query hooks)
│   ├── lib/                      # api-client.ts, supabase.ts, auth-context.tsx
│   └── types/                    # Shared TypeScript interfaces
├── backend/                      # Node.js, Express.js, TypeScript, Mongoose, Zod
│   ├── src/
│   │   ├── config/               # Database, Supabase, Cloudinary, Env configurations
│   │   ├── controllers/          # Event, Notice, Admin, User, Health controllers
│   │   ├── middleware/           # verifyAuth, requirePermission, errorHandler, rateLimiter
│   │   ├── models/               # 11 Mongoose Schemas (Event, Notice, UserProfile, Member, etc.)
│   │   ├── routes/               # Express Route definitions
│   │   ├── services/             # Business logic, Audit logger, Email service
│   │   └── validators/           # Zod payload validation schemas
└── docs/                         # API Specifications, ERD Diagram, Security Policies, Deployment
    ├── api.md
    ├── erd.md
    ├── security.md
    └── deployment.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ & npm 9+
- MongoDB instance (local or MongoDB Atlas)
- Supabase Project (URL & Anon/Service keys)
- Cloudinary Account (Cloud name, API key & secret)

### 1. Installation
In the monorepo root:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` in both workspaces:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

### 3. Run Development Servers
```bash
# Run both frontend & backend concurrently from root:
npm run dev

# Or run individually:
npm run dev:backend   # Express API running on http://localhost:5000
npm run dev:frontend  # Next.js running on http://localhost:3000
```

---

## 🛡️ Quality & Verification Commands

```bash
# Typecheck both workspaces:
npm run typecheck

# Build both production bundles:
npm run build
```

---

## 📜 Documentation Index
- [REST API Specification](docs/api.md)
- [Entity Relationship Diagram & Schema](docs/erd.md)
- [Security Architecture & RBAC Matrix](docs/security.md)
- [Production Deployment & DevOps Guide](docs/deployment.md)

---

## 🇳🇵 License & Community Rights
Built with pride for **High School Youth Club**. All rights reserved © 2026.
