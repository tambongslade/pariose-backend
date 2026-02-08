# Confessions (Reconciliation Schedules) API Documentation

## Base URL
`/api/v1/confessions`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/confessions` | Create new confession schedule | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/confessions` | Get all confession schedules | Authenticated users |
| GET | `/confessions/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/confessions/unit/:unitId` | Get schedules by unit | Authenticated users |
| GET | `/confessions/:id` | Get single schedule | Authenticated users |
| PATCH | `/confessions/:id` | Update schedule | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| DELETE | `/confessions/:id` | Delete schedule | ADMIN, SUPER_ADMIN, PRIEST, DEACON |

---

## 1. Create Confession Schedule

**Endpoint:** `POST /api/v1/confessions`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

```json
{
  "lieu": "Main Church Confessional",
  "horaire_debut": "15:00",
  "horaire_fin": "17:00",
  "granularite": "weekly",
  "code_unite_ecclesiale": 1
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lieu | string | No | Location where confession is held |
| horaire_debut | string | No | Start time (HH:mm or HH:mm:ss format) |
| horaire_fin | string | No | End time (HH:mm or HH:mm:ss format) |
| granularite | string | No | Frequency: `daily`, `weekly`, `monthly`, `on_demand` |
| code_unite_ecclesiale | number | No | Ecclesiastical unit ID |

### Frequency Options

- **daily**: Confession available every day
- **weekly**: Confession available on specific day(s) each week
- **monthly**: Confession available on specific day(s) each month
- **on_demand**: Confession by appointment only

### Success Response (201)

```json
{
  "code": 1,
  "lieu": "Main Church Confessional",
  "horaire_debut": "15:00:00",
  "horaire_fin": "17:00:00",
  "granularite": "weekly",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street"
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/confessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lieu": "Main Church Confessional",
    "horaire_debut": "15:00",
    "horaire_fin": "17:00",
    "granularite": "weekly",
    "code_unite_ecclesiale": 1
  }'
```

---

## 2. Get All Confession Schedules

**Endpoint:** `GET /api/v1/confessions`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in location |
| code_unite_ecclesiale | number | No | - | Filter by ecclesiastical unit |
| granularite | string | No | - | Filter by frequency |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all confession schedules
GET /api/v1/confessions

# Search by location
GET /api/v1/confessions?search=Main

# Filter by ecclesiastical unit
GET /api/v1/confessions?code_unite_ecclesiale=1

# Filter by frequency
GET /api/v1/confessions?granularite=weekly

# Combine filters
GET /api/v1/confessions?code_unite_ecclesiale=1&granularite=weekly&page=1&limit=20
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "lieu": "Main Church Confessional",
      "horaire_debut": "15:00:00",
      "horaire_fin": "17:00:00",
      "granularite": "weekly",
      "code_unite_ecclesiale": 1,
      "date_creation": "2026-02-08T10:30:00.000Z",
      "date_modification": "2026-02-08T10:30:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish",
        "titre": "Parish"
      }
    },
    {
      "code": 2,
      "lieu": "Chapel Confessional Room",
      "horaire_debut": "18:00:00",
      "horaire_fin": "19:00:00",
      "granularite": "daily",
      "code_unite_ecclesiale": 1,
      "date_creation": "2026-02-08T11:00:00.000Z",
      "date_modification": "2026-02-08T11:00:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish",
        "titre": "Parish"
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
# Get all confessions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/confessions"

# Filter by unit
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/confessions?code_unite_ecclesiale=1"
```

---

## 3. Get Confession Schedule by ID

**Endpoint:** `GET /api/v1/confessions/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "lieu": "Main Church Confessional",
  "horaire_debut": "15:00:00",
  "horaire_fin": "17:00:00",
  "granularite": "weekly",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street",
    "code_type": 2
  }
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/confessions/1"
```

---

## 4. Update Confession Schedule

**Endpoint:** `PATCH /api/v1/confessions/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "horaire_debut": "14:00",
  "horaire_fin": "16:00",
  "lieu": "Reconciliation Room"
}
```

### Success Response (200)

```json
{
  "code": 1,
  "lieu": "Reconciliation Room",
  "horaire_debut": "14:00:00",
  "horaire_fin": "16:00:00",
  "granularite": "weekly",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T15:45:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/confessions/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "horaire_debut": "14:00",
    "horaire_fin": "16:00"
  }'
```

---

## 5. Delete Confession Schedule

**Endpoint:** `DELETE /api/v1/confessions/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "message": "Confession schedule successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/confessions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Confession Statistics

**Endpoint:** `GET /api/v1/confessions/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 12,
  "byFrequency": {
    "daily": 3,
    "weekly": 6,
    "monthly": 2,
    "on_demand": 1
  },
  "byUnit": {
    "St. Mary Parish": 5,
    "Sacred Heart Chapel": 4,
    "Holy Trinity Church": 3
  }
}
```

**Explanation:**
- `total`: Total number of confession schedules
- `byFrequency`: Count by frequency type
- `byUnit`: Count by ecclesiastical unit

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/confessions/stats"
```

