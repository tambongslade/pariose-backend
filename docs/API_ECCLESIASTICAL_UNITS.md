# Ecclesiastical Units API Documentation

## Overview

Manage the church organizational structure including dioceses, parishes, chapels, and their hierarchical relationships. Supports user subscriptions, location-based search, and hierarchical navigation.

## Base URL

```
http://localhost:3000/api/v1/ecclesiastical-units
```

## Authentication

All endpoints require JWT authentication.

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Create Ecclesiastical Unit

Create a new ecclesiastical unit (Admin/Priest only).

**Endpoint:** `POST /ecclesiastical-units`

**Authorization:** ADMIN, SUPER_ADMIN, PRIEST

**Request Body:**
```json
{
  "libelle": "Diocese of Paris",
  "description": "Main diocese covering Paris region",
  "titre": "Diocese",
  "adresse": "123 Cathedral Avenue, Paris, France",
  "code_type": 1,
  "longitude": 2.3522,
  "latitude": 48.8566,
  "altitude": 35.0,
  "fidele": "500000",
  "date_creation_unite": "1966-01-01",
  "statut_canonique": "Active",
  "code_unite_parent": null,
  "activite": "Religious services, education"
}
```

**Required Fields:**
- `libelle` (string) - Name of the unit

**Optional Fields:**
- `description` (string) - Detailed description
- `titre` (string) - Title/designation
- `adresse` (string) - Address
- `code_type` (number) - Type code (1=Diocese, 2=Parish, 3=Chapel, etc.)
- `longitude` (number) - Longitude coordinate (-180 to 180)
- `latitude` (number) - Latitude coordinate (-90 to 90)
- `altitude` (number) - Altitude in meters
- `fidele` (string) - Number of faithful/members
- `date_creation_unite` (date string) - Creation date of the unit
- `statut_canonique` (string) - Canonical status
- `code_unite_parent` (number) - Parent unit ID (for hierarchy)
- `activite` (string) - Activities description

**Success Response (201 Created):**
```json
{
  "code": 1,
  "libelle": "Diocese of Paris",
  "description": "Main diocese covering Paris region",
  "titre": "Diocese",
  "adresse": "123 Cathedral Avenue, Paris, France",
  "code_type": 1,
  "longitude": "2.3522",
  "latitude": "48.8566",
  "altitude": "35.0",
  "fidele": "500000",
  "date_creation_unite": "1966-01-01T00:00:00.000Z",
  "statut_canonique": "Active",
  "code_unite_parent": null,
  "activite": "Religious services, education",
  "code_createur": 1,
  "code_modificateur": null,
  "date_creation": "2026-02-07T20:15:00.000Z",
  "date_modification": "2026-02-07T20:15:00.000Z"
}
```

**Error Responses:**

404 Not Found - Parent doesn't exist:
```json
{
  "message": "Parent unit with ID 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 2. List Ecclesiastical Units (Paginated & Filtered)

Get list of units with advanced filtering options.

**Endpoint:** `GET /ecclesiastical-units`

**Authorization:** Any authenticated user

**Query Parameters:**
- `search` (string, optional) - Search in name, description, address
- `code_type` (number, optional) - Filter by type
- `code_unite_parent` (number, optional) - Filter by parent (0 for root units)
- `statut_canonique` (string, optional) - Filter by canonical status
- `latitude` (number, optional) - Latitude for location search
- `longitude` (number, optional) - Longitude for location search
- `radius` (number, optional) - Search radius in kilometers (requires lat/long)
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)

**Examples:**
```
GET /ecclesiastical-units?page=1&limit=10
GET /ecclesiastical-units?search=paris
GET /ecclesiastical-units?code_type=2
GET /ecclesiastical-units?code_unite_parent=0  # Root units only
GET /ecclesiastical-units?latitude=48.8566&longitude=2.3522&radius=10
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "code": 2,
      "libelle": "St. Mary Parish",
      "description": "Parish in central Paris",
      "adresse": "456 Church Street, Paris",
      "code_type": 2,
      "latitude": "48.8606",
      "longitude": "2.3376",
      "code_unite_parent": 1,
      "statut_canonique": "Active",
      "date_creation": "2026-02-07T20:16:00.000Z",
      "parent": {
        "code": 1,
        "libelle": "Diocese of Paris"
      },
      "children": []
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Statistics

Get statistics about ecclesiastical units.

**Endpoint:** `GET /ecclesiastical-units/stats`

**Authorization:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Success Response (200 OK):**
```json
{
  "total": 25,
  "rootUnits": 3,
  "byType": [
    {
      "type": 1,
      "count": "3"
    },
    {
      "type": 2,
      "count": "15"
    },
    {
      "type": 3,
      "count": "7"
    }
  ]
}
```

---

### 4. Get Hierarchy Tree

Get hierarchical structure of units.

**Endpoint:** `GET /ecclesiastical-units/hierarchy`

**Authorization:** Any authenticated user

