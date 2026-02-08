# Sacred Objects API Documentation

## Base URL
`/api/v1/sacred-objects`

## Authentication
All endpoints require JWT Bearer token authentication.

**Header:** `Authorization: Bearer <your_token>`

---

## Endpoints Overview

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/sacred-objects` | Create new sacred object | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/sacred-objects` | Get all sacred objects | Authenticated users |
| GET | `/sacred-objects/stats` | Get statistics | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| GET | `/sacred-objects/unit/:unitId` | Get objects by unit | Authenticated users |
| GET | `/sacred-objects/:id` | Get single object | Authenticated users |
| PATCH | `/sacred-objects/:id` | Update object | ADMIN, SUPER_ADMIN, PRIEST, DEACON |
| DELETE | `/sacred-objects/:id` | Delete object | ADMIN, SUPER_ADMIN, PRIEST, DEACON |

---

## 1. Create Sacred Object

**Endpoint:** `POST /api/v1/sacred-objects`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

```json
{
  "libelle": "Monstrance of Saint Peter",
  "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850",
  "photo": "https://example.com/photos/monstrance.jpg",
  "code_unite_ecclesiale": 1
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| libelle | string | Yes | Name/title of the sacred object |
| description | string | No | Detailed description of the object |
| photo | string | No | URL or path to photo of the object |
| code_unite_ecclesiale | number | No | Ecclesiastical unit ID where object is kept |

### Success Response (201)

```json
{
  "code": 1,
  "libelle": "Monstrance of Saint Peter",
  "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850",
  "photo": "https://example.com/photos/monstrance.jpg",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "code_createur": 6,
  "code_modificateur": 6,
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street"
  },
  "creator": {
    "code": 6,
    "nom": "Smith",
    "prenom": "John"
  },
  "modifier": {
    "code": 6,
    "nom": "Smith",
    "prenom": "John"
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/sacred-objects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Monstrance of Saint Peter",
    "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850",
    "photo": "https://example.com/photos/monstrance.jpg",
    "code_unite_ecclesiale": 1
  }'
```

---

## 2. Get All Sacred Objects

**Endpoint:** `GET /api/v1/sacred-objects`

**Permissions:** Authenticated users

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search in name or description |
| code_unite_ecclesiale | number | No | - | Filter by ecclesiastical unit |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

### Examples

```bash
# Get all sacred objects
GET /api/v1/sacred-objects

# Search by name or description
GET /api/v1/sacred-objects?search=Monstrance

# Filter by ecclesiastical unit
GET /api/v1/sacred-objects?code_unite_ecclesiale=1