---

## 7. Get Confession Schedules by Unit

**Endpoint:** `GET /api/v1/confessions/unit/:unitId`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 1,
    "lieu": "Main Church Confessional",
    "horaire_debut": "15:00:00",
    "horaire_fin": "17:00:00",
    "granularite": "weekly",
    "code_unite_ecclesiale": 1,
    "date_creation": "2026-02-08T10:30:00.000Z",
    "date_modification": "2026-02-08T10:30:00.000Z"
  },
  {
    "code": 2,
    "lieu": "Chapel Confessional Room",
    "horaire_debut": "18:00:00",
    "horaire_fin": "19:00:00",
    "granularite": "daily",
    "code_unite_ecclesiale": 1,
    "date_creation": "2026-02-08T11:00:00.000Z",
    "date_modification": "2026-02-08T11:00:00.000Z"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/confessions/unit/1"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "horaire_debut must be in HH:mm or HH:mm:ss format"
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
  "message": "Confession schedule not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Schedule Weekly Saturday Confessions

```bash
curl -X POST http://localhost:3000/api/v1/confessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lieu": "Main Church Confessional",
    "horaire_debut": "15:00",
    "horaire_fin": "17:00",
    "granularite": "weekly",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 2: Add Daily Evening Confessions

```bash
curl -X POST http://localhost:3000/api/v1/confessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lieu": "Chapel Reconciliation Room",
    "horaire_debut": "18:00",
    "horaire_fin": "19:00",
    "granularite": "daily",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 3: Setup By-Appointment Confessions

```bash
curl -X POST http://localhost:3000/api/v1/confessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lieu": "Priest Office",
    "granularite": "on_demand",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 4: Get Parish Confession Schedule for Website

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/confessions/unit/1"
```

### Use Case 5: Adjust Lenten Confession Hours

```bash
curl -X PATCH http://localhost:3000/api/v1/confessions/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "horaire_debut": "14:00",
    "horaire_fin": "18:00",
    "granularite": "daily"
  }'
```

---

## Common Confession Schedules

### Traditional Weekly Schedule
```json
{
  "lieu": "Confessional 1",
  "horaire_debut": "15:00",
  "horaire_fin": "17:00",
  "granularite": "weekly",
  "code_unite_ecclesiale": 1
}
```

### Before Weekend Masses
```json
{
  "lieu": "Main Church",
  "horaire_debut": "16:30",
  "horaire_fin": "16:55",
  "granularite": "weekly",
  "code_unite_ecclesiale": 1
}
```

### Daily During Lent/Advent
```json
{
  "lieu": "Chapel",
  "horaire_debut": "17:00",
  "horaire_fin": "18:00",
  "granularite": "daily",
  "code_unite_ecclesiale": 1
}
```

### First Friday of Month
```json
{
  "lieu": "Adoration Chapel",
  "horaire_debut": "09:00",
  "horaire_fin": "11:00",
  "granularite": "monthly",
  "code_unite_ecclesiale": 1
}
```

### By Appointment
```json
{
  "lieu": "Parish Office",
  "granularite": "on_demand",
  "code_unite_ecclesiale": 1
}
```

---

## Best Practices

### 1. Multiple Time Slots
Create separate schedules for different time slots:
```bash
# Saturday afternoon
POST /api/v1/confessions
{
  "lieu": "Main Confessional",
  "horaire_debut": "15:00",
  "horaire_fin": "17:00",
  "granularite": "weekly"
}

# Saturday before evening Mass
POST /api/v1/confessions
{
  "lieu": "Main Confessional",
  "horaire_debut": "16:30",
  "horaire_fin": "16:55",
  "granularite": "weekly"
}
```

### 2. Different Locations
Specify different confessionals or rooms:
- "Main Church Confessional"
- "Chapel Reconciliation Room"
- "Priest's Office"
- "Adoration Chapel"

### 3. Seasonal Adjustments
Update schedules for special liturgical seasons:
- Extended hours during Lent and Advent
- Additional confessors during Holy Week
- Special times for First Fridays

### 4. Clear Communication
Include location details parishioners need:
- Building name
- Room number
- Specific confessional booth
- Accessibility information

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
   - Navigate to **"Confessions"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **7 Comprehensive Endpoints**
✅ **Full CRUD for Confession Schedules**
✅ **Frequency Options** (Daily, Weekly, Monthly, On-Demand)
✅ **Time Range Tracking** (Start and end times)
✅ **Location Management**
✅ **Unit-Specific Schedules**
✅ **Advanced Filtering** (by unit, frequency, location)
✅ **Statistics & Reporting**
✅ **Role-Based Access Control**

**Perfect for parish websites and apps to help parishioners find confession times!** 🎉⛪✝️
