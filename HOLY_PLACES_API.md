# Holy Places API Documentation

## Base URL
`/api/v1/holy-places`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/holy-places` | Create new holy place | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/holy-places` | Get all holy places with filtering | Authenticated users |
| GET | `/holy-places/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/holy-places/nearby` | Find nearby holy places | Authenticated users |
| GET | `/holy-places/unit/:unitId` | Get places by unit | Authenticated users |
| GET | `/holy-places/:id` | Get single holy place | Authenticated users |
| PATCH | `/holy-places/:id` | Update holy place | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| DELETE | `/holy-places/:id` | Delete holy place | ADMIN, SUPER_ADMIN, PRIEST, DEACON |

---

## 1. Create Holy Place

**Endpoint:** `POST /api/v1/holy-places`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

```json
{
  "libelle": "Chapel of Our Lady of Lourdes",
  "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
  "photo": "https://example.com/photos/chapel.jpg",
  "longitude": 11.5021,
  "latitude": 3.848,
  "code_unite_ecclesiale": 1
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | **Yes** | Name of the holy place |
| adresse | string | No | Physical address |
| photo | string | No | URL or path to photo |
| longitude | number | No | GPS longitude (-180 to 180) |
| latitude | number | No | GPS latitude (-90 to 90) |
| code_unite_ecclesiale | number | No | Ecclesiastical unit ID |

### Common Types of Holy Places

- **Shrines**: Marian shrines, saints' shrines
- **Chapels**: Small prayer spaces, wayside chapels
- **Grottoes**: Natural or man-made prayer caves
- **Calvaries**: Stations of the Cross sites
- **Sacred Springs**: Holy water sources
- **Pilgrimage Sites**: Places of religious significance
- **Monasteries**: Religious communities
- **Hermitages**: Solitary prayer locations

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Chapel of Our Lady of Lourdes",
  "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
  "photo": "https://example.com/photos/chapel.jpg",
  "longitude": "11.5021000",
  "latitude": "3.8480000",
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
curl -X POST http://localhost:3000/api/v1/holy-places \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Chapel of Our Lady of Lourdes",
    "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
    "longitude": 11.5021,
    "latitude": 3.848,
    "code_unite_ecclesiale": 1
  }'
```

---

## 2. Get All Holy Places

**Endpoint:** `GET /api/v1/holy-places`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in name or address |
| code_unite_ecclesiale | number | No | - | Filter by ecclesiastical unit |
| latitude | number | No | - | Latitude for location search |
| longitude | number | No | - | Longitude for location search |
| radius | number | No | 10 | Search radius in km (with lat/long) |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all holy places
GET /api/v1/holy-places

# Search by name
GET /api/v1/holy-places?search=Chapel

# Filter by ecclesiastical unit
GET /api/v1/holy-places?code_unite_ecclesiale=1

# Location-based search (within 5km)
GET /api/v1/holy-places?latitude=3.848&longitude=11.5021&radius=5

