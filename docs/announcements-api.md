# Announcements API Documentation

Base URL: `http://localhost:3000/api/v1`

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## Announcement Types

### Create Announcement Type
```http
POST /announcements/types
Authorization: Bearer <token>
Content-Type: application/json

{
  "libelle": "Important Notice",
  "description": "Critical announcements for the parish"
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST

**Response:** `201 Created`
```json
{
  "code": 1,
  "libelle": "Important Notice",
  "description": "Critical announcements for the parish"
}
```

---

### Get All Announcement Types
```http
GET /announcements/types/all
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK`
```json
[
  {
    "code": 1,
    "libelle": "Event Update",
    "description": "Updates about parish events"
  }
]
```

---

### Get Announcement Type by ID
```http
GET /announcements/types/:id
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK` or `404 Not Found`

---

### Update Announcement Type
```http
PATCH /announcements/types/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST

**Response:** `200 OK`

---

### Delete Announcement Type
```http
DELETE /announcements/types/:id
Authorization: Bearer <token>
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST

**Response:** `200 OK`
```json
{
  "message": "Announcement type deleted successfully"
}
```

---

## Announcements

### Create Announcement
```http
POST /announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "libelle": "Mass Schedule Change",
  "contenu": "Due to renovations, Sunday Mass will be held at 9:00 AM instead of 10:00 AM.",
  "code_type": 1,
  "code_unite_ecclesiale": 2,
  "date_publication": "2026-02-05T08:00:00Z",
  "date_expiration": "2026-03-01T23:59:59Z"
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Fields:**
- `libelle` (required): Announcement title
- `contenu` (optional): Announcement content/details
- `code_type` (optional): Announcement type ID
- `code_unite_ecclesiale` (optional): Ecclesiastical unit ID
- `date_publication` (optional): Publication date (ISO 8601)
- `date_expiration` (optional): Expiration date (ISO 8601), NULL = permanent

**Response:** `201 Created`
```json
{
  "code": 1,
  "libelle": "Mass Schedule Change",
  "contenu": "Due to renovations...",
  "code_type": 1,
  "code_unite_ecclesiale": 2,
  "date_publication": "2026-02-05T08:00:00Z",
  "date_expiration": "2026-03-01T23:59:59Z",
  "date_creation": "2026-02-07T21:23:05.802Z",
  "date_modification": "2026-02-07T21:23:05.802Z",
  "code_createur": 4
}
```

---

### Get All Announcements
```http
GET /announcements?page=1&limit=10&search=mass&code_type=1&code_unite_ecclesiale=2&date_from=2026-02-01&date_to=2026-02-28&active_only=true
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `search`: Search in libelle and contenu
- `code_type`: Filter by announcement type
- `code_unite_ecclesiale`: Filter by unit
- `date_from`: Start date for range filter (publication date)
- `date_to`: End date for range filter (publication date)
- `active_only`: If true, only return non-expired announcements

**Response:** `200 OK`
```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Mass Schedule Change",
      "contenu": "Due to renovations...",
      "date_publication": "2026-02-05T08:00:00Z",
      "date_expiration": "2026-03-01T23:59:59Z",
      "ecclesiasticalUnit": {
        "code": 2,
        "libelle": "St. Mary Parish"
      },
      "announcementType": {
        "code": 1,
        "libelle": "Important Notice"
      },
      "creator": {
        "code": 4,
        "username": "testadmin"
      }
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### Get Announcement by ID
```http
GET /announcements/:id
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK` or `404 Not Found`
- Includes related unit, type, and creator

---

### Get Active Announcements
```http
GET /announcements/active?limit=10
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Query Parameters:**
- `limit` (default: 10): Number of announcements to return

**Response:** `200 OK`
- Returns announcements where date_expiration is NULL or > current date
- Sorted by date_publication DESC
- Includes all relations

---

### Get Announcements by Unit
```http
GET /announcements/unit/:unitId
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK`
- Returns all announcements for the specified ecclesiastical unit
- Sorted by date_publication DESC
- Includes all relations

---

### Get Announcements Statistics
```http
GET /announcements/stats
Authorization: Bearer <token>
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Response:** `200 OK`
```json
{
  "total": 3,
  "active": 2,
  "expired": 1,
  "byType": [
    {
      "type": "Important Notice",
      "count": "2"
    }
  ],
  "byUnit": [
    {
      "unit": "St. Mary Parish",
      "count": "2"
    }
  ]
}
```

---

### Update Announcement
```http
PATCH /announcements/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "contenu": "Updated announcement content",
  "date_expiration": "2026-04-01T23:59:59Z"
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Response:** `200 OK`

---

### Delete Announcement
```http
DELETE /announcements/:id
Authorization: Bearer <token>
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Response:** `200 OK`
```json
{
  "message": "Announcement deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": [
    "libelle should not be empty",
    "date_publication must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "message": "Announcement with ID 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Expiration Logic

- **NULL expiration:** Announcement is permanent (never expires)
- **Future expiration:** Announcement is active until expiration date
- **Past expiration:** Announcement has expired and won't appear in active queries

The `/active` endpoint and `?active_only=true` parameter automatically filter out expired announcements.

---

## Examples

### Create Important Announcement with Expiration
```bash
curl -X POST http://localhost:3000/api/v1/announcements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Church Closure Notice",
    "contenu": "The church will be closed for maintenance from March 1-5.",
    "code_type": 1,
    "code_unite_ecclesiale": 2,
    "date_publication": "2026-02-20T08:00:00Z",
    "date_expiration": "2026-03-05T23:59:59Z"
  }'
```

### Create Permanent Announcement
```bash
curl -X POST http://localhost:3000/api/v1/announcements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Welcome to Our Parish",
    "contenu": "New members are always welcome! Visit our office for information.",
    "code_type": 3,
    "code_unite_ecclesiale": 2,
    "date_publication": "2026-02-01T00:00:00Z"
  }'
```

### Get Only Active Announcements
```bash
curl "http://localhost:3000/api/v1/announcements?active_only=true" \
  -H "Authorization: Bearer <token>"
```

### Search for Event Announcements
```bash
curl "http://localhost:3000/api/v1/announcements?search=event&code_type=2" \
  -H "Authorization: Bearer <token>"
```

### Get This Month's Announcements
```bash
curl "http://localhost:3000/api/v1/announcements?date_from=2026-02-01&date_to=2026-02-29" \
  -H "Authorization: Bearer <token>"
```

### Get Announcements for Specific Unit
```bash
curl "http://localhost:3000/api/v1/announcements/unit/2" \
  -H "Authorization: Bearer <token>"
```
