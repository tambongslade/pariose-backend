# Celebrations (Eucharistic Celebrations) API Documentation

## Base URL
`/api/v1/celebrations`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

### Celebrations Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/celebrations` | Create new celebration | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/celebrations` | Get all celebrations with filtering | Authenticated users |
| GET | `/celebrations/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/celebrations/:id` | Get single celebration | Authenticated users |
| PATCH | `/celebrations/:id` | Update celebration | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| DELETE | `/celebrations/:id` | Delete celebration | ADMIN, SUPER_ADMIN, PRIEST |

### Mass Intentions Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/celebrations/intentions` | Create mass intention | Authenticated users |
| GET | `/celebrations/intentions/all` | Get all mass intentions | Authenticated users |
| GET | `/celebrations/intentions/:id` | Get single mass intention | Authenticated users |
| PATCH | `/celebrations/intentions/:id` | Update mass intention | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| DELETE | `/celebrations/intentions/:id` | Delete mass intention | ADMIN, SUPER_ADMIN, PRIEST, DEACON |

---

# CELEBRATIONS ENDPOINTS

## 1. Create Celebration

**Endpoint:** `POST /api/v1/celebrations`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

```json
{
  "libelle": "Sunday Morning Mass",
  "granularite": "weekly",
  "code_horaire": "09:00",
  "code_type": "regular",
  "code_unite_ecclesiale": 1
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Name of the celebration |
| granularite | string | No | Frequency: `daily`, `weekly`, `monthly`, `yearly`, `once` |
| code_horaire | string | No | Time in HH:mm format (e.g., "09:00") |
| code_type | string | No | Type: `regular`, `special`, `feast`, `wedding`, `funeral`, `baptism` |
| code_unite_ecclesiale | number | **Yes** | Ecclesiastical unit ID where celebration takes place |

### Celebration Types

- **regular**: Regular daily/weekly mass
- **special**: Special occasion mass
- **feast**: Feast day celebration
- **wedding**: Wedding ceremony
- **funeral**: Funeral mass
- **baptism**: Baptism ceremony

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Sunday Morning Mass",
  "granularite": "weekly",
  "code_horaire": "09:00",
  "code_type": "regular",
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
curl -X POST http://localhost:3000/api/v1/celebrations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Sunday Morning Mass",
    "granularite": "weekly",
    "code_horaire": "09:00",
    "code_type": "regular",
    "code_unite_ecclesiale": 1
  }'
```

---

## 2. Get All Celebrations

**Endpoint:** `GET /api/v1/celebrations`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in celebration name |
| code_unite_ecclesiale | number | No | - | Filter by ecclesiastical unit |
| granularite | string | No | - | Filter by frequency |
| code_type | string | No | - | Filter by type |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all celebrations
GET /api/v1/celebrations

# Search by name
GET /api/v1/celebrations?search=Sunday

# Filter by ecclesiastical unit
GET /api/v1/celebrations?code_unite_ecclesiale=1

# Filter by frequency
GET /api/v1/celebrations?granularite=weekly

# Filter by type
GET /api/v1/celebrations?code_type=regular

# Combine filters
GET /api/v1/celebrations?code_unite_ecclesiale=1&granularite=weekly&page=1&limit=20
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Sunday Morning Mass",
      "granularite": "weekly",
      "code_horaire": "09:00",
      "code_type": "regular",
      "code_unite_ecclesiale": 1,
      "date_creation": "2026-02-08T10:30:00.000Z",
      "date_modification": "2026-02-08T10:30:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish",
        "titre": "Parish"
      },
      "intentions": []
    },
    {
      "code": 2,
      "libelle": "Evening Mass",
      "granularite": "daily",
      "code_horaire": "18:00",
      "code_type": "regular",
      "code_unite_ecclesiale": 1,
      "date_creation": "2026-02-08T11:00:00.000Z",
      "date_modification": "2026-02-08T11:00:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish",
        "titre": "Parish"
      },
      "intentions": []
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
# Get all celebrations
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations"

