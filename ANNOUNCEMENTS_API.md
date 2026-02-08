# Announcements (Parish Communications) API Documentation

## Base URL
`/api/v1/announcements`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

### Announcements Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/announcements` | Create new announcement | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/announcements` | Get all announcements with filtering | Authenticated users |
| GET | `/announcements/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/announcements/active` | Get active announcements | Authenticated users |
| GET | `/announcements/unit/:unitId` | Get announcements by unit | Authenticated users |
| GET | `/announcements/:id` | Get single announcement | Authenticated users |
| PATCH | `/announcements/:id` | Update announcement | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| DELETE | `/announcements/:id` | Delete announcement | ADMIN, SUPER_ADMIN, PRIEST, DEACON |

### Announcement Types Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/announcements/types` | Create announcement type | ADMIN, SUPER_ADMIN, PRIEST |
| GET | `/announcements/types/all` | Get all announcement types | Authenticated users |
| GET | `/announcements/types/:id` | Get single announcement type | Authenticated users |
| PATCH | `/announcements/types/:id` | Update announcement type | ADMIN, SUPER_ADMIN, PRIEST |
| DELETE | `/announcements/types/:id` | Delete announcement type | ADMIN, SUPER_ADMIN, PRIEST |

---

# ANNOUNCEMENTS ENDPOINTS

## 1. Create Announcement

**Endpoint:** `POST /api/v1/announcements`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

```json
{
  "libelle": "Parish Festival This Sunday",
  "contenu": "Join us for our annual parish festival on Sunday, March 15th, after the 10am Mass. There will be food, games, and activities for the whole family. All are welcome!",
  "code_type": 1,
  "code_unite_ecclesiale": 1,
  "date_publication": "2024-03-01",
  "date_expiration": "2024-03-15"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Title of the announcement |
| contenu | string | No | Content/body of the announcement |
| code_type | number | No | Announcement type ID |
| code_unite_ecclesiale | number | No | Ecclesiastical unit ID |
| date_publication | string | No | Publication date (ISO 8601) |
| date_expiration | string | No | Expiration date (ISO 8601) |

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Parish Festival This Sunday",
  "contenu": "Join us for our annual parish festival on Sunday, March 15th, after the 10am Mass. There will be food, games, and activities for the whole family. All are welcome!",
  "code_type": 1,
  "code_unite_ecclesiale": 1,
  "date_publication": "2024-03-01T00:00:00.000Z",
  "date_expiration": "2024-03-15T00:00:00.000Z",
  "code_createur": 6,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "announcementType": {
    "code": 1,
    "libelle": "Event"
  },
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish"
  },
  "creator": {
    "code": 6,
    "username": "superadmin",
    "noms": "System",
    "prenoms": "Administrator"
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/announcements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Parish Festival This Sunday",
    "contenu": "Join us for our annual parish festival...",
    "code_type": 1,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-03-01",
    "date_expiration": "2024-03-15"
  }'
```

---

## 2. Get All Announcements

**Endpoint:** `GET /api/v1/announcements`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in title or content |
| code_unite_ecclesiale | number | No | - | Filter by ecclesiastical unit |
| code_type | number | No | - | Filter by announcement type |
| date_from | string | No | - | Filter from this date (ISO 8601) |
| date_to | string | No | - | Filter to this date (ISO 8601) |
| active_only | boolean | No | false | Show only active (non-expired) announcements |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all announcements
GET /api/v1/announcements

# Search by keyword
GET /api/v1/announcements?search=festival

# Filter by ecclesiastical unit
GET /api/v1/announcements?code_unite_ecclesiale=1

# Filter by type
GET /api/v1/announcements?code_type=1

# Get only active announcements
GET /api/v1/announcements?active_only=true

# Filter by date range
GET /api/v1/announcements?date_from=2024-01-01&date_to=2024-12-31