# Combine filters
GET /api/v1/sacred-objects?code_unite_ecclesiale=1&search=chalice&page=1&limit=20
```

### Success Response (200)

```json
{
  "data": [
    {
      "code": 1,
      "libelle": "Monstrance of Saint Peter",
      "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850",
      "photo": "https://example.com/photos/monstrance.jpg",
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
      "libelle": "Golden Chalice",
      "description": "Ornate chalice for Mass celebration",
      "photo": "https://example.com/photos/chalice.jpg",
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
# Get all sacred objects
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects"

# Filter by unit
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects?code_unite_ecclesiale=1"
```

---

## 3. Get Sacred Object by ID

**Endpoint:** `GET /api/v1/sacred-objects/:id`

**Permissions:** Authenticated users

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Monstrance of Saint Peter",
  "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850",
  "photo": "https://example.com/photos/monstrance.jpg",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z",
  "code_createur": 6,
  "code_modificateur": 6,
  "ecclesiasticalUnit": {
    "code": 1,
    "libelle": "St. Mary Parish",
    "titre": "Parish",
    "adresse": "123 Church Street",
    "code_type": 2
  },
  "creator": {
    "code": 6,
    "nom": "Smith",
    "prenom": "John",
    "email": "john.smith@example.com"
  },
  "modifier": {
    "code": 6,
    "nom": "Smith",
    "prenom": "John",
    "email": "john.smith@example.com"
  }
}
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects/1"
```

---

## 4. Update Sacred Object

**Endpoint:** `PATCH /api/v1/sacred-objects/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Request Body

All fields are optional. Only include fields you want to update.

```json
{
  "libelle": "Historic Monstrance of Saint Peter",
  "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850. Recently restored."
}
```

### Success Response (200)

```json
{
  "code": 1,
  "libelle": "Historic Monstrance of Saint Peter",
  "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850. Recently restored.",
  "photo": "https://example.com/photos/monstrance.jpg",
  "code_unite_ecclesiale": 1,
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T15:45:00.000Z",
  "code_createur": 6,
  "code_modificateur": 7
}
```

### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/sacred-objects/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Historic Monstrance of Saint Peter",
    "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850. Recently restored."
  }'
```

---

## 5. Delete Sacred Object

**Endpoint:** `DELETE /api/v1/sacred-objects/:id`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "message": "Sacred object successfully deleted"
}
```

### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/sacred-objects/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Get Sacred Object Statistics

**Endpoint:** `GET /api/v1/sacred-objects/stats`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

### Success Response (200)

```json
{
  "total": 45,
  "byUnit": {
    "St. Mary Parish": 15,
    "Sacred Heart Chapel": 12,
    "Holy Trinity Church": 10,
    "St. Joseph Cathedral": 8
  }
}
```

**Explanation:**
- `total`: Total number of sacred objects across all units
- `byUnit`: Count of sacred objects by ecclesiastical unit

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects/stats"
```

---

## 7. Get Sacred Objects by Unit

**Endpoint:** `GET /api/v1/sacred-objects/unit/:unitId`

**Permissions:** Authenticated users

### Success Response (200)

```json
[
  {
    "code": 1,
    "libelle": "Monstrance of Saint Peter",
    "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850",
    "photo": "https://example.com/photos/monstrance.jpg",
    "code_unite_ecclesiale": 1,
    "date_creation": "2026-02-08T10:30:00.000Z",
    "date_modification": "2026-02-08T10:30:00.000Z"
  },
  {
    "code": 2,
    "libelle": "Golden Chalice",
    "description": "Ornate chalice for Mass celebration",
    "photo": "https://example.com/photos/chalice.jpg",
    "code_unite_ecclesiale": 1,
    "date_creation": "2026-02-08T11:00:00.000Z",
    "date_modification": "2026-02-08T11:00:00.000Z"
  }
]
```

### cURL Example

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects/unit/1"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "libelle should not be empty",
    "libelle must be a string"
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
  "message": "Sacred object not found",
  "error": "Not Found"
}
```

---

## Use Cases

### Use Case 1: Register New Liturgical Vessels

```bash
curl -X POST http://localhost:3000/api/v1/sacred-objects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Silver Ciborium",
    "description": "Silver ciborium for storing consecrated hosts, capacity 200 hosts",
    "photo": "https://example.com/photos/ciborium.jpg",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 2: Catalog Historical Reliquaries

```bash
curl -X POST http://localhost:3000/api/v1/sacred-objects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Reliquary of Saint Francis",
    "description": "Medieval reliquary containing first-class relic of Saint Francis of Assisi, circa 1300",
    "photo": "https://example.com/photos/reliquary-francis.jpg",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 3: Document Vestments

```bash
curl -X POST http://localhost:3000/api/v1/sacred-objects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "libelle": "Gothic Chasuble - Green",
    "description": "Handmade green chasuble for Ordinary Time, embroidered with vine motif",
    "photo": "https://example.com/photos/chasuble-green.jpg",
    "code_unite_ecclesiale": 1
  }'
```

### Use Case 4: Inventory Church Sacred Objects

```bash
# Get complete inventory for a parish
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects/unit/1"
```

### Use Case 5: Search for Specific Object Type

```bash
# Search for all chalices
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects?search=chalice"

# Search for monstrances
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/sacred-objects?search=monstrance"
```

### Use Case 6: Update Object Information After Restoration

```bash
curl -X PATCH http://localhost:3000/api/v1/sacred-objects/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A beautiful golden monstrance used for Eucharistic adoration, dating from 1850. Recently restored in 2026.",
    "photo": "https://example.com/photos/monstrance-restored.jpg"
  }'