# Filter by unit
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations?code_unite_ecclesiale=1&limit=20"
```

---

## 3. Get Celebration by ID

**Endpoint:** `GET /api/v1/celebrations/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Sunday Morning Mass",
  "granularite": "weekly",
  "code_horaire": "09:00",
  "code_type": "regular",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street",
    "code_type": 2
  },
  "intentions": [
    {
      "code": 1,
      "intention_messe": "For the repose of the soul of John Doe",
      "montant_verse": "5000.00",
      "date_versement": "2026-02-07",
      "code_createur": 5,
      "date_creation": "2026-02-08T09:00:00.000Z"
    }
  ]
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations/1"
```

---

## 4. Update Celebration

**Endpoint:** `PATCH /api/v1/celebrations/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "libelle": "Sunday High Mass",
  "code_horaire": "10:00",
  "code_type": "special"
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Sunday High Mass",
  "granularite": "weekly",
  "code_horaire": "10:00",
  "code_type": "special",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T14:20:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/celebrations/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Sunday High Mass",
    "code_horaire": "10:00"
  }'
```

---

## 5. Delete Celebration

**Endpoint:** `DELETE /api/v1/celebrations/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Success Response (200)

```json
{
  "message": "Celebration successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/celebrations/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Celebrations Statistics

**Endpoint:** `GET /api/v1/celebrations/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 45,
  "upcoming": 12,
  "past": 33,
  "byType": {
    "regular": 35,
    "special": 5,
    "feast": 3,
    "wedding": 1,
    "funeral": 1
  },
  "byFrequency": {
    "daily": 10,
    "weekly": 25,
    "monthly": 5,
    "yearly": 3,
    "once": 2
  }
}
```

**Explanation:**
- `total`: Total number of celebrations
- `upcoming`: Celebrations scheduled in the future
- `past`: Celebrations that have already occurred
- `byType`: Count by celebration type
- `byFrequency`: Count by frequency

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations/stats"
```

---

# MASS INTENTIONS ENDPOINTS

## 7. Create Mass Intention

**Endpoint:** `POST /api/v1/celebrations/intentions`

**Permissions:** Authenticated users

### Request Body

```json
{
  "intention_messe": "For the repose of the soul of John Doe",
  "code_celebration_eucharistique": 1,
  "montant_verse": 5000,
  "date_versement": "2026-02-07"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| intention_messe | string | **Yes** | The intention for the mass |
| code_celebration_eucharistique | number | **Yes** | Celebration ID |
| montant_verse | number | No | Amount paid (minimum 0) |
| date_versement | string | No | Payment date (ISO 8601) |

### Common Mass Intentions

- "For the repose of the soul of [Name]" - Deceased person
- "For the health and recovery of [Name]" - Sick person
- "In thanksgiving for blessings received" - Gratitude
- "For peace in the family of [Name]" - Family intentions
- "For the success of [Event/Person]" - Special intentions
- "For vocations to the priesthood" - Vocations
- "For the souls in purgatory" - General deceased

### Success Response (201)

```json
{
  "code": 1,
  "intention_messe": "For the repose of the soul of John Doe",
  "code_celebration_eucharistique": 1,
  "montant_verse": "5000.00",
  "date_versement": "2026-02-07",
  "code_createur": 5,
  "code_modificateur": null,
  "date_creation": "2026-02-08T09:00:00.000Z",
  "date_modification": "2026-02-08T09:00:00.000Z",
  "celebration": {
    "code": 1,
    "libelle": "Sunday Morning Mass"
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/celebrations/intentions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "intention_messe": "For the repose of the soul of John Doe",
    "code_celebration_eucharistique": 1,
    "montant_verse": 5000,
    "date_versement": "2026-02-07"
  }'
```

---

## 8. Get All Mass Intentions

**Endpoint:** `GET /api/v1/celebrations/intentions/all`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| celebrationId | number | No | Filter by celebration ID |

### Examples

```bash
# Get all mass intentions
GET /api/v1/celebrations/intentions/all

# Filter by celebration
GET /api/v1/celebrations/intentions/all?celebrationId=1
```

### Success Response (200)

```json
[
  {
    "code": 1,
    "intention_messe": "For the repose of the soul of John Doe",
    "code_celebration_eucharistique": 1,
    "montant_verse": "5000.00",
    "date_versement": "2026-02-07",
    "code_createur": 5,
    "date_creation": "2026-02-08T09:00:00.000Z",
    "date_modification": "2026-02-08T09:00:00.000Z",
    "celebration": {
      "code": 1,
      "libelle": "Sunday Morning Mass",
      "code_horaire": "09:00"
    },
    "creator": {
      "code": 5,
      "username": "john_smith",
      "noms": "Smith",
      "prenoms": "John"
    }
  },
  {
    "code": 2,
    "intention_messe": "For the health of Mary Johnson",
    "code_celebration_eucharistique": 1,
    "montant_verse": "3000.00",
    "date_versement": "2026-02-08",
    "code_createur": 6,
    "date_creation": "2026-02-08T10:00:00.000Z",
    "date_modification": "2026-02-08T10:00:00.000Z",
    "celebration": {
      "code": 1,
      "libelle": "Sunday Morning Mass",
      "code_horaire": "09:00"
    },
    "creator": {
      "code": 6,
      "username": "jane_doe",
      "noms": "Doe",
      "prenoms": "Jane"
    }
  }
]
```

### cURL Example

```bash
# Get all intentions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations/intentions/all"

# Filter by celebration
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations/intentions/all?celebrationId=1"
```

---

## 9. Get Mass Intention by ID

**Endpoint:** `GET /api/v1/celebrations/intentions/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "intention_messe": "For the repose of the soul of John Doe",
  "code_celebration_eucharistique": 1,
  "montant_verse": "5000.00",
  "date_versement": "2026-02-07",
  "code_createur": 5,
  "code_modificateur": null,
  "date_creation": "2026-02-08T09:00:00.000Z",
  "date_modification": "2026-02-08T09:00:00.000Z",
  "celebration": {
    "code": 1,
    "libelle": "Sunday Morning Mass",
    "granularite": "weekly",
    "code_horaire": "09:00",
    "code_type": "regular"
  },
  "creator": {
    "code": 5,
    "username": "john_smith",
    "noms": "Smith",
    "prenoms": "John"
  }
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations/intentions/1"
```

---

## 10. Update Mass Intention

**Endpoint:** `PATCH /api/v1/celebrations/intentions/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "intention_messe": "For the eternal rest of John Doe's soul",
  "montant_verse": 7000
}
```

### Success Response (200)

```json
{
  "code": 1,
  "intention_messe": "For the eternal rest of John Doe's soul",
  "code_celebration_eucharistique": 1,
  "montant_verse": "7000.00",
  "date_versement": "2026-02-07",
  "code_createur": 5,
  "code_modificateur": 6,
  "date_creation": "2026-02-08T09:00:00.000Z",
  "date_modification": "2026-02-08T15:30:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/celebrations/intentions/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "intention_messe": "For the eternal rest of John Doe soul",
    "montant_verse": 7000
  }'