# Combine filters
GET /api/v1/announcements?code_unite_ecclesiale=1&active_only=true&page=1&limit=20
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Parish Festival This Sunday",
      "contenu": "Join us for our annual parish festival...",
      "code_type": 1,
      "code_unite_ecclesiale": 1,
      "date_publication": "2024-03-01T00:00:00.000Z",
      "date_expiration": "2024-03-15T00:00:00.000Z",
      "code_createur": 6,
      "date_creation": "2026-02-08T10:30:00.000Z",
      "date_modification": "2026-02-08T10:30:00.000Z",
      "announcementType": {
        "code": 1,
        "libelle": "Event"
      },
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish"
      }
    },
    {
      "code": 2,
      "libelle": "Lenten Schedule",
      "contenu": "Our Lenten services will be held every Friday at 6pm...",
      "code_type": 2,
      "code_unite_ecclesiale": 1,
      "date_publication": "2024-02-14T00:00:00.000Z",
      "date_expiration": "2024-04-01T00:00:00.000Z",
      "code_createur": 6,
      "date_creation": "2026-02-08T11:00:00.000Z",
      "date_modification": "2026-02-08T11:00:00.000Z",
      "announcementType": {
        "code": 2,
        "libelle": "Liturgical"
      },
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish"
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### cURL Example

```bash
# Get all announcements
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements"

# Get active announcements only
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements?active_only=true"
```

---

## 3. Get Announcement by ID

**Endpoint:** `GET /api/v1/announcements/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Parish Festival This Sunday",
  "contenu": "Join us for our annual parish festival on Sunday, March 15th, after the 10am Mass. There will be food, games, and activities for the whole family. All are welcome!",
  "code_type": 1,
  "code_unite_ecclesiale": 1,
  "date_publication": "2024-03-01T00:00:00.000Z",
  "date_expiration": "2024-03-15T00:00:00.000Z",
  "code_createur": 6,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "announcementType": {
    "code": 1,
    "libelle": "Event",
    "description": "Announcements related to upcoming parish events"
  },
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street"
  },
  "creator": {
    "code": 6,
    "username": "superadmin",
    "noms": "System",
    "prenoms": "Administrator"
  }
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/1"
```

---

## 4. Update Announcement

**Endpoint:** `PATCH /api/v1/announcements/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "libelle": "Parish Festival Postponed",
  "contenu": "Due to weather, the parish festival has been postponed to next Sunday, March 22nd.",
  "date_expiration": "2024-03-22"
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Parish Festival Postponed",
  "contenu": "Due to weather, the parish festival has been postponed to next Sunday, March 22nd.",
  "code_type": 1,
  "code_unite_ecclesiale": 1,
  "date_publication": "2024-03-01T00:00:00.000Z",
  "date_expiration": "2024-03-22T00:00:00.000Z",
  "code_createur": 6,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T15:45:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/announcements/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Parish Festival Postponed",
    "date_expiration": "2024-03-22"
  }'
```

---

## 5. Delete Announcement

**Endpoint:** `DELETE /api/v1/announcements/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "message": "Announcement successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/announcements/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Announcements Statistics

**Endpoint:** `GET /api/v1/announcements/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 45,
  "active": 23,
  "expired": 22,
  "byType": {
    "Event": 15,
    "Liturgical": 12,
    "Administrative": 8,
    "Urgent": 5,
    "General": 5
  },
  "byMonth": {
    "2024-01": 5,
    "2024-02": 8,
    "2024-03": 12
  }
}
```

**Explanation:**
- `total`: Total number of announcements
- `active`: Non-expired announcements
- `expired`: Expired announcements
- `byType`: Count by announcement type
- `byMonth`: Count by publication month

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/stats"
```

---

## 7. Get Active Announcements

**Endpoint:** `GET /api/v1/announcements/active`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Maximum number of announcements to return |

### Success Response (200)

```json
[
  {
    "code": 3,
    "libelle": "Adoration Chapel Hours",
    "contenu": "The Adoration Chapel is open Monday-Friday from 8am to 8pm",
    "code_type": 3,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-01-01T00:00:00.000Z",
    "date_expiration": null,
    "ecclesiasticalUnit": {
      "code": 1,
      "libelle": "St. Mary Parish"
    },
    "announcementType": {
      "code": 3,
      "libelle": "General"
    }
  },
  {
    "code": 4,
    "libelle": "Confirmation Classes Starting",
    "contenu": "Confirmation classes for teens will begin on March 20th",
    "code_type": 1,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-03-01T00:00:00.000Z",
    "date_expiration": "2024-03-20T00:00:00.000Z"
  }
]
```

### cURL Example

```bash
# Get 10 active announcements
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/active"

# Get 20 active announcements
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/active?limit=20"
```

---

## 8. Get Announcements by Unit

