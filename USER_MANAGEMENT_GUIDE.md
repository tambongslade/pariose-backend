# User Management Guide

## Overview

Your Pariose ChurchNow API includes comprehensive user management with role-based access control, advanced filtering, and pagination.

## Features

✅ Create users with role assignment
✅ Advanced search and filtering
✅ Role-based filtering
✅ Pagination support
✅ Password hashing (bcrypt)
✅ Default USER role assignment
✅ Full CRUD operations

## API Endpoints

### 1. Create User (Admin Only)

**Endpoint:** `POST /api/v1/users`

**Permissions:** ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "noms": "Doe",
  "prenoms": "John",
  "date_naissance": "1990-05-15",
  "contact_1": "+237 6 70 12 34 56",
  "contact_2": "+237 6 90 98 76 54",
  "addresse": "Douala, Cameroon",
  "roleIds": [1, 2]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username (min 3 characters) |
| password | string | Yes | Strong password (min 6 chars, uppercase, lowercase, number/special) |
| noms | string | No | Last name(s) |
| prenoms | string | No | First name(s) |
| date_naissance | string | No | Date of birth (ISO 8601 format) |
| contact_1 | string | No | Primary contact number |
| contact_2 | string | No | Secondary contact number |
| addresse | string | No | Physical address |
| roleIds | number[] | No | Array of role IDs (defaults to USER role if not provided) |

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number OR special character

**Available Role IDs:**
- `1` - SUPER_ADMIN
- `2` - ADMIN
- `3` - PRIEST
- `4` - DEACON
- `5` - VOLUNTEER
- `6` - USER

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!",
    "noms": "Doe",
    "prenoms": "John",
    "date_naissance": "1990-05-15",
    "contact_1": "+237 6 70 12 34 56",
    "contact_2": "+237 6 90 98 76 54",
    "addresse": "Douala, Cameroon",
    "roleIds": [3]
  }'
```

**Success Response (201):**
```json
{
  "code": 7,
  "username": "john_doe",
  "noms": "Doe",
  "prenoms": "John",
  "date_naissance": "1990-05-15",
  "contact_1": "+237 6 70 12 34 56",
  "contact_2": "+237 6 90 98 76 54",
  "addresse": "Douala, Cameroon",
  "roles": [
    {
      "code": 3,
      "libelle": "PRIEST"
    }
  ],
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Bad request (invalid data, weak password)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (username already exists)

---

### 2. Get All Users with Filtering

**Endpoint:** `GET /api/v1/users`

**Permissions:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | - | Search term to filter by username, first name, or last name |
| role | string | No | - | Filter by role name (e.g., "ADMIN", "PRIEST") |
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of items per page |

**Examples:**

```bash
# Get all users (first page, 10 items)
GET /api/v1/users

# Search for users
GET /api/v1/users?search=john

# Filter by role
GET /api/v1/users?role=PRIEST

# Combine filters with pagination
GET /api/v1/users?search=john&role=ADMIN&page=1&limit=20

# Get second page
GET /api/v1/users?page=2&limit=10
```

**Example cURL:**
```bash
# Search for users named "john"
curl -X GET "http://localhost:3000/api/v1/users?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all priests
curl -X GET "http://localhost:3000/api/v1/users?role=PRIEST" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Advanced filtering with pagination
curl -X GET "http://localhost:3000/api/v1/users?search=doe&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "data": [
    {
      "code": 6,
      "username": "superadmin",
      "noms": "System",
      "prenoms": "Administrator",
      "date_naissance": null,
      "contact_1": null,
      "contact_2": null,
      "addresse": null,
      "date_creation": "2026-02-08T07:04:52.020Z",
      "date_modification": "2026-02-08T07:04:52.020Z",
      "roles": [
        {
          "code": 1,
          "libelle": "SUPER_ADMIN"
        }
      ]
    },
    {
      "code": 7,
      "username": "john_doe",
      "noms": "Doe",
      "prenoms": "John",
      "date_naissance": "1990-05-15",
      "contact_1": "+237 6 70 12 34 56",
      "contact_2": "+237 6 90 98 76 54",
      "addresse": "Douala, Cameroon",
      "date_creation": "2026-02-08T10:30:00.000Z",
      "date_modification": "2026-02-08T10:30:00.000Z",
      "roles": [
        {
          "code": 3,
          "libelle": "PRIEST"
        }
      ]
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

---

### 3. Get Single User

**Endpoint:** `GET /api/v1/users/:id`

**Permissions:**
- Users can view their own profile
- ADMIN, SUPER_ADMIN, PRIEST, DEACON can view any profile

**Example:**
```bash
curl -X GET http://localhost:3000/api/v1/users/7 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "code": 7,
  "username": "john_doe",
  "noms": "Doe",
  "prenoms": "John",
  "date_naissance": "1990-05-15",
  "contact_1": "+237 6 70 12 34 56",
  "contact_2": "+237 6 90 98 76 54",
  "addresse": "Douala, Cameroon",
  "roles": [
    {
      "code": 3,
      "libelle": "PRIEST",
      "permissions": []
    }
  ],
  "date_creation": "2026-02-08T10:30:00.000Z",
  "date_modification": "2026-02-08T10:30:00.000Z"
}
```

---

### 4. Update User

**Endpoint:** `PATCH /api/v1/users/:id`

**Permissions:**
- Users can update their own profile
- ADMIN, SUPER_ADMIN can update any profile

**Request Body (all fields optional):**
```json
{
  "username": "john_doe_updated",
  "password": "NewSecurePass123!",
  "noms": "Doe",
  "prenoms": "Jonathan",
  "date_naissance": "1990-05-15",
  "contact_1": "+237 6 70 12 34 56",
  "contact_2": "+237 6 90 98 76 54",
  "addresse": "Yaounde, Cameroon"
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/v1/users/7 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prenoms": "Jonathan",
    "addresse": "Yaounde, Cameroon"
  }'
