# HIGH SCHOOL YOUTH CLUB — ENTITY RELATIONSHIP & SCHEMA ARCHITECTURE

## Overview
High School Youth Club employs a dual data architecture:
1. **Supabase Auth (`auth.users`)**: Handles user identities, cryptographic password hashing, email confirmations, session tokens, and JWT issuance.
2. **MongoDB Database**: Houses application-level entities, relational references, full-text searchable indexes, audit trails, and unstructured CMS payloads.

The two systems are coupled via `UserProfile.supabaseUserId <-> auth.users.id`.

---

## Mermaid Diagram

```mermaid
erDiagram
    SUPABASE_AUTH ||--|| USER_PROFILE : "auth.users.id -> supabaseUserId"
    USER_PROFILE ||--o{ EVENT : "creates"
    USER_PROFILE ||--o{ NOTICE : "authors"
    USER_PROFILE ||--o{ GALLERY : "uploads"
    USER_PROFILE ||--o{ ACTIVITY : "records"
    USER_PROFILE ||--o{ ACHIEVEMENT : "records"
    USER_PROFILE ||--o{ AUDIT_LOG : "performs"
    EVENT ||--o{ GALLERY : "associated media"

    USER_PROFILE {
        ObjectId _id PK
        string supabaseUserId UK
        string fullName
        string email UK
        string phone
        string avatar
        string role "SUPER_ADMIN|ADMIN|CONTENT_MANAGER|EVENT_MANAGER|VOLUNTEER"
        string status "active|inactive|suspended|pending"
        datetime createdAt
        datetime updatedAt
    }

    EVENT {
        ObjectId _id PK
        string title
        string slug UK
        string description
        string shortDescription
        string eventType "cultural|sports|educational|community_service|celebration|meeting|other"
        datetime date
        string startTime
        string endTime
        string location
        string ward
        string organizer
        string coverImage
        stringArray galleryImages
        string status "draft|published|cancelled|completed|archived"
        boolean registrationEnabled
        datetime registrationDeadline
        boolean published
        ObjectId createdBy FK
        datetime createdAt
        datetime updatedAt
    }

    NOTICE {
        ObjectId _id PK
        string title
        string slug UK
        string content
        string summary
        string category "general|urgent|event|recruitment|financial|administrative|other"
        string priority "low|medium|high|urgent"
        datetime publishedAt
        datetime expiryDate
        string attachmentUrl
        ObjectId author FK
        boolean published
        boolean pinned
        datetime createdAt
        datetime updatedAt
    }

    GALLERY {
        ObjectId _id PK
        string title
        string description
        string featureType "photo|video|document"
        string mediaUrl
        string cloudinaryPublicId
        string thumbnailUrl
        string folder
        ObjectId eventId FK
        ObjectId uploadedBy FK
        datetime createdAt
        datetime updatedAt
    }

    ACTIVITY {
        ObjectId _id PK
        string title
        string slug UK
        string description
        string category "environment|education|health|culture|sports|social_work|other"
        string coverImage
        string status "draft|published|archived"
        datetime date
        string location
        string organizer
        boolean published
        ObjectId createdBy FK
        datetime createdAt
        datetime updatedAt
    }

    ACHIEVEMENT {
        ObjectId _id PK
        string title
        string description
        datetime date
        string category "award|recognition|milestone|partnership|project|other"
        string image
        string recipient
        string organization
        boolean published
        ObjectId createdBy FK
        datetime createdAt
        datetime updatedAt
    }

    MEMBER {
        ObjectId _id PK
        string fullName
        string nepaliName
        string email
        string phone
        string profileImage
        string role "president|vice_president|secretary|treasurer|executive|member|volunteer|advisor"
        string position
        string ward
        datetime joinedDate
        string status "active|inactive|honorary"
        string bio
        stringArray skills
        object socialLinks
        boolean isVolunteer
        datetime createdAt
        datetime updatedAt
    }

    SITE_CONTENT {
        ObjectId _id PK
        string sectionKey UK "hero|about|mission|contact|footer"
        object contentPayload
        datetime updatedAt
    }

    SITE_SETTINGS {
        ObjectId _id PK
        string orgName
        string logoUrl
        string contactEmail
        string contactPhone
        string address
        object socialLinks
        object portalConfig
        datetime updatedAt
    }

    CONTACT_MESSAGE {
        ObjectId _id PK
        string name
        string email
        string phone
        string subject
        string message
        boolean isRead
        boolean isArchived
        datetime createdAt
    }

    AUDIT_LOG {
        ObjectId _id PK
        ObjectId userId FK
        string action
        string resource
        string resourceId
        string ipAddress
        string userAgent
        object metadata
        datetime createdAt
    }
```

---

## Indexing Strategy
- **Text Search Indexes**:
  - `Event`: `{ title: "text", description: "text", location: "text" }`
  - `Notice`: `{ title: "text", content: "text" }`
  - `Activity`: `{ title: "text", description: "text" }`
  - `Member`: `{ fullName: "text", nepaliName: "text", bio: "text" }`
- **Compound & Filter Indexes**:
  - `Event`: `{ published: 1, date: -1 }`
  - `Notice`: `{ pinned: -1, publishedAt: -1, published: 1 }`
  - `Gallery`: `{ eventId: 1, createdAt: -1 }`
  - `AuditLog`: `{ createdAt: -1, resource: 1 }`
  - `AuditLog TTL`: Automatic expiry after 365 days via `{ expireAfterSeconds: 31536000 }`
