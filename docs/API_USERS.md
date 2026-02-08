# Users API Documentation

## Overview

Complete user management system with CRUD operations, role assignment, and access control. Only administrators can manage users, but users can view and update their own profiles.

## Base URL

```
http://localhost:3000/api/v1/users
```

## Authentication

All endpoints require JWT authentication via Bearer token in Authorization header.

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Create User

Create a new user account (Admin only).

**Endpoint:** `POST /users`

**Authorization:** ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "username": "newuser",
  "password": "SecurePass123",
  "noms": "Smith",
  "prenoms": "Jane",
  "date_naissance": "1995-05-20",
  "contact_1": "1234567890",
  "contact_2": "0987654321",
  "addresse": "789 Pine Street",
  "roleIds": [3, 5]
}
```

**Required Fields:**
- `username` (string, min 3 characters, unique)
- `password` (string, min 6 characters, must contain uppercase, lowercase, and number/special char)

**Optional Fields:**
- `noms` (string) - Last name
- `prenoms` (string) - First name
- `date_naissance` (date string) - Birth date
- `contact_1` (string) - Primary contact
- `contact_2` (string) - Secondary contact
- `addresse` (string) - Address
- `roleIds` (number[]) - Array of role IDs (defaults to [6] for USER role)

**Success Response (201 Created):**
```json
{
  "code": 3,
  "username": "newuser",
  "noms": "Smith",
  "prenoms": "Jane",
  "date_naissance": "1995-05-20",
  "contact_1": "1234567890",
  "contact_2": "0987654321",
  "addresse": "789 Pine Street",
  "code_createur": 1,
  "code_modificateur": null,
  "date_creation": "2026-02-07T19:30:00.000Z",
  "date_modification": "2026-02-07T19:30:00.000Z",
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

**Error Responses:**

403 Forbidden - Not authorized:
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

409 Conflict - Username exists:
```json
{
  "message": "Username already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

404 Not Found - Invalid role IDs:
```json
{
  "message": "One or more roles not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 2. List Users (Paginated)

Get paginated list of all users with search and filtering.

**Endpoint:** `GET /users`

**Authorization:** ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Query Parameters:**
- `search` (string, optional) - Search in username, noms, prenoms
- `role` (string, optional) - Filter by role name (e.g., "ADMIN", "USER")
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)

**Examples:**
```
GET /users?page=1&limit=10
GET /users?search=john
GET /users?role=ADMIN
GET /users?search=doe&role=USER&page=2&limit=5
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "code": 1,
      "username": "johndoe",
      "noms": "Doe",
      "prenoms": "John",
      "date_naissance": null,
      "contact_1": "1234567890",
      "contact_2": null,
      "addresse": "123 Main St",
      "date_creation": "2026-02-07T19:04:38.084Z",
      "date_modification": "2026-02-07T19:04:38.084Z",
      "roles": [
        {
          "code": 2,
          "libelle": "ADMIN"
        },
        {
          "code": 6,
          "libelle": "USER"
        }
      ]
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### 3. Get User Statistics

Get user statistics including total count and breakdown by role.

**Endpoint:** `GET /users/stats`

**Authorization:** ADMIN, SUPER_ADMIN

**Success Response (200 OK):**
```json
{
  "total": 25,
  "byRole": [
    {
      "role": "SUPER_ADMIN",
      "count": "1"
    },
    {
      "role": "ADMIN",
      "count": "3"
    },
    {
      "role": "PRIEST",
      "count": "5"
    },
    {
      "role": "DEACON",
      "count": "4"
    },
    {
      "role": "VOLUNTEER",
      "count": "7"
    },
    {
      "role": "USER",
      "count": "20"
    }
  ]
}
```

---

### 4. Get Specific User

Get detailed information about a specific user.

**Endpoint:** `GET /users/:id`

**Authorization:**
- Own profile: Any authenticated user
- Other profiles: ADMIN, SUPER_ADMIN, PRIEST, DEACON

**Success Response (200 OK):**
```json
{
  "code": 1,
  "username": "johndoe",
  "noms": "Doe",
  "prenoms": "John",
  "date_naissance": null,
  "contact_1": "1234567890",
  "contact_2": null,
  "addresse": "123 Main St",
  "code_createur": null,
  "code_modificateur": null,
  "date_creation": "2026-02-07T19:04:38.084Z",
  "date_modification": "2026-02-07T19:04:38.084Z",
  "roles": [
    {
      "code": 2,
      "libelle": "ADMIN",
      "code_createur": null,
      "code_modificateur": null,
      "date_creation": "2026-02-07T18:48:48.222Z",
      "date_modification": "2026-02-07T18:48:48.222Z",
      "permissions": []
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "User with ID 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 5. Update User

Update user information.

**Endpoint:** `PATCH /users/:id`

**Authorization:**
- Own profile: Any authenticated user (cannot change roles)
- Other profiles: ADMIN, SUPER_ADMIN (can change roles)

**Request Body:**
```json
{
  "username": "newerusername",
  "password": "NewPassword123",
  "noms": "NewLastName",
  "prenoms": "NewFirstName",
  "date_naissance": "1990-01-15",
  "contact_1": "9998887777",
  "contact_2": "1112223333",
  "addresse": "New Address",
  "roleIds": [2, 6]
}
```

**All fields are optional**

**Success Response (200 OK):**
```json
{
  "code": 2,
  "username": "newerusername",
  "noms": "NewLastName",
  "prenoms": "NewFirstName",
  "date_naissance": "1990-01-15",
  "contact_1": "9998887777",
  "contact_2": "1112223333",
  "addresse": "New Address",
  "code_createur": null,
  "code_modificateur": 1,
  "date_creation": "2026-02-07T19:07:06.895Z",
  "date_modification": "2026-02-07T19:30:00.000Z",
  "roles": [
    {
      "code": 2,
      "libelle": "ADMIN"
    },
    {
      "code": 6,
      "libelle": "USER"
    }
  ]
}
```

**Error Responses:**

403 Forbidden - Cannot update others:
```json
{
  "message": "You can only update your own profile",
  "error": "Forbidden",
  "statusCode": 403
}
```

403 Forbidden - Cannot change roles:
```json
{
  "message": "Only admins can change user roles",
  "error": "Forbidden",
  "statusCode": 403
}
```

409 Conflict - Username taken:
```json
{
  "message": "Username already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### 6. Delete User

Delete a user account (Admin only).

**Endpoint:** `DELETE /users/:id`

**Authorization:** ADMIN, SUPER_ADMIN

**Success Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**

403 Forbidden - Cannot delete self:
```json
{
  "message": "You cannot delete your own account",
  "error": "Forbidden",
  "statusCode": 403
}
```

404 Not Found:
```json
{
  "message": "User with ID 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### 7. Assign Roles to User

Assign or change roles for a user (Admin only).

**Endpoint:** `POST /users/:id/roles`

**Authorization:** ADMIN, SUPER_ADMIN

**Request Body:**
```json
{
  "roleIds": [2, 3, 6]
}
```

**Success Response (200 OK):**
```json
{
  "code": 2,
  "username": "demouser",
  "noms": "Demo",
  "prenoms": "User",
  "date_naissance": null,
  "contact_1": null,
  "contact_2": null,
  "addresse": null,
  "code_createur": null,
  "code_modificateur": 1,
  "date_creation": "2026-02-07T19:07:06.895Z",
  "date_modification": "2026-02-07T19:30:00.000Z",
  "roles": [
    {
      "code": 2,
      "libelle": "ADMIN"
    },
    {
      "code": 3,
      "libelle": "PRIEST"
    },
    {
      "code": 6,
      "libelle": "USER"
    }
  ]
}
```

**Error Responses:**

403 Forbidden:
```json
{
  "message": "Only admins can assign roles",
  "error": "Forbidden",
  "statusCode": 403
}
```

404 Not Found - Invalid role IDs:
```json
{
  "message": "One or more roles not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Authorization Matrix

| Endpoint | USER | VOLUNTEER | DEACON | PRIEST | ADMIN | SUPER_ADMIN |
|----------|------|-----------|--------|--------|-------|-------------|
| POST /users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /users | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /users/stats | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /users/:id (own) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /users/:id (other) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| PATCH /users/:id (own) | ✅* | ✅* | ✅* | ✅* | ✅ | ✅ |
| PATCH /users/:id (other) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| DELETE /users/:id | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /users/:id/roles | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

*Cannot change own roles

---

## Testing with cURL

### Get Admin Token
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}' | jq -r '.access_token')
```

### List Users
```bash
curl -s "http://localhost:3000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Search Users
```bash
curl -s "http://localhost:3000/api/v1/users?search=john" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Get User Stats
```bash
curl -s "http://localhost:3000/api/v1/users/stats" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Get Specific User
```bash
curl -s "http://localhost:3000/api/v1/users/1" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Create User
```bash
curl -s -X POST "http://localhost:3000/api/v1/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "NewUser123",
    "noms": "New",
    "prenoms": "User",
    "contact_1": "1234567890",
    "roleIds": [6]
  }' | jq .
```

### Update User
```bash
curl -s -X PATCH "http://localhost:3000/api/v1/users/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "noms": "Updated",
    "prenoms": "Name"
  }' | jq .
```

### Assign Roles
```bash
curl -s -X POST "http://localhost:3000/api/v1/users/2/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleIds": [3, 5, 6]}' | jq .
```

### Delete User
```bash
curl -s -X DELETE "http://localhost:3000/api/v1/users/2" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Role IDs Reference

| ID | Role | Description |
|----|------|-------------|
| 1 | SUPER_ADMIN | Full system access |
| 2 | ADMIN | Administrative access |
| 3 | PRIEST | Priest-level access |
| 4 | DEACON | Deacon-level access |
| 5 | VOLUNTEER | Volunteer access |
| 6 | USER | Basic user access |

---

## Common Use Cases

### 1. User Self-Service

Users can view and update their own profile:

```javascript
// Get own profile
const profile = await fetch(`/api/v1/users/${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Update own profile
await fetch(`/api/v1/users/${userId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contact_1: '5551234567',
    addresse: 'New address'
  })
});
```

### 2. Admin User Management

Admins can manage all users:

```javascript
// List all users
const users = await fetch('/api/v1/users?page=1&limit=20', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

// Create user with specific role
await fetch('/api/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'priestjohn',
    password: 'Secure123',
    noms: 'John',
    prenoms: 'Father',
    roleIds: [3] // PRIEST role
  })
});
```

### 3. Role Management

Change user roles:

```javascript
// Promote user to admin
await fetch(`/api/v1/users/${userId}/roles`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    roleIds: [2, 6] // ADMIN + USER
  })
});
```

---

## Best Practices

1. **Password Updates**: Always require users to confirm their current password before changing it
2. **Role Changes**: Log all role changes for audit trail
3. **User Deletion**: Consider soft deletes instead of hard deletes
4. **Search**: Use pagination for large user lists
5. **Permissions**: Always check user permissions before allowing actions

---

## Security Notes

- ✅ Passwords are never returned in responses
- ✅ Users can only update their own profiles
- ✅ Only admins can create, delete, or change roles
- ✅ Username uniqueness is enforced
- ✅ Password strength requirements are validated
- ✅ All endpoints require authentication
- ✅ Role-based authorization is enforced

---

**Last Updated:** February 7, 2026