```

---

### 5. Delete User

**Endpoint:** `DELETE /api/v1/users/:id`

**Permissions:** ADMIN, SUPER_ADMIN

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/users/7 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "message": "User successfully deleted"
}
```

---

### 6. Assign Roles to User

**Endpoint:** `POST /api/v1/users/:id/roles`

**Permissions:** ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "roleIds": [3, 5]
}
```

**Example:**
```bash
# Assign PRIEST and VOLUNTEER roles
curl -X POST http://localhost:3000/api/v1/users/7/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleIds": [3, 5]
  }'
```

**Success Response (200):**
```json
{
  "code": 7,
  "username": "john_doe",
  "noms": "Doe",
  "prenoms": "John",
  "roles": [
    {
      "code": 3,
      "libelle": "PRIEST"
    },
    {
      "code": 5,
      "libelle": "VOLUNTEER"
    }
  ]
}
```

---

### 7. Get User Statistics

**Endpoint:** `GET /api/v1/users/stats`

**Permissions:** ADMIN, SUPER_ADMIN

**Example:**
```bash
curl -X GET http://localhost:3000/api/v1/users/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200):**
```json
{
  "total": 45,
  "byRole": {
    "SUPER_ADMIN": 1,
    "ADMIN": 3,
    "PRIEST": 8,
    "DEACON": 5,
    "VOLUNTEER": 12,
    "USER": 16
  },
  "activeUsers": 42
}
```

---

## Testing in Swagger

1. **Navigate to Swagger UI:**
   ```
   http://localhost:3000/api/docs
   ```

2. **Login as Super Admin:**
   - Go to **Authentication** section
   - Use `/auth/login` endpoint
   - Credentials:
     - username: `superadmin`
     - password: `SuperAdmin@123`

3. **Authorize:**
   - Copy the `access_token` from response
   - Click **"Authorize"** button
   - Enter: `Bearer YOUR_TOKEN`
   - Click **"Authorize"**

4. **Test User Endpoints:**
   - Navigate to **Users** section
   - Try creating a user with role assignment
   - Test filtering and search
   - View user details

---

## Use Cases

### 1. Create a Priest User
```json
POST /api/v1/users
{
  "username": "father_pierre",
  "password": "SecurePriest123!",
  "noms": "Mbarga",
  "prenoms": "Pierre",
  "contact_1": "+237 6 70 11 22 33",
  "addresse": "Douala Cathedral, Cameroon",
  "roleIds": [3]
}
```

### 2. Create an Admin User
```json
POST /api/v1/users
{
  "username": "admin_marie",
  "password": "AdminPass123!",
  "noms": "Nguyen",
  "prenoms": "Marie",
  "contact_1": "+237 6 90 44 55 66",
  "roleIds": [2]
}
```

### 3. Search for All Priests
```
GET /api/v1/users?role=PRIEST
```

### 4. Search Users by Name
```
GET /api/v1/users?search=pierre
```

### 5. Paginated User List
```
GET /api/v1/users?page=1&limit=20
```

---

## Security Features

✅ **Password Hashing:** All passwords are hashed with bcrypt (10 rounds)
✅ **Strong Password Policy:** Enforced through validation
✅ **Role-Based Access Control:** Different permissions for different roles
✅ **Password Never Returned:** Password field excluded from all responses
✅ **Username Uniqueness:** Enforced at database and application level

---

## Error Handling

### Common Errors:

**409 Conflict - Username Already Exists:**
```json
{
  "statusCode": 409,
  "message": "Username already exists",
  "error": "Conflict"
}
```

**400 Bad Request - Weak Password:**
```json
{
  "statusCode": 400,
  "message": [
    "Password too weak. Must contain uppercase, lowercase, and number/special character"
  ],
  "error": "Bad Request"
}
```

**404 Not Found - Invalid Role:**
```json
{
  "statusCode": 404,
  "message": "One or more roles not found",
  "error": "Not Found"
}
```

**403 Forbidden - Insufficient Permissions:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

---

## Best Practices

1. **Always assign appropriate roles** during user creation
2. **Use strong passwords** that meet the requirements
3. **Use pagination** for large user lists
4. **Search by role** to quickly find users by their responsibilities
5. **Update passwords regularly** for security
6. **Assign multiple roles** when users have multiple responsibilities

---

## Summary

Your user management system includes:

✅ Complete CRUD operations
✅ Role assignment during creation
✅ Advanced search and filtering
✅ Pagination support
✅ Role-based access control
✅ Secure password handling
✅ Full Swagger documentation

**All endpoints are production-ready and fully documented!** 🎉👥
