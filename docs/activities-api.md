# Activities API Documentation

Base URL: `http://localhost:3000/api/v1`

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## Activity Types

### Create Activity Type
```http
POST /activities/types
Authorization: Bearer <token>
Content-Type: application/json

{
  "libelle": "Prayer Meeting",
  "description": "Weekly community prayer session"
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST

**Response:** `201 Created`
```json
{
  "code": 1,
  "libelle": "Prayer Meeting",
  "description": "Weekly community prayer session",
  "code_createur": 4,
  "code_modificateur": null,
  "date_creation": "2026-02-07T20:57:17.086Z"
}
```

---

### Get All Activity Types
```http
GET /activities/types/all
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK`
```json
[
  {
    "code": 1,
    "libelle": "Bible Study",
    "description": "Group study of Scripture",
    "code_createur": 4,
    "code_modificateur": null,
    "date_creation": "2026-02-07T20:57:17.086Z"
  }
]
```

---

### Get Activity Type by ID
```http
GET /activities/types/:id
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK` or `404 Not Found`

---

### Update Activity Type
```http
PATCH /activities/types/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST

**Response:** `200 OK`

---

### Delete Activity Type
```http
DELETE /activities/types/:id
Authorization: Bearer <token>
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST

**Response:** `200 OK`
```json
{
  "message": "Activity type deleted successfully"
}
```

---

## Activities

### Create Activity
```http
POST /activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "libelle": "Weekly Prayer Meeting",
  "description": "Join us for prayer and fellowship",
  "lieu": "Main Church Hall",
  "date_activite": "2026-02-14T18:00:00Z",
  "date_debut": "2026-02-14T18:00:00Z",
  "date_fin": "2026-02-14T19:30:00Z",
  "frequence": "weekly",
  "code_unite_ecclesiale": 2,
  "code_type_activite": 1,
  "statut": 1
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON, VOLUNTEER

**Fields:**
- `libelle` (required): Activity name
- `description` (optional): Activity description
- `lieu` (optional): Location
- `date_activite` (optional): Activity date (ISO 8601)
- `date_debut` (optional): Start date/time
- `date_fin` (optional): End date/time
- `frequence` (optional): once | daily | weekly | monthly | yearly
- `statut` (optional): 0=cancelled, 1=active (default), 2=completed
- `code_unite_ecclesiale` (required): Ecclesiastical unit ID
- `code_type_activite` (optional): Activity type ID

**Response:** `201 Created`

---

### Get All Activities
```http
GET /activities?page=1&limit=10&search=prayer&frequence=weekly&statut=1&code_unite_ecclesiale=2&code_type_activite=1&date_from=2026-02-01&date_to=2026-02-28
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `search`: Search in libelle, description, lieu
- `frequence`: Filter by frequency
- `statut`: Filter by status (0, 1, 2)
- `code_unite_ecclesiale`: Filter by unit
- `code_type_activite`: Filter by type
- `date_from`: Start date for range filter
- `date_to`: End date for range filter

**Response:** `200 OK`
```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Weekly Prayer Meeting",
      "date_activite": "2026-02-14T18:00:00Z",
      "description": "Join us for prayer",
      "frequence": "weekly",
      "statut": 1,
      "lieu": "Main Church Hall",
      "ecclesiasticalUnit": {
        "code": 2,
        "libelle": "St. Mary Parish"
      },
      "activityType": {
        "code": 1,
        "libelle": "Prayer Meeting"
      }
    }
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### Get Activity by ID
```http
GET /activities/:id
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Response:** `200 OK` or `404 Not Found`
- Includes related ecclesiasticalUnit and activityType

---

### Get Upcoming Activities
```http
GET /activities/upcoming?limit=10
Authorization: Bearer <token>
```
**Roles:** All authenticated users

**Query Parameters:**
- `limit` (default: 10): Number of activities to return

**Response:** `200 OK`
- Returns active activities (statut=1) with future dates
- Sorted by date_activite ascending
- Includes relations

---

### Get Activities Statistics
```http
GET /activities/stats
Authorization: Bearer <token>
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Response:** `200 OK`
```json
{
  "total": 4,
  "active": 4,
  "byType": [
    {
      "type": "Prayer Meeting",
      "count": "2"
    }
  ],
  "byFrequency": [
    {
      "frequency": "weekly",
      "count": "2"
    }
  ],
  "byStatus": [
    {
      "status": 1,
      "count": "4"
    }
  ]
}
```

---

### Update Activity
```http
PATCH /activities/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "statut": 2
}
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON, VOLUNTEER

**Response:** `200 OK`

---

### Delete Activity
```http
DELETE /activities/:id
Authorization: Bearer <token>
```
**Roles:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Response:** `200 OK`
```json
{
  "message": "Activity deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": [
    "libelle should not be empty",
    "code_unite_ecclesiale must be an integer"
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
  "message": "Activity with ID 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Frequency Options
- `once`: One-time event
- `daily`: Daily recurring
- `weekly`: Weekly recurring
- `monthly`: Monthly recurring
- `yearly`: Yearly recurring

## Status Values
- `0`: Cancelled
- `1`: Active (default)
- `2`: Completed

---

## Examples

### Create a Weekly Bible Study
```bash
curl -X POST http://localhost:3000/api/v1/activities \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Bible Study Group",
    "description": "Study the Gospel of John",
    "lieu": "Parish Library",
    "date_activite": "2026-02-12T19:00:00Z",
    "frequence": "weekly",
    "code_unite_ecclesiale": 2,
    "code_type_activite": 2,
    "statut": 1
  }'
```

### Search for Prayer Activities
```bash
curl "http://localhost:3000/api/v1/activities?search=prayer" \
  -H "Authorization: Bearer <token>"
```

### Get This Month's Activities
```bash
curl "http://localhost:3000/api/v1/activities?date_from=2026-02-01&date_to=2026-02-28" \
  -H "Authorization: Bearer <token>"
```

### Get Weekly Activities Only
```bash
curl "http://localhost:3000/api/v1/activities?frequence=weekly" \
  -H "Authorization: Bearer <token>"
```