```

---

## Common Sacred Objects Categories

### 1. Liturgical Vessels
Objects used in Mass and sacraments:
```json
{
  "libelle": "Chalice",
  "description": "Gold-plated chalice for consecration of wine"
}
```
```json
{
  "libelle": "Paten",
  "description": "Silver paten for holding the host"
}
```
```json
{
  "libelle": "Ciborium",
  "description": "Vessel for storing consecrated hosts in tabernacle"
}
```

### 2. Eucharistic Adoration
Objects for Eucharistic worship:
```json
{
  "libelle": "Monstrance",
  "description": "Ornate monstrance for exposition of the Blessed Sacrament"
}
```
```json
{
  "libelle": "Luna",
  "description": "Glass container that holds the host within the monstrance"
}
```
```json
{
  "libelle": "Humeral Veil",
  "description": "Silk veil worn during Benediction of the Blessed Sacrament"
}
```

### 3. Altar Objects
Items used on the altar:
```json
{
  "libelle": "Altar Crucifix",
  "description": "Bronze crucifix for altar centerpiece"
}
```
```json
{
  "libelle": "Altar Candles",
  "description": "Set of six beeswax altar candles"
}
```
```json
{
  "libelle": "Altar Linens",
  "description": "Hand-embroidered corporal and purificators"
}
```

### 4. Reliquaries
Objects containing relics:
```json
{
  "libelle": "First Class Relic - True Cross",
  "description": "Small fragment of the True Cross in crystal reliquary"
}
```
```json
{
  "libelle": "Relic of Saint Therese",
  "description": "Second-class relic - piece of clothing worn by Saint Therese"
}
```

### 5. Vestments
Sacred garments for liturgy:
```json
{
  "libelle": "Chasuble - Red",
  "description": "Red chasuble for martyrs' feast days and Pentecost"
}
```
```json
{
  "libelle": "Alb",
  "description": "White linen alb with lace detail"
}
```
```json
{
  "libelle": "Stole - Purple",
  "description": "Purple stole for Advent and Lent"
}
```

### 6. Baptismal Objects
Items for baptism:
```json
{
  "libelle": "Baptismal Font",
  "description": "Marble baptismal font, 18th century"
}
```
```json
{
  "libelle": "Holy Oils Set",
  "description": "Three vessels for Oil of Catechumens, Sacred Chrism, and Oil of the Sick"
}
```

### 7. Incense and Censers
Objects for sacred smoke:
```json
{
  "libelle": "Thurible",
  "description": "Brass censer for burning incense during liturgy"
}
```
```json
{
  "libelle": "Incense Boat",
  "description": "Silver boat for holding incense grains"
}
```

---

## Best Practices

### 1. Detailed Documentation
Provide comprehensive information for each object:
```json
{
  "libelle": "Chalice of Bishop O'Connor",
  "description": "Sterling silver chalice commissioned in 1920 for Bishop John O'Connor. Features Gothic Revival design with ruby cabochons. Used for episcopal Masses. Inscription: 'Ego sum calix salutaris'",
  "photo": "https://example.com/photos/chalice-oconnor.jpg",
  "code_unite_ecclesiale": 1
}
```

### 2. Photo Management
Include high-quality photos for identification:
- Front view
- Detail shots
- Inscription/markings
- Historical documentation

### 3. Historical Context
Record provenance and history:
- Date of acquisition/creation
- Donor information
- Historical significance
- Restoration history
- Usage notes

### 4. Categorization
Use clear, consistent naming:
- Start with object type: "Chalice", "Monstrance", "Chasuble"
- Add distinguishing details: color, material, patron
- Include historical period if significant

### 5. Inventory Management
Regularly update inventory:
```bash
# Annual inventory check
GET /api/v1/sacred-objects/unit/1

# After restoration or conservation
PATCH /api/v1/sacred-objects/:id

# Document new acquisitions immediately
POST /api/v1/sacred-objects
```

---

## Integration Examples

### Church Website - Display Sacred Art Gallery

```javascript
// Fetch sacred objects for public display
async function getSacredObjectsGallery(unitId) {
  const response = await fetch(
    `https://api.example.com/api/v1/sacred-objects/unit/${unitId}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );

  const objects = await response.json();

  return objects.map(obj => ({
    title: obj.libelle,
    description: obj.description,
    image: obj.photo,
    createdDate: obj.date_creation
  }));
}
```

### Museum App - Search Sacred Objects

```javascript
// Search for specific types of objects
async function searchSacredObjects(searchTerm) {
  const response = await fetch(
    `https://api.example.com/api/v1/sacred-objects?search=${encodeURIComponent(searchTerm)}&limit=50`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );

  const result = await response.json();

  return {
    objects: result.data,
    total: result.meta.total
  };
}
```

### Inventory System - Generate Reports

```javascript
// Get statistics for inventory report
async function generateInventoryReport() {
  const statsResponse = await fetch(
    'https://api.example.com/api/v1/sacred-objects/stats',
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );

  const stats = await statsResponse.json();

  return {
    totalObjects: stats.total,
    breakdown: stats.byUnit,
    reportDate: new Date().toISOString()
  };
}
```

### Mobile App - View Object Details

```javascript
// Get detailed information about a sacred object
async function getObjectDetails(objectId) {
  const response = await fetch(
    `https://api.example.com/api/v1/sacred-objects/${objectId}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );

  const object = await response.json();

  return {
    name: object.libelle,
    description: object.description,
    photo: object.photo,
    location: object.ecclesiasticalUnit?.libelle,
    dateAdded: object.date_creation,
    lastModified: object.date_modification
  };
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
   - Navigate to **"Sacred Objects"** section
   - Expand any endpoint
   - Click **"Try it out"**
   - Fill in parameters
   - Click **"Execute"**

---

## Summary

✅ **7 Comprehensive Endpoints**
✅ **Full CRUD Operations**
✅ **Photo Management**
✅ **Unit-Specific Inventory**
✅ **Advanced Search** (by name, description)
✅ **Filtering by Unit**
✅ **Pagination Support**
✅ **Statistics & Reporting**
✅ **Audit Trail** (creator, modifier tracking)
✅ **Role-Based Access Control**

**Perfect for managing church inventories of liturgical vessels, vestments, relics, and other sacred objects!** 🎉⛪✨