**Endpoint:** `GET /api/v1/announcements/unit/:unitId`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 1,
    "libelle": "Parish Festival This Sunday",
    "contenu": "Join us for our annual parish festival...",
    "code_type": 1,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-03-01T00:00:00.000Z",
    "date_expiration": "2024-03-15T00:00:00.000Z",
    "announcementType": {
      "code": 1,
      "libelle": "Event"
    }
  },
  {
    "code": 2,
    "libelle": "Lenten Schedule",
    "contenu": "Our Lenten services will be held every Friday at 6pm",
    "code_type": 2,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-02-14T00:00:00.000Z",
    "date_expiration": "2024-04-01T00:00:00.000Z",
    "announcementType": {
      "code": 2,
      "libelle": "Liturgical"
    }
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/unit/1"
```

---

# ANNOUNCEMENT TYPES ENDPOINTS

## 9. Create Announcement Type

**Endpoint:** `POST /api/v1/announcements/types`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Request Body

```json
{
  "libelle": "Event",
  "description": "Announcements related to upcoming parish events and activities"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Name of the announcement type |
| description | string | No | Description of the type |

### Common Announcement Types

- **Event**: Parish events, festivals, gatherings
- **Liturgical**: Mass times, liturgical seasons, feast days
- **Administrative**: Office hours, staff changes, policies
- **Urgent**: Time-sensitive or emergency communications
- **General**: General parish information
- **Sacramental**: Baptisms, weddings, confirmations
- **Charitable**: Fundraising, charity drives, volunteer opportunities
- **Educational**: Faith formation, classes, workshops

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Event",
  "description": "Announcements related to upcoming parish events and activities"
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/announcements/types \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Event",
    "description": "Parish events and activities"
  }'
```

---

## 10. Get All Announcement Types

**Endpoint:** `GET /api/v1/announcements/types/all`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 1,
    "libelle": "Event",
    "description": "Announcements related to upcoming parish events and activities"
  },
  {
    "code": 2,
    "libelle": "Liturgical",
    "description": "Mass schedules, liturgical seasons, and feast day information"
  },
  {
    "code": 3,
    "libelle": "General",
    "description": "General parish information and updates"
  },
  {
    "code": 4,
    "libelle": "Urgent",
    "description": "Time-sensitive or emergency communications"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/types/all"
```

---

## 11. Get Announcement Type by ID

**Endpoint:** `GET /api/v1/announcements/types/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Event",
  "description": "Announcements related to upcoming parish events and activities"
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements/types/1"
```

---

## 12. Update Announcement Type

**Endpoint:** `PATCH /api/v1/announcements/types/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Request Body

All fields are optional.

```json
{
  "libelle": "Parish Events",
  "description": "All parish events, festivals, and social gatherings"
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Parish Events",
  "description": "All parish events, festivals, and social gatherings"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/announcements/types/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "All parish events, festivals, and social gatherings"
  }'
```

---

## 13. Delete Announcement Type

**Endpoint:** `DELETE /api/v1/announcements/types/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Success Response (200)

```json
{
  "message": "Announcement type successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/announcements/types/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "libelle should not be empty"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Announcement not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Announce Parish Festival

```bash
curl -X POST http://localhost:3000/api/v1/announcements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Annual Parish Festival - March 20th",
    "contenu": "Join us for food, games, and fellowship after the 10am Mass. Bring the whole family!",
    "code_type": 1,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-03-01",
    "date_expiration": "2024-03-20"
  }'
```

### Use Case 2: Post Urgent Weather-Related Closure

```bash
curl -X POST http://localhost:3000/api/v1/announcements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "URGENT: Church Closed Due to Snow",
    "contenu": "Due to severe weather, all services are cancelled today. Stay safe!",
    "code_type": 4,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-01-15",
    "date_expiration": "2024-01-16"
  }'
```

### Use Case 3: Share Lenten Schedule

```bash
curl -X POST http://localhost:3000/api/v1/announcements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Lenten Services Schedule",
    "contenu": "Stations of the Cross every Friday at 6pm. Confessions available before and after.",
    "code_type": 2,
    "code_unite_ecclesiale": 1,
    "date_publication": "2024-02-14",
    "date_expiration": "2024-04-01"
  }'
```

### Use Case 4: Get Current Active Announcements for Parish Bulletin

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements?code_unite_ecclesiale=1&active_only=true&limit=10"
```

### Use Case 5: View All Event Announcements

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/announcements?code_type=1"
```

---

## Testing in Swagger

1. **Access Swagger UI:**
   ```
   http://localhost:3000/api/docs
   ```

2. **Authorize:**
   - Click **"Authorize"** button
   - Enter: `Bearer YOUR_TOKEN`
   - Click **"Authorize"**

3. **Test Endpoints:**
   - Navigate to **"Announcements"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **13 Comprehensive Endpoints**
✅ **Full CRUD for Announcements**
✅ **Full CRUD for Announcement Types**
✅ **Publication & Expiration Dates**
✅ **Active Announcements Feed**
✅ **Unit-Specific Announcements**
✅ **Advanced Filtering** (by type, unit, date range, active status)
✅ **Statistics & Reporting**
✅ **Search by Title or Content**
✅ **Role-Based Access Control**

**Perfect for parish bulletins, websites, and mobile apps!** 🎉📢⛪