# Combine filters
GET /api/v1/holy-places?search=Lourdes&page=1&limit=20
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Chapel of Our Lady of Lourdes",
      "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
      "photo": "https://example.com/photos/chapel.jpg",
      "longitude": "11.5021000",
      "latitude": "3.8480000",
      "code_unite_ecclesiale": 1,
      "date_creation": "2026-02-08T10:30:00.000Z",
      "date_modification": "2026-02-08T10:30:00.000Z",
      "ecclesiasticalUnit": {
        "code": 1,
        "libelle": "St. Mary Parish"
      }
    },
    {
      "code": 2,
      "libelle": "Sacred Heart Grotto",
      "adresse": "789 Mountain Path, Douala, Cameroon",
      "photo": null,
      "longitude": "9.7679000",
      "latitude": "4.0511000",
      "code_unite_ecclesiale": 2,
      "date_creation": "2026-02-08T11:00:00.000Z",
      "date_modification": "2026-02-08T11:00:00.000Z",
      "ecclesiasticalUnit": {
        "code": 2,
        "libelle": "Holy Family Parish"
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
# Get all holy places
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places"

# Search near location
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places?latitude=3.848&longitude=11.5021&radius=10"
```

---

## 3. Get Holy Place by ID

**Endpoint:** `GET /api/v1/holy-places/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Chapel of Our Lady of Lourdes",
  "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
  "photo": "https://example.com/photos/chapel.jpg",
  "longitude": "11.5021000",
  "latitude": "3.8480000",
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
  "http://localhost:3000/api/v1/holy-places/1"
```

---

## 4. Update Holy Place

**Endpoint:** `PATCH /api/v1/holy-places/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "libelle": "Shrine of Our Lady of Lourdes",
  "photo": "https://example.com/photos/new-chapel.jpg",
  "adresse": "456 Pilgrimage Road, Updated Address"
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Shrine of Our Lady of Lourdes",
  "adresse": "456 Pilgrimage Road, Updated Address",
  "photo": "https://example.com/photos/new-chapel.jpg",
  "longitude": "11.5021000",
  "latitude": "3.8480000",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T15:45:00.000Z"
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/holy-places/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Shrine of Our Lady of Lourdes",
    "photo": "https://example.com/photos/new-chapel.jpg"
  }'
```

---

## 5. Delete Holy Place

**Endpoint:** `DELETE /api/v1/holy-places/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "message": "Holy place successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/holy-places/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Holy Places Statistics

**Endpoint:** `GET /api/v1/holy-places/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 25,
  "withPhotos": 18,
  "withCoordinates": 22,
  "byUnit": {
    "St. Mary Parish": 10,
    "Holy Family Parish": 8,
    "Sacred Heart Chapel": 7
  }
}
```

**Explanation:**
- `total`: Total number of holy places
- `withPhotos`: Places that have photos
- `withCoordinates`: Places with GPS coordinates
- `byUnit`: Count by ecclesiastical unit

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places/stats"
```

---

## 7. Find Nearby Holy Places

**Endpoint:** `GET /api/v1/holy-places/nearby`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | number | **Yes** | Latitude coordinate |
| longitude | number | **Yes** | Longitude coordinate |
| radius | number | No | Search radius in km (default: 10) |

### Success Response (200)

```json
[
  {
    "code": 1,
    "libelle": "Chapel of Our Lady of Lourdes",
    "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
    "photo": "https://example.com/photos/chapel.jpg",
    "longitude": "11.5021000",
    "latitude": "3.8480000",
    "code_unite_ecclesiale": 1,
    "distance": 2.5,
    "ecclesiasticalUnit": {
      "code": 1,
      "libelle": "St. Mary Parish"
    }
  },
  {
    "code": 3,
    "libelle": "St. Joseph Shrine",
    "adresse": "101 Prayer Lane",
    "longitude": "11.5100000",
    "latitude": "3.8550000",
    "code_unite_ecclesiale": 1,
    "distance": 4.2
  }
]
```

**Note:** Results include a `distance` field (in kilometers) and are sorted by proximity.

### cURL Example

```bash
# Find holy places within 5km
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places/nearby?latitude=3.848&longitude=11.5021&radius=5"

# Find holy places within 20km
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places/nearby?latitude=3.848&longitude=11.5021&radius=20"
```

---

## 8. Get Holy Places by Unit

**Endpoint:** `GET /api/v1/holy-places/unit/:unitId`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 1,
    "libelle": "Chapel of Our Lady of Lourdes",
    "adresse": "456 Pilgrimage Road, Yaounde, Cameroon",
    "photo": "https://example.com/photos/chapel.jpg",
    "longitude": "11.5021000",
    "latitude": "3.8480000",
    "code_unite_ecclesiale": 1,
    "date_creation": "2026-02-08T10:30:00.000Z",
    "date_modification": "2026-02-08T10:30:00.000Z"
  },
  {
    "code": 3,
    "libelle": "St. Joseph Shrine",
    "adresse": "101 Prayer Lane",
    "longitude": "11.5100000",
    "latitude": "3.8550000",
    "code_unite_ecclesiale": 1,
    "date_creation": "2026-02-08T12:00:00.000Z",
    "date_modification": "2026-02-08T12:00:00.000Z"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places/unit/1"
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
  "message": "Holy place not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Register a Marian Shrine

```bash
curl -X POST http://localhost:3000/api/v1/holy-places \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Shrine of Our Lady of Africa",
    "adresse": "Mount Calvary, Yaoundé, Cameroon",
    "longitude": 11.5174,
    "latitude": 3.8667,
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 2: Add a Stations of the Cross Site

```bash
curl -X POST http://localhost:3000/api/v1/holy-places \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Outdoor Stations of the Cross",
    "adresse": "Parish Garden, Behind Main Church",
    "photo": "https://example.com/stations.jpg",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 3: Find Holy Places for Pilgrimage App

```bash
# Find all holy places within 10km for pilgrims
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places/nearby?latitude=3.848&longitude=11.5021&radius=10"
```

### Use Case 4: Create Prayer Spot Map

```bash
# Get all holy places with coordinates
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/holy-places?limit=100"
```

### Use Case 5: Update Shrine Photo

```bash
curl -X PATCH http://localhost:3000/api/v1/holy-places/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photo": "https://cdn.example.com/holy-places/shrine-2024.jpg"
  }'