**Query Parameters:**
- `rootId` (number, optional) - Start from specific root (omit for all root units)

**Examples:**
```
GET /ecclesiastical-units/hierarchy           # All root units with children
GET /ecclesiastical-units/hierarchy?rootId=1  # Specific root with children
```

**Success Response (200 OK):**
```json
[
  {
    "code": 1,
    "libelle": "Diocese of Paris",
    "description": "Main diocese",
    "code_type": 1,
    "children": [
      {
        "code": 2,
        "libelle": "St. Mary Parish",
        "code_type": 2,
        "children": [
          {
            "code": 3,
            "libelle": "Sacred Heart Chapel",
            "code_type": 3,
            "children": []
          }
        ]
      }
    ]
  }
]
```

---

### 5. Get My Subscriptions

Get units the current user is subscribed to.

**Endpoint:** `GET /ecclesiastical-units/my-subscriptions`

**Authorization:** Any authenticated user

**Success Response (200 OK):**
```json
[
  {
    "code": 2,
    "libelle": "St. Mary Parish",
    "description": "Parish in central Paris",
    "adresse": "456 Church Street",
    "code_type": 2
  }
]
```

---

### 6. Get Specific Unit

Get detailed information about a unit.

**Endpoint:** `GET /ecclesiastical-units/:id`

**Authorization:** Any authenticated user

**Success Response (200 OK):**
```json
{
  "code": 1,
  "libelle": "Diocese of Paris",
  "description": "Main diocese covering Paris region",
  "titre": "Diocese",
  "adresse": "123 Cathedral Avenue, Paris",
  "code_type": 1,
  "longitude": "2.3522",
  "latitude": "48.8566",
  "altitude": "35.0",
  "fidele": "500000",
  "date_creation_unite": "1966-01-01T00:00:00.000Z",
  "statut_canonique": "Active",
  "code_unite_parent": null,
  "parent": null,
  "children": [
    {
      "code": 2,
      "libelle": "St. Mary Parish"
    }
  ],
  "subscribers": [
    {
      "code": 1,
      "username": "johndoe"
    }
  ]
}
```

---

### 7. Get Subscribers of Unit

Get list of users subscribed to a unit.

**Endpoint:** `GET /ecclesiastical-units/:id/subscribers`

**Authorization:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Success Response (200 OK):**
```json
[
  {
    "code": 1,
    "username": "johndoe",
    "noms": "Doe",
    "prenoms": "John"
  }
]
```

---

### 8. Update Ecclesiastical Unit

Update unit information.

**Endpoint:** `PATCH /ecclesiastical-units/:id`

**Authorization:** ADMIN, SUPER_ADMIN, PRIEST

**Request Body:**
```json
{
  "libelle": "Updated Name",
  "description": "Updated description",
  "statut_canonique": "Active"
}
```

**All fields are optional**

**Success Response (200 OK):**
```json
{
  "code": 2,
  "libelle": "Updated Name",
  "description": "Updated description",
  "statut_canonique": "Active",
  "code_modificateur": 1,
  "date_modification": "2026-02-07T20:30:00.000Z"
}
```

**Error Responses:**

400 Bad Request - Circular reference:
```json
{
  "message": "Cannot set parent: would create circular reference",
  "error": "Bad Request",
  "statusCode": 400
}
```

400 Bad Request - Self-parent:
```json
{
  "message": "Unit cannot be its own parent",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 9. Delete Ecclesiastical Unit

Delete a unit (Admin only).

**Endpoint:** `DELETE /ecclesiastical-units/:id`

**Authorization:** ADMIN, SUPER_ADMIN

**Success Response (200 OK):**
```json
{
  "message": "Ecclesiastical unit deleted successfully"
}
```

**Error Responses:**

400 Bad Request - Has children:
```json
{
  "message": "Cannot delete unit with child units. Delete or reassign children first.",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 10. Subscribe to Unit

Subscribe current user to a unit (for notifications/updates).

**Endpoint:** `POST /ecclesiastical-units/:id/subscribe`

**Authorization:** Any authenticated user

**Success Response (200 OK):**
```json
{
  "code": 2,
  "libelle": "St. Mary Parish",
  "subscribers": [
    {
      "code": 1,
      "username": "johndoe"
    }
  ]
}
```

**Error Response (409 Conflict):**
```json
{
  "message": "User is already subscribed to this unit",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### 11. Unsubscribe from Unit

Unsubscribe current user from a unit.

**Endpoint:** `DELETE /ecclesiastical-units/:id/subscribe`

**Authorization:** Any authenticated user

**Success Response (200 OK):**
```json
{
  "code": 2,
  "libelle": "St. Mary Parish",
  "subscribers": []
}
```

---

## Features

### Hierarchical Structure

Units can have parent-child relationships:
- Diocese (root) → Parish → Chapel → etc.
- Automatic circular reference prevention
- Cannot delete units with children

### Location-Based Search

Find units within a radius using GPS coordinates:
```
GET /ecclesiastical-units?latitude=48.8566&longitude=2.3522&radius=10
```

Uses Haversine formula for accurate distance calculation.

### User Subscriptions

Users can subscribe to units for:
- Receiving announcements
- Event notifications
- Unit-specific updates

---

## Authorization Matrix

| Endpoint | USER | VOLUNTEER | DEACON | PRIEST | ADMIN | SUPER_ADMIN |
|----------|------|-----------|--------|--------|-------|-------------|
| POST /ecclesiastical-units | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| GET /ecclesiastical-units | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /ecclesiastical-units/stats | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /ecclesiastical-units/hierarchy | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /ecclesiastical-units/:id | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /ecclesiastical-units/:id/subscribers | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| PATCH /ecclesiastical-units/:id | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| DELETE /ecclesiastical-units/:id | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /ecclesiastical-units/:id/subscribe | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DELETE /ecclesiastical-units/:id/subscribe | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Testing with cURL

### Create Diocese
```bash
TOKEN="your_admin_token"

curl -X POST http://localhost:3000/api/v1/ecclesiastical-units \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Diocese of Paris",
    "code_type": 1,
    "statut_canonique": "Active",
    "latitude": 48.8566,
    "longitude": 2.3522
  }'
