# Ecclesiastical Units API Documentation

## Base URL
`/api/v1/ecclesiastical-units`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/ecclesiastical-units` | Create new unit | ADMIN, SUPER_ADMIN, PRIEST |
| GET | `/ecclesiastical-units` | Get all units with filtering | Authenticated users |
| GET | `/ecclesiastical-units/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/ecclesiastical-units/hierarchy` | Get hierarchical tree | Authenticated users |
| GET | `/ecclesiastical-units/my-subscriptions` | Get user subscriptions | Authenticated users |
| GET | `/ecclesiastical-units/:id` | Get single unit | Authenticated users |
| GET | `/ecclesiastical-units/:id/subscribers` | Get unit subscribers | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| PATCH | `/ecclesiastical-units/:id` | Update unit | ADMIN, SUPER_ADMIN, PRIEST |
| DELETE | `/ecclesiastical-units/:id` | Delete unit | ADMIN, SUPER_ADMIN |
| POST | `/ecclesiastical-units/:id/subscribe` | Subscribe to unit | Authenticated users |
| DELETE | `/ecclesiastical-units/:id/subscribe` | Unsubscribe from unit | Authenticated users |

---

## 1. Create Ecclesiastical Unit

**Endpoint:** `POST /api/v1/ecclesiastical-units`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Request Body

```json
{
  "libelle": "Saint Mary Parish",
  "description": "A vibrant parish community serving the local Catholic population",
  "titre": "Parish",
  "adresse": "123 Church Street, Yaounde, Cameroon",
  "code_type": 1,
  "longitude": 11.5021,
  "latitude": 3.848,
  "altitude": 750,
  "fidele": "Approximately 5000 registered parishioners",
  "date_creation_unite": "2010-06-15",
  "statut_canonique": "Established Parish",
  "code_unite_parent": 1,
  "activite": "Daily Mass, Catechism, Youth Ministry",
  "translations": [
    {
      "languageCode": "en",
      "nom": "Saint Mary Parish",
      "description": "A welcoming Catholic community",
      "adresse": "123 Church Street, Yaounde, Cameroon"
    },
    {
      "languageCode": "fr",
      "nom": "Paroisse Sainte-Marie",
      "description": "Une communauté catholique accueillante",
      "adresse": "123 rue de l'Église, Yaounde, Cameroun"
    }
  ]
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Name of the ecclesiastical unit |
| description | string | No | Detailed description |
| titre | string | No | Title/designation (e.g., "Parish", "Diocese") |
| adresse | string | No | Physical address |
| code_type | number | No | Type code (1=Diocese, 2=Parish, 3=Chapel, etc.) |
| longitude | number | No | GPS longitude (-180 to 180) |
| latitude | number | No | GPS latitude (-90 to 90) |
| altitude | number | No | Altitude in meters |
| fidele | string | No | Information about parishioners |
| date_creation_unite | string | No | Date unit was established (ISO 8601) |
| statut_canonique | string | No | Canonical status |
| code_unite_parent | number | No | Parent unit ID for hierarchy |
| activite | string | No | Associated activities |
| translations | array | No | Multilingual translations |

### Success Response (201)

```json
{
  "code": 4,
  "libelle": "Saint Mary Parish",
  "description": "A vibrant parish community serving the local Catholic population",
  "titre": "Parish",
  "adresse": "123 Church Street, Yaounde, Cameroon",
  "code_type": 1,
  "longitude": "11.5021000",
  "latitude": "3.8480000",
  "altitude": "750.00",
  "fidele": "Approximately 5000 registered parishioners",
  "date_creation_unite": "2010-06-15T00:00:00.000Z",
  "statut_canonique": "Established Parish",
  "code_unite_parent": 1,
  "activite": "Daily Mass, Catechism, Youth Ministry",
  "code_createur": 6,
  "code_modificateur": null,
  "date_creation": "2026-02-08T09:15:30.000Z",
  "date_modification": "2026-02-08T09:15:30.000Z",
  "translations": [
    {
      "id": 1,
      "nom": "Saint Mary Parish",
      "description": "A welcoming Catholic community",
      "adresse": "123 Church Street, Yaounde, Cameroon",
      "languageCode": "en",
      "ecclesiasticalUnitCode": 4
    },
    {
      "id": 2,
      "nom": "Paroisse Sainte-Marie",
      "description": "Une communauté catholique accueillante",
      "adresse": "123 rue de l'Église, Yaounde, Cameroun",
      "languageCode": "fr",
      "ecclesiasticalUnitCode": 4
    }
  ]
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/ecclesiastical-units \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Saint Mary Parish",
    "description": "A vibrant parish community",
    "titre": "Parish",
    "adresse": "123 Church Street, Yaounde, Cameroon",
    "code_type": 1,
    "longitude": 11.5021,
    "latitude": 3.848,
    "translations": [
      {
        "languageCode": "en",
        "nom": "Saint Mary Parish",
        "description": "A welcoming Catholic community"
      }
    ]
  }'
```

---

## 2. Get All Ecclesiastical Units

**Endpoint:** `GET /api/v1/ecclesiastical-units`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in name or description |
| code_type | number | No | - | Filter by type code |
| code_unite_parent | number | No | - | Filter by parent unit |
| statut_canonique | string | No | - | Filter by canonical status |
| latitude | number | No | - | Latitude for location search |
| longitude | number | No | - | Longitude for location search |
| radius | number | No | - | Search radius in km (with lat/long) |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all units (first page)
GET /api/v1/ecclesiastical-units

# Search by name
GET /api/v1/ecclesiastical-units?search=Mary

# Filter by type
GET /api/v1/ecclesiastical-units?code_type=1

# Filter by parent unit
GET /api/v1/ecclesiastical-units?code_unite_parent=1

# Location-based search (within 10km)
GET /api/v1/ecclesiastical-units?latitude=3.848&longitude=11.5021&radius=10

# Pagination
GET /api/v1/ecclesiastical-units?page=2&limit=20

# Combined filters
GET /api/v1/ecclesiastical-units?search=parish&code_type=2&page=1&limit=10
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Diocese of Paris",
      "description": "Main diocese covering the Paris region",
      "titre": "Diocese",
      "adresse": "Notre-Dame Cathedral, Paris",
      "code_type": 1,
      "longitude": "2.3522000",
      "latitude": "48.8566000",
      "altitude": "35.00",
      "fidele": null,
      "date_creation_unite": null,
      "statut_canonique": "Metropolitan See",
      "code_unite_parent": null,
      "activite": null,
      "code_createur": 1,
      "code_modificateur": null,
      "date_creation": "2026-02-07T19:04:38.084Z",
      "date_modification": "2026-02-07T19:04:38.084Z"
    },
    {
      "code": 2,
      "libelle": "St. Mary Parish",
      "description": "Local parish serving the community",
      "titre": "Parish",
      "adresse": "45 Main Street",
      "code_type": 2,
      "longitude": "2.3500000",
      "latitude": "48.8500000",
      "altitude": null,
      "fidele": null,
      "date_creation_unite": null,
      "statut_canonique": "Established",
      "code_unite_parent": 1,
      "activite": null,
      "code_createur": 2,
      "code_modificateur": null,
      "date_creation": "2026-02-07T19:15:22.113Z",
      "date_modification": "2026-02-07T19:15:22.113Z"
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
# Get all units
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units"

# Search with filters
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units?search=parish&page=1&limit=20"
```

---

## 3. Get Ecclesiastical Unit by ID

**Endpoint:** `GET /api/v1/ecclesiastical-units/:id`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lang | string | No | Language code (e.g., "en", "fr") for translated content |

### Examples

```bash
# Get unit without translations
GET /api/v1/ecclesiastical-units/1

# Get unit with English translation
GET /api/v1/ecclesiastical-units/1?lang=en

# Get unit with French translation
GET /api/v1/ecclesiastical-units/1?lang=fr
```

### Success Response (200) - Without Language

```json
{
  "code": 1,
  "libelle": "Diocese of Paris",
  "description": "Main diocese covering the Paris region",
  "titre": "Diocese",
  "adresse": "Notre-Dame Cathedral, Paris",
  "code_type": 1,
  "longitude": "2.3522000",
  "latitude": "48.8566000",
  "altitude": "35.00",
  "fidele": null,
  "date_creation_unite": null,
  "statut_canonique": "Metropolitan See",
  "code_unite_parent": null,
  "activite": null,
  "code_createur": 1,
  "code_modificateur": null,
  "date_creation": "2026-02-07T19:04:38.084Z",
  "date_modification": "2026-02-07T19:04:38.084Z",
  "parent": null,
  "children": [
    {
      "code": 2,
      "libelle": "St. Mary Parish"
    }
  ],
  "translations": [
    {
      "id": 1,
      "nom": "Diocese of Paris",
      "description": "Main diocese covering the Paris region",
      "adresse": "Notre-Dame Cathedral, Paris",
      "languageCode": "en"
    }
  ]
}
```

### Success Response (200) - With Language (lang=fr)

```json
{
  "code": 1,
  "libelle": "Diocèse de Paris",
  "description": "Diocèse principal couvrant la région parisienne",
  "titre": "Diocèse",
  "adresse": "Cathédrale Notre-Dame, Paris",
  "code_type": 1,
  "longitude": "2.3522000",
  "latitude": "48.8566000",
  "altitude": "35.00",
  "language": "fr"
}
```

### cURL Example

```bash
# Get unit by ID
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/1"

# Get unit in French
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/1?lang=fr"
```

---

## 4. Update Ecclesiastical Unit

**Endpoint:** `PATCH /api/v1/ecclesiastical-units/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "libelle": "Saint Mary Cathedral Parish",
  "description": "Updated description",
  "titre": "Cathedral Parish",
  "adresse": "456 New Street, Yaounde, Cameroon",
  "code_type": 2,
  "longitude": 11.5025,
  "latitude": 3.850,
  "altitude": 755,
  "fidele": "Over 6000 registered parishioners",
  "statut_canonique": "Cathedral Parish",
  "activite": "Daily Mass, Catechism, Youth Ministry, Choir"
}
```

### Success Response (200)

```json
{
  "code": 4,
  "libelle": "Saint Mary Cathedral Parish",
  "description": "Updated description",
  "titre": "Cathedral Parish",
  "adresse": "456 New Street, Yaounde, Cameroon",
  "code_type": 2,
  "longitude": "11.5025000",
  "latitude": "3.8500000",
  "altitude": "755.00",
  "fidele": "Over 6000 registered parishioners",
  "date_creation_unite": "2010-06-15T00:00:00.000Z",
  "statut_canonique": "Cathedral Parish",
  "code_unite_parent": 1,
  "activite": "Daily Mass, Catechism, Youth Ministry, Choir",
  "code_createur": 6,
  "code_modificateur": 6,
  "date_creation": "2026-02-08T09:15:30.000Z",
  "date_modification": "2026-02-08T10:30:45.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/ecclesiastical-units/4 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Saint Mary Cathedral Parish",
    "description": "Updated description"
  }'
