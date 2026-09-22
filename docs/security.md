# HIGH SCHOOL YOUTH CLUB — SECURITY ARCHITECTURE & POLICIES

## Overview
High School Youth Club is engineered with defense-in-depth security principles protecting user data, administrative operations, media uploads, and server infrastructure.

---

## 1. Authentication & Session Security
- **Identity Provider**: Supabase Auth with standard JWT signing.
- **Client Handling**:
  - Web client utilizes `@supabase/ssr` / `@supabase/supabase-js`.
  - Tokens stored securely via browser cookie sessions with SameSite flags.
- **Backend Validation**:
  - Every protected request passes through `verifyAuth` middleware.
  - JWT signature is verified against the Supabase Project Secret / Public Key.
  - Revoked or expired sessions immediately return HTTP `401 Unauthorized`.
  - The decoded user claims are cross-referenced with MongoDB `UserProfile` to retrieve current role and account status.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Resource / Action | SUPER_ADMIN | ADMIN | CONTENT_MANAGER | EVENT_MANAGER | VOLUNTEER | PUBLIC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Published Events/Notices** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **View Published Gallery/Members** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Submit Contact Message** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Manage Profile / Self** | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| **Create / Update Events** | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| **Delete Events** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Create / Update Notices** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Pin / Publish Notices** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Delete Notices** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Upload Gallery Media** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Delete Gallery Media** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Manage Site CMS (Content)** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Manage Club Settings** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **View Audit Logs** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Assign User Roles** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Promote to Super Admin** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Delete User Accounts** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## 3. Network & Transport Security
- **HTTPS Enforced**: In production, all unencrypted HTTP traffic is redirected to TLS 1.3.
- **Helmet.js Security Headers**:
  - `Content-Security-Policy`: Disallows untrusted script execution.
  - `X-DNS-Prefetch-Control`: Off.
  - `X-Frame-Options`: `DENY` to prevent clickjacking.
  - `Strict-Transport-Security`: Enforced with `includeSubDomains`.
  - `X-Content-Type-Options`: `nosniff`.
- **CORS Whitelisting**:
  - Only designated frontend origin (`FRONTEND_URL` / `APP_URL`) is allowed to make credentialed cross-origin requests.

---

## 4. Rate Limiting & Abuse Prevention
Built using `express-rate-limit`:
- **Global API Rate Limit**: 100 requests per 15-minute window per IP.
- **Contact Form Submission**: 5 messages per 15-minute window per IP.
- **Media Upload Signature**: 20 signatures per 15-minute window per user.
- **Auth Endpoint Throttling**: Strict IP-based throttling preventing credential stuffing.

---

## 5. Input Validation & Sanitization
- **Zod Schemas**: Every controller strictly parses request payloads with explicit Zod validators before invoking services. Extra or malicious fields are stripped automatically.
- **Mongo-Sanitize**: Protects against NoSQL injection by recursively stripping `$` and `.` operators from query and body params.
- **XSS Escaping**: User-generated HTML strings are sanitized using `xss` library before persistence.

---

## 6. Audit Logging & Non-Repudiation
Every write action (Creation, Mutation, Deletion, Role change, Login) invokes `recordAction()` to persist an immutable entry in the `AuditLog` collection, logging:
- Operator `userId`
- Action type (`EVENT_CREATED`, `USER_ROLE_CHANGED`, etc.)
- Resource type and ID
- Operator IP Address and User-Agent
- Change metadata / diff snapshot
