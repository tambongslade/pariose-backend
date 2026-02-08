# Activities API Documentation

## Base URL
`/api/v1/activities`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

### Activities Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/activities` | Create new activity | ADMIN, SUPER_ADMIN, PRIEST, DEACON, VOLUNTEER |
| GET | `/activities` | Get all activities with filtering | Authenticated users |
| GET | `/activities/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/activities/upcoming` | Get upcoming activities | Authenticated users |
| GET | `/activities/:id` | Get single activity | Authenticated users |
| PATCH | `/activities/:id` | Update activity | ADMIN, SUPER_ADMIN, PRIEST, DEACON, VOLUNTEER |
| DELETE | `/activities/:id` | Delete activity | ADMIN, SUPER_ADMIN, PRIEST, DEACON |

### Activity Types Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/activities/types` | Create activity type | ADMIN, SUPER_ADMIN, PRIEST |
| GET | `/activities/types/all` | Get all activity types | Authenticated users |
| GET | `/activities/types/:id` | Get single activity type | Authenticated users |
| PATCH | `/activities/types/:id` | Update activity type | ADMIN, SUPER_ADMIN, PRIEST |
| DELETE | `/activities/types/:id` | Delete activity type | ADMIN, SUPER_ADMIN, PRIEST |

---

# ACTIVITIES ENDPOINTS

## 1. Create Activity

**Endpoint:** `POST /api/v1/activities`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON, VOLUNTEER

### Request Body

```json
{
  "libelle": "Youth Bible Study",
  "date_activite": "2024-03-15",
  "description": "Weekly Bible study session for young adults aged 18-30",
  "frequence": "weekly",
  "date_debut": "2024-01-01",
  "date_fin": "2024-12-31",
  "statut": 1,
  "lieu": "Parish Hall",
  "code_unite_ecclesiale": 1,
  "code_type_activite": 1
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Name of the activity |
| date_activite | string | No | Activity date (ISO 8601) |
| description | string | No | Detailed description |
| frequence | string | No | Frequency: `once`, `daily`, `weekly`, `monthly`, `yearly` |
| date_debut | string | No | Start date for recurring activities |
| date_fin | string | No | End date for recurring activities |
| statut | number | No | Status: `0` (planned), `1` (ongoing), `2` (completed) |
| lieu | string | No | Location/venue |
| code_unite_ecclesiale | number | **Yes** | Ecclesiastical unit ID |
| code_type_activite | number | No | Activity type ID |

### Activity Status Values

- **0**: Planned (not started yet)
- **1**: Ongoing (in progress/active) - Default
- **2**: Completed (finished)

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Youth Bible Study",
  "date_activite": "2024-03-15T00:00:00.000Z",
  "description": "Weekly Bible study session for young adults aged 18-30",
  "frequence": "weekly",
  "date_debut": "2024-01-01T00:00:00.000Z",
  "date_fin": "2024-12-31T00:00:00.000Z",
  "statut": 1,
  "lieu": "Parish Hall",
  "code_unite_ecclesiale": 1,
  "code_type_activite": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish"
  },
  "activityType": {
    "code": 1,
    "libelle": "Catechism"
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Youth Bible Study",
    "description": "Weekly Bible study for young adults",
    "frequence": "weekly",
    "date_debut": "2024-01-01",
    "lieu": "Parish Hall",
    "code_unite_ecclesiale": 1,
    "code_type_activite": 1
  }'
```

---

## 2. Get All Activities

**Endpoint:** `GET /api/v1/activities`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in name or description |
| code_unite_ecclesiale | number | No | - | Filter by ecclesiastical unit |
| code_type_activite | number | No | - | Filter by activity type |
| frequence | string | No | - | Filter by frequency |
| statut | number | No | - | Filter by status (0, 1, 2) |
| date_from | string | No | - | Filter from this date (ISO 8601) |
| date_to | string | No | - | Filter to this date (ISO 8601) |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all activities
GET /api/v1/activities

# Search by name
GET /api/v1/activities?search=Bible

# Filter by ecclesiastical unit
GET /api/v1/activities?code_unite_ecclesiale=1

# Filter by type
GET /api/v1/activities?code_type_activite=1

# Filter by frequency
GET /api/v1/activities?frequence=weekly

# Filter by status (ongoing)
GET /api/v1/activities?statut=1

# Filter by date range
GET /api/v1/activities?date_from=2024-01-01&date_to=2024-12-31