```

---

## 5. Delete Ecclesiastical Unit

**Endpoint:** `DELETE /api/v1/ecclesiastical-units/:id`

**Permissions:** ADMIN, SUPER_ADMIN

### Success Response (200)

```json
{
  "message": "Ecclesiastical unit successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/ecclesiastical-units/4 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Ecclesiastical Units Statistics

**Endpoint:** `GET /api/v1/ecclesiastical-units/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 45,
  "byType": {
    "1": 5,
    "2": 35,
    "3": 5
  },
  "byParentUnit": {
    "1": 20,
    "2": 15,
    "null": 5
  }
}
```

**Explanation:**
- `total`: Total number of ecclesiastical units
- `byType`: Count of units by type code
  - `1` = Dioceses
  - `2` = Parishes
  - `3` = Chapels
- `byParentUnit`: Count of units by their parent unit

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/stats"
```

---

## 7. Get Hierarchical Tree

**Endpoint:** `GET /api/v1/ecclesiastical-units/hierarchy`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| rootId | number | No | Root unit ID to start hierarchy from |

### Success Response (200)

```json
[
  {
    "id": 1,
    "name": "Diocese of Paris",
    "type": "Diocese",
    "code_type": 1,
    "adresse": "Notre-Dame Cathedral, Paris",
    "children": [
      {
        "id": 2,
        "name": "St. Mary Parish",
        "type": "Parish",
        "code_type": 2,
        "adresse": "45 Main Street",
        "children": [
          {
            "id": 3,
            "name": "Sacred Heart Chapel",
            "type": "Chapel",
            "code_type": 3,
            "adresse": "10 Chapel Road",
            "children": []
          }
        ]
      }
    ]
  }
]
```

### cURL Example

```bash
# Get full hierarchy
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/hierarchy"

# Get hierarchy starting from a specific unit
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/hierarchy?rootId=1"
```

---

## 8. Get My Subscriptions

**Endpoint:** `GET /api/v1/ecclesiastical-units/my-subscriptions`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 2,
    "libelle": "St. Mary Parish",
    "description": "Local parish serving the community",
    "titre": "Parish",
    "adresse": "45 Main Street",
    "code_type": 2,
    "date_creation": "2026-02-07T19:15:22.113Z",
    "date_modification": "2026-02-07T19:15:22.113Z"
  },
  {
    "code": 3,
    "libelle": "Sacred Heart Chapel",
    "description": "Small chapel for community prayers",
    "titre": "Chapel",
    "adresse": "10 Chapel Road",
    "code_type": 3,
    "date_creation": "2026-02-07T19:20:15.084Z",
    "date_modification": "2026-02-07T19:20:15.084Z"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/my-subscriptions"
```

---

## 9. Subscribe to Ecclesiastical Unit

**Endpoint:** `POST /api/v1/ecclesiastical-units/:id/subscribe`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "message": "Successfully subscribed to ecclesiastical unit"
}
```

### Error Response (400) - Already Subscribed

```json
{
  "statusCode": 400,
  "message": "Already subscribed to this ecclesiastical unit",
  "error": "Bad Request"
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/ecclesiastical-units/2/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 10. Unsubscribe from Ecclesiastical Unit

**Endpoint:** `DELETE /api/v1/ecclesiastical-units/:id/subscribe`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "message": "Successfully unsubscribed from ecclesiastical unit"
}
```

### Error Response (400) - Not Subscribed

```json
{
  "statusCode": 400,
  "message": "Not subscribed to this ecclesiastical unit",
  "error": "Bad Request"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/ecclesiastical-units/2/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 11. Get Unit Subscribers

**Endpoint:** `GET /api/v1/ecclesiastical-units/:id/subscribers`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
[
  {
    "code": 7,
    "username": "john_doe",
    "noms": "Doe",
    "prenoms": "John",
    "contact_1": "+237 6 70 12 34 56",
    "date_creation": "2026-02-08T10:30:00.000Z"
  },
  {
    "code": 8,
    "username": "jane_smith",
    "noms": "Smith",
    "prenoms": "Jane",
    "contact_1": "+237 6 90 98 76 54",
    "date_creation": "2026-02-08T11:15:00.000Z"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/2/subscribers"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "libelle should not be empty",
    "latitude must not be less than -90"
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
  "message": "Ecclesiastical unit not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Create a New Parish

```bash
curl -X POST http://localhost:3000/api/v1/ecclesiastical-units \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Holy Trinity Parish",
    "titre": "Parish",
    "adresse": "789 Faith Avenue, Douala, Cameroon",
    "code_type": 2,
    "code_unite_parent": 1,
    "longitude": 9.7679,
    "latitude": 4.0511,
    "statut_canonique": "Established Parish",
    "fidele": "3500 registered members",
    "translations": [
      {
        "languageCode": "en",
        "nom": "Holy Trinity Parish",
        "description": "A growing faith community"
      },
      {
        "languageCode": "fr",
        "nom": "Paroisse de la Sainte Trinité",
        "description": "Une communauté de foi en croissance"
      }
    ]
  }'
```

### Use Case 2: Find All Parishes in a Diocese

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units?code_unite_parent=1&code_type=2"
```

### Use Case 3: Search Parishes Near a Location

```bash
# Find parishes within 5km of coordinates
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units?latitude=4.0511&longitude=9.7679&radius=5&code_type=2"
```

### Use Case 4: Get Parish Details in French

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/2?lang=fr"
```

### Use Case 5: User Subscribes to Parish Notifications

```bash
# Subscribe
curl -X POST http://localhost:3000/api/v1/ecclesiastical-units/2/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check subscriptions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/ecclesiastical-units/my-subscriptions"
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
   - Navigate to **"Ecclesiastical Units"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **11 Comprehensive Endpoints**
✅ **Full CRUD Operations**
✅ **Multilingual Support**
✅ **Location-Based Search**
✅ **Hierarchical Organization**
✅ **Subscription Management**
✅ **Role-Based Access Control**
✅ **Advanced Filtering & Pagination**

**All endpoints are production-ready and fully documented!** 🎉⛪