```

---

## Integration Examples

### Mobile App - Find Nearby Holy Places

```javascript
// Get user's current location
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;

  const response = await fetch(
    `https://api.example.com/api/v1/holy-places/nearby?latitude=${latitude}&longitude=${longitude}&radius=15`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const nearbyPlaces = await response.json();
  // Display on map
});
```

### Pilgrimage Route Planner

```javascript
// Get all holy places for a diocese
const response = await fetch(
  'https://api.example.com/api/v1/holy-places?code_unite_ecclesiale=1&limit=50',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const places = await response.json();
// Calculate optimal pilgrimage route
```

### Parish Website - Display Shrines

```html
<!-- Display holy places on parish website -->
<div id="holy-places-list"></div>

<script>
async function loadHolyPlaces() {
  const response = await fetch(
    'https://api.example.com/api/v1/holy-places/unit/1',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const places = await response.json();

  const html = places.map(place => `
    <div class="holy-place">
      ${place.photo ? `<img src="${place.photo}" alt="${place.libelle}">` : ''}
      <h3>${place.libelle}</h3>
      <p>${place.adresse}</p>
      ${place.latitude && place.longitude ?
        `<a href="https://maps.google.com/?q=${place.latitude},${place.longitude}">
          Get Directions
        </a>` : ''}
    </div>
  `).join('');

  document.getElementById('holy-places-list').innerHTML = html;
}
</script>
```

---

## Best Practices

### 1. Always Include GPS Coordinates
Enables location-based features and map integration:
```json
{
  "libelle": "Sacred Heart Grotto",
  "longitude": 9.7679,
  "latitude": 4.0511
}
```

### 2. Add High-Quality Photos
Visual representation helps pilgrims identify locations:
```json
{
  "photo": "https://cdn.parish.com/photos/shrine-hq.jpg"
}
```

### 3. Provide Detailed Addresses
Help visitors find the location:
```json
{
  "adresse": "Behind the main church, accessible via the garden path"
}
```

### 4. Associate with Ecclesiastical Unit
Organize by parish or diocese:
```json
{
  "code_unite_ecclesiale": 1
}
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
   - Navigate to **"Holy Places"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **8 Comprehensive Endpoints**
✅ **Full CRUD for Holy Places**
✅ **GPS Coordinates Support**
✅ **Location-Based Search** (Find nearby places within radius)
✅ **Photo Management**
✅ **Unit-Specific Places**
✅ **Advanced Filtering** (by unit, location, search term)
✅ **Statistics & Reporting**
✅ **Perfect for Pilgrimage Apps & Parish Websites**

**Help pilgrims discover and visit sacred locations!** 🎉⛪🗺️✝️