# Combine filters
GET /api/v1/activities?code_unite_ecclesiale=1&frequence=weekly&statut=1&page=1&limit=20
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Youth Bible Study",
      "date_activite": "2024-03-15T00:00:00.000Z",
      "description": "Weekly Bible study session for young adults",
      "frequence": "weekly",
      "date_debut": "2024-01-01T00:00:00.000Z",
      "date_fin": "2024-12-31T00:00:00.000Z",
      "statut": 1,
      "lieu": "Parish Hall",
      "code_unite_ecclesiale": 1,
      "code_type_activite": 1,
      "date_creation": "2026-02-08T10:30:00.000Z",
      "date_modification": "2026-02-08T10:30:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish"
      },
      "activityType": {
        "code": 1,
        "libelle": "Catechism"
      }
    },
    {
      "code": 2,
      "libelle": "Choir Practice",
      "date_activite": null,
      "description": "Weekly choir rehearsal",
      "frequence": "weekly",
      "date_debut": "2024-01-01T00:00:00.000Z",
      "date_fin": "2024-12-31T00:00:00.000Z",
      "statut": 1,
      "lieu": "Church",
      "code_unite_ecclesiale": 1,
      "code_type_activite": 2,
      "date_creation": "2026-02-08T11:00:00.000Z",
      "date_modification": "2026-02-08T11:00:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish"
      },
      "activityType": {
        "code": 2,
        "libelle": "Music Ministry"
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
# Get all activities
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities"

# Filter and search
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities?search=Bible&code_unite_ecclesiale=1"
```

---

## 3. Get Activity by ID

**Endpoint:** `GET /api/v1/activities/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Youth Bible Study",
  "date_activite": "2024-03-15T00:00:00.000Z",
  "description": "Weekly Bible study session for young adults aged 18-30",
  "frequence": "weekly",
  "date_debut": "2024-01-01T00:00:00.000Z",
  "date_fin": "2024-12-31T00:00:00.000Z",
  "statut": 1,
  "lieu": "Parish Hall",
  "code_unite_ecclesiale": 1,
  "code_type_activite": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street"
  },
  "activityType": {
    "code": 1,
    "libelle": "Catechism",
    "description": "Religious education and instruction"
  }
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities/1"
```

---

## 4. Update Activity

**Endpoint:** `PATCH /api/v1/activities/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON, VOLUNTEER

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "libelle": "Advanced Youth Bible Study",
  "description": "In-depth Bible study for young adults",
  "lieu": "Conference Room",
  "statut": 2
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Advanced Youth Bible Study",
  "date_activite": "2024-03-15T00:00:00.000Z",
  "description": "In-depth Bible study for young adults",
  "frequence": "weekly",
  "date_debut": "2024-01-01T00:00:00.000Z",
  "date_fin": "2024-12-31T00:00:00.000Z",
  "statut": 2,
  "lieu": "Conference Room",
  "code_unite_ecclesiale": 1,
  "code_type_activite": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T15:45:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/activities/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Advanced Youth Bible Study",
    "statut": 2
  }'
```

---

## 5. Delete Activity

**Endpoint:** `DELETE /api/v1/activities/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "message": "Activity successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/activities/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Activities Statistics

**Endpoint:** `GET /api/v1/activities/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 45,
  "upcoming": 18,
  "past": 27,
  "byStatus": {
    "planned": 5,
    "ongoing": 13,
    "completed": 27
  },
  "byFrequency": {
    "once": 10,
    "daily": 5,
    "weekly": 20,
    "monthly": 8,
    "yearly": 2
  },
  "byType": {
    "Catechism": 15,
    "Music Ministry": 8,
    "Youth Activities": 12,
    "Community Service": 10
  }
}
```

**Explanation:**
- `total`: Total number of activities
- `upcoming`: Activities scheduled in the future
- `past`: Activities that have already occurred
- `byStatus`: Count by activity status
- `byFrequency`: Count by frequency
- `byType`: Count by activity type

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities/stats"
```

---

## 7. Get Upcoming Activities

**Endpoint:** `GET /api/v1/activities/upcoming`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Maximum number of activities to return |

### Success Response (200)

```json
[
  {
    "code": 3,
    "libelle": "Parish Picnic",
    "date_activite": "2024-03-20T00:00:00.000Z",
    "description": "Annual parish community picnic",
    "frequence": "yearly",
    "date_debut": "2024-03-20T00:00:00.000Z",
    "date_fin": "2024-03-20T00:00:00.000Z",
    "statut": 0,
    "lieu": "Community Park",
    "code_unite_ecclesiale": 1,
    "code_type_activite": 3,
    "ecclesiasticalUnit": {
      "code": 1,
      "libelle": "St. Mary Parish"
    },
    "activityType": {
      "code": 3,
      "libelle": "Social Events"
    }
  },
  {
    "code": 4,
    "libelle": "Youth Retreat",
    "date_activite": "2024-04-05T00:00:00.000Z",
    "description": "Weekend spiritual retreat for youth",
    "frequence": "once",
    "statut": 0,
    "lieu": "Retreat Center",
    "code_unite_ecclesiale": 1,
    "code_type_activite": 4
  }
]
```

### cURL Example

```bash
# Get next 10 upcoming activities
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities/upcoming"