```

### Create Parish (Child)
```bash
curl -X POST http://localhost:3000/api/v1/ecclesiastical-units \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "St. Mary Parish",
    "code_type": 2,
    "code_unite_parent": 1,
    "latitude": 48.8606,
    "longitude": 2.3376
  }'
```

### List All Units
```bash
curl "http://localhost:3000/api/v1/ecclesiastical-units" \
  -H "Authorization: Bearer $TOKEN"
```

### Search Nearby Units
```bash
curl "http://localhost:3000/api/v1/ecclesiastical-units?latitude=48.8566&longitude=2.3522&radius=5" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Hierarchy
```bash
curl "http://localhost:3000/api/v1/ecclesiastical-units/hierarchy" \
  -H "Authorization: Bearer $TOKEN"
```

### Subscribe to Unit
```bash
curl -X POST "http://localhost:3000/api/v1/ecclesiastical-units/2/subscribe" \
  -H "Authorization: Bearer $TOKEN"
```

### Get My Subscriptions
```bash
curl "http://localhost:3000/api/v1/ecclesiastical-units/my-subscriptions" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Common Use Cases

### 1. Display Parish Finder Map

```javascript
// Get all parishes with location data
const parishes = await fetch('/api/v1/ecclesiastical-units?code_type=2', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Display on map
parishes.data.forEach(parish => {
  if (parish.latitude && parish.longitude) {
    addMarkerToMap(parish.latitude, parish.longitude, parish.libelle);
  }
});
```

### 2. Find Nearest Church

```javascript
// Get user location
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;

  // Find units within 5km
  const nearby = await fetch(
    `/api/v1/ecclesiastical-units?latitude=${latitude}&longitude=${longitude}&radius=5`,
    { headers: { 'Authorization': `Bearer ${token}` }}
  );

  console.log('Nearby churches:', nearby.data);
});
```

### 3. Display Organizational Structure

```javascript
// Get hierarchy tree
const hierarchy = await fetch('/api/v1/ecclesiastical-units/hierarchy', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Render tree view
function renderTree(units, level = 0) {
  units.forEach(unit => {
    console.log('  '.repeat(level) + unit.libelle);
    if (unit.children && unit.children.length > 0) {
      renderTree(unit.children, level + 1);
    }
  });
}

renderTree(hierarchy);
```

### 4. Parish Membership/Subscription

```javascript
// Subscribe to parish
await fetch(`/api/v1/ecclesiastical-units/${parishId}/subscribe`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get my parishes
const myParishes = await fetch('/api/v1/ecclesiastical-units/my-subscriptions', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Type Codes (Suggested)

While `code_type` is flexible, here's a recommended structure:

| Code | Type | Description |
|------|------|-------------|
| 1 | Diocese | Diocesan territory |
| 2 | Parish | Local church community |
| 3 | Chapel | Small place of worship |
| 4 | Cathedral | Bishop's church |
| 5 | Basilica | Papal-designated church |
| 6 | Shrine | Pilgrimage site |
| 7 | Mission | Missionary outpost |

---

## Best Practices

1. **Hierarchy Management**
   - Always create root units (dioceses) first
   - Validate parent exists before creating children
   - Don't delete units with children

2. **Location Data**
   - Always provide both latitude AND longitude
   - Validate coordinate ranges
   - Use radius search for "find nearby" features

3. **Subscriptions**
   - Allow users to subscribe to multiple units
   - Use subscriptions to target announcements
   - Check subscription before sending notifications

4. **Search Optimization**
   - Use pagination for large result sets
   - Combine filters for better results
   - Cache hierarchy tree for performance

---

**Last Updated:** February 7, 2026
