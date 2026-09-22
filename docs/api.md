# HIGH SCHOOL YOUTH CLUB — REST API SPECIFICATION
Version: 1.0.0
Base URL: `/api/v1`

All responses follow the unified JSend-inspired response envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 1. Authentication & Users
Authentication is performed via Supabase Bearer JWT passed in `Authorization: Bearer <token>`.

### `GET /api/v1/users/me`
- **Auth**: Required
- **Returns**: Current authenticated user's `UserProfile` document.

### `POST /api/v1/users/profile`
- **Auth**: Required
- **Body**: `{ "fullName": string, "phone"?: string, "avatar"?: string }`
- **Returns**: Newly created or existing `UserProfile`.

### `PATCH /api/v1/users/me`
- **Auth**: Required
- **Body**: `{ "fullName"?: string, "phone"?: string, "avatar"?: string }`
- **Returns**: Updated `UserProfile`.

### `GET /api/v1/users`
- **Auth**: Required (`SUPER_ADMIN` or `ADMIN`)
- **Query Params**: `page`, `limit`, `role`, `status`, `search`
- **Returns**: Paginated list of users.

### `PATCH /api/v1/users/:id/role`
- **Auth**: Required (`SUPER_ADMIN` or `ADMIN`)
- **Body**: `{ "role": UserRole, "status"?: UserStatus }`
- **Returns**: Updated `UserProfile`.

### `DELETE /api/v1/users/:id`
- **Auth**: Required (`SUPER_ADMIN`)
- **Returns**: Success acknowledgement.

---

## 2. Events (`/api/v1/events`)

### `GET /api/v1/events`
- **Auth**: Public
- **Query Params**: `page`, `limit`, `eventType`, `published`, `search`, `sortBy`, `sortOrder`
- **Returns**: Paginated list of events.

### `GET /api/v1/events/:id`
- **Auth**: Public
- **Returns**: Event details by MongoDB ObjectId.

### `GET /api/v1/events/slug/:slug`
- **Auth**: Public
- **Returns**: Event details by SEO slug.

### `POST /api/v1/events`
- **Auth**: Required (`EVENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**:
  ```json
  {
    "title": "Annual Dashain Football Cup",
    "description": "Full event details...",
    "shortDescription": "Brief summary",
    "eventType": "sports",
    "date": "2026-10-15T00:00:00.000Z",
    "startTime": "10:00 AM",
    "endTime": "4:00 PM",
    "location": "Ward 4 Community Ground",
    "ward": "4",
    "organizer": "High School Youth Club",
    "coverImage": "https://...",
    "published": true
  }
  ```

### `PATCH /api/v1/events/:id`
- **Auth**: Required (`EVENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**: Partial event object.

### `PATCH /api/v1/events/:id/publish`
- **Auth**: Required (`EVENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**: `{ "published": boolean }`

### `DELETE /api/v1/events/:id`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

---

## 3. Notices & Bulletins (`/api/v1/notices`)

### `GET /api/v1/notices`
- **Auth**: Public
- **Query Params**: `page`, `limit`, `category`, `priority`, `published`, `pinned`, `search`

### `GET /api/v1/notices/:id`
- **Auth**: Public

### `GET /api/v1/notices/slug/:slug`
- **Auth**: Public

### `POST /api/v1/notices`
- **Auth**: Required (`CONTENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**:
  ```json
  {
    "title": "General Assembly Meeting Notice",
    "content": "Notice content...",
    "category": "general",
    "priority": "medium",
    "attachmentUrl": "https://...",
    "pinned": false,
    "published": true
  }
  ```

### `PATCH /api/v1/notices/:id/pin`
- **Auth**: Required (`CONTENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**: `{ "pinned": boolean }`

### `DELETE /api/v1/notices/:id`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

---

## 4. Gallery & Media (`/api/v1/gallery`)

### `GET /api/v1/gallery`
- **Auth**: Public
- **Query Params**: `page`, `limit`, `featureType`, `eventId`

### `POST /api/v1/gallery`
- **Auth**: Required (`CONTENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**:
  ```json
  {
    "title": "Teej Festival Celebration",
    "description": "Community dance gathering",
    "featureType": "photo",
    "mediaUrl": "https://res.cloudinary.com/...",
    "cloudinaryPublicId": "high_school_youth_club/photo_123",
    "thumbnailUrl": "https://res.cloudinary.com/..."
  }
  ```

### `DELETE /api/v1/gallery/:id`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

---

## 5. Media Upload (`/api/v1/upload`)

### `POST /api/v1/upload/signature`
- **Auth**: Required (`CONTENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**: `{ "folder"?: string }`
- **Returns**:
  ```json
  {
    "signature": "sha1_signature",
    "timestamp": 1726750000,
    "apiKey": "cloudinary_key",
    "cloudName": "cloudinary_cloud",
    "folder": "high_school_youth_club"
  }
  ```

---

## 6. Community Members (`/api/v1/members`)

### `GET /api/v1/members`
- **Auth**: Public
- **Query Params**: `role`, `status`, `page`, `limit`

### `POST /api/v1/admin/members`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)
- **Body**: `CreateMemberInput`

### `PATCH /api/v1/admin/members/:id`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

### `DELETE /api/v1/admin/members/:id`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

---

## 7. Site Content CMS (`/api/v1/content`)

### `GET /api/v1/content`
- **Auth**: Public
- **Returns**: All site sections.

### `GET /api/v1/content/:section`
- **Auth**: Public
- **Returns**: Section content by key (`hero`, `about`, `mission`, `contact`, `footer`).

### `PUT /api/v1/content/:section`
- **Auth**: Required (`CONTENT_MANAGER`, `ADMIN`, `SUPER_ADMIN`)
- **Body**: `{ "sectionKey": string, "contentPayload": object }`

---

## 8. Site Settings (`/api/v1/settings`)

### `GET /api/v1/settings`
- **Auth**: Public
- **Returns**: Public site settings & club identity.

### `PUT /api/v1/settings`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)
- **Body**: `UpdateSiteSettingsInput`

---

## 9. Contact Messages (`/api/v1/contact`)

### `POST /api/v1/contact`
- **Auth**: Public (Rate-limited: 5 per 15 minutes)
- **Body**:
  ```json
  {
    "name": "Sita Sharma",
    "email": "sita@example.com",
    "phone": "+977 9800000000",
    "subject": "Volunteer Inquiry",
    "message": "I would like to volunteer for the upcoming blood donation drive."
  }
  ```

### `GET /api/v1/admin/contacts`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

### `PATCH /api/v1/admin/contacts/:id/read`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)
- **Body**: `{ "isRead": boolean }`

### `PATCH /api/v1/admin/contacts/:id/archive`
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)

---

## 10. Audit Logs (`/api/v1/admin/audit`)
- **Auth**: Required (`ADMIN`, `SUPER_ADMIN`)
- **Query Params**: `page`, `limit`, `userId`, `resource`
- **Returns**: Immutable chronological record of actions.