# Get next 20 upcoming activities
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities/upcoming?limit=20"
```

---

# ACTIVITY TYPES ENDPOINTS

## 8. Create Activity Type

**Endpoint:** `POST /api/v1/activities/types`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Request Body

```json
{
  "libelle": "Catechism",
  "description": "Religious education and instruction for children and adults"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Name of the activity type |
| description | string | No | Description of the activity type |

### Common Activity Types

- **Catechism**: Religious education
- **Youth Activities**: Youth ministry programs
- **Music Ministry**: Choir, instruments, liturgical music
- **Social Events**: Parish gatherings, picnics, celebrations
- **Community Service**: Charity work, outreach programs
- **Prayer Groups**: Bible study, rosary groups
- **Retreats**: Spiritual retreats and workshops
- **Sacrament Preparation**: Baptism, First Communion, Confirmation classes
- **Fundraising**: Parish fundraising events
- **Maintenance**: Church and property maintenance activities

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Catechism",
  "description": "Religious education and instruction for children and adults",
  "code_createur": 6,
  "code_modificateur": null,
  "date_creation": "2026-02-08T09:00:00.000Z"
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/activities/types \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Catechism",
    "description": "Religious education and instruction"
  }'
```

---

## 9. Get All Activity Types

**Endpoint:** `GET /api/v1/activities/types/all`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 1,
    "libelle": "Catechism",
    "description": "Religious education and instruction for children and adults",
    "code_createur": 6,
    "date_creation": "2026-02-08T09:00:00.000Z"
  },
  {
    "code": 2,
    "libelle": "Music Ministry",
    "description": "Choir and liturgical music activities",
    "code_createur": 6,
    "date_creation": "2026-02-08T09:15:00.000Z"
  },
  {
    "code": 3,
    "libelle": "Youth Activities",
    "description": "Programs and events for young people",
    "code_createur": 6,
    "date_creation": "2026-02-08T09:30:00.000Z"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities/types/all"
```

---

## 10. Get Activity Type by ID

**Endpoint:** `GET /api/v1/activities/types/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Catechism",
  "description": "Religious education and instruction for children and adults",
  "code_createur": 6,
  "code_modificateur": null,
  "date_creation": "2026-02-08T09:00:00.000Z",
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
  "http://localhost:3000/api/v1/activities/types/1"
```

---

## 11. Update Activity Type

**Endpoint:** `PATCH /api/v1/activities/types/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Request Body

All fields are optional.

```json
{
  "libelle": "Advanced Catechism",
  "description": "Advanced religious education for adults"
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Advanced Catechism",
  "description": "Advanced religious education for adults",
  "code_createur": 6,
  "code_modificateur": 6,
  "date_creation": "2026-02-08T09:00:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/activities/types/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Advanced religious education for adults"
  }'
```

---

## 12. Delete Activity Type

**Endpoint:** `DELETE /api/v1/activities/types/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Success Response (200)

```json
{
  "message": "Activity type successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/activities/types/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "libelle should not be empty",
    "code_unite_ecclesiale must be an integer number"
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
  "message": "Activity not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Schedule Weekly Youth Bible Study

```bash
curl -X POST http://localhost:3000/api/v1/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Youth Bible Study",
    "description": "Weekly Bible study for ages 13-18",
    "frequence": "weekly",
    "date_debut": "2024-01-07",
    "date_fin": "2024-12-29",
    "lieu": "Youth Center",
    "statut": 1,
    "code_unite_ecclesiale": 1,
    "code_type_activite": 1
  }'
```

### Use Case 2: Plan One-Time Parish Picnic

```bash
curl -X POST http://localhost:3000/api/v1/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Annual Parish Picnic",
    "date_activite": "2024-07-15",
    "description": "Family-friendly community gathering with food and games",
    "frequence": "once",
    "lieu": "Community Park",
    "statut": 0,
    "code_unite_ecclesiale": 1,
    "code_type_activite": 3
  }'
```

### Use Case 3: Create Activity Type for New Ministry

```bash
curl -X POST http://localhost:3000/api/v1/activities/types \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Prison Ministry",
    "description": "Outreach and support for incarcerated individuals"
  }'
```

### Use Case 4: Get All Catechism Classes

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities?code_type_activite=1"
```

### Use Case 5: View Upcoming Parish Events

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/activities/upcoming?limit=15"
```

### Use Case 6: Mark Activity as Completed

```bash
curl -X PATCH http://localhost:3000/api/v1/activities/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "statut": 2
  }'
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
   - Navigate to **"Activities"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **12 Comprehensive Endpoints**
✅ **Full CRUD for Activities**
✅ **Full CRUD for Activity Types**
✅ **Advanced Filtering** (by unit, type, frequency, status, date range)
✅ **Recurring Activities Support** (Daily, Weekly, Monthly, Yearly)
✅ **Status Tracking** (Planned, Ongoing, Completed)
✅ **Upcoming Activities Feed**
✅ **Statistics & Reporting**
✅ **Volunteer Permissions** (can create and manage activities)
✅ **Role-Based Access Control**

**All endpoints are production-ready and fully documented!** 🎉⛪📅