```

---

## 11. Delete Mass Intention

**Endpoint:** `DELETE /api/v1/celebrations/intentions/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "message": "Mass intention successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/celebrations/intentions/1 \
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
  "message": "Celebration not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Schedule Weekly Sunday Mass

```bash
curl -X POST http://localhost:3000/api/v1/celebrations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Sunday High Mass",
    "granularite": "weekly",
    "code_horaire": "10:00",
    "code_type": "regular",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 2: Schedule a Wedding Ceremony

```bash
curl -X POST http://localhost:3000/api/v1/celebrations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Wedding of John & Mary",
    "granularite": "once",
    "code_horaire": "14:00",
    "code_type": "wedding",
    "code_unite_ecclesiale": 2
  }'
```

### Use Case 3: Submit a Mass Intention for a Deceased Relative

```bash
curl -X POST http://localhost:3000/api/v1/celebrations/intentions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "intention_messe": "For the repose of the soul of my father, Robert Smith",
    "code_celebration_eucharistique": 1,
    "montant_verse": 5000,
    "date_versement": "2026-02-08"
  }'
```

### Use Case 4: Get All Celebrations for a Specific Parish

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations?code_unite_ecclesiale=1"
```

### Use Case 5: View All Mass Intentions for Sunday Mass

```bash
# First get the celebration ID
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations?search=Sunday"

# Then get intentions for that celebration
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/celebrations/intentions/all?celebrationId=1"
```

### Use Case 6: Schedule Daily Evening Mass

```bash
curl -X POST http://localhost:3000/api/v1/celebrations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Daily Evening Mass",
    "granularite": "daily",
    "code_horaire": "18:00",
    "code_type": "regular",
    "code_unite_ecclesiale": 1
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
   - Navigate to **"Celebrations"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **11 Comprehensive Endpoints**
✅ **Full CRUD for Celebrations**
✅ **Full CRUD for Mass Intentions**
✅ **Advanced Filtering & Pagination**
✅ **Multiple Celebration Types** (Regular, Special, Feast, Wedding, Funeral, Baptism)
✅ **Frequency Support** (Daily, Weekly, Monthly, Yearly, Once)
✅ **Mass Intention Management** with offering tracking
✅ **Statistics & Reporting**
✅ **Role-Based Access Control**

**All endpoints are production-ready and fully documented!** 🎉⛪✨
