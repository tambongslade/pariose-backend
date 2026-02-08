# Authentication API Documentation

## Overview

The authentication system uses JWT (JSON Web Tokens) for stateless authentication. All protected routes require a valid Bearer token in the Authorization header.

## Base URL

```
http://localhost:3000/api/v1/auth
```

## Endpoints

### 1. Register New User

Create a new user account with default USER role.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123",
  "noms": "Doe",
  "prenoms": "John",
  "date_naissance": "1990-01-15",
  "contact_1": "1234567890",
  "contact_2": "0987654321",
  "addresse": "123 Main St, City"
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

**Success Response (201 Created):**
```json
{
  "user": {
    "code": 1,
    "username": "johndoe",
    "noms": "Doe",
    "prenoms": "John",
    "date_naissance": null,
    "contact_1": "1234567890",
    "contact_2": null,
    "addresse": "123 Main St, City",
    "code_createur": null,
    "code_modificateur": null,
    "date_creation": "2026-02-07T19:04:38.084Z",
    "date_modification": "2026-02-07T19:04:38.084Z",
    "roles": [
      {
        "code": 6,
        "libelle": "USER",
        "code_createur": null,
        "code_modificateur": null,
        "date_creation": "2026-02-07T18:48:48.222Z",
        "date_modification": "2026-02-07T18:48:48.222Z"
      }
    ]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**Error Responses:**

409 Conflict - Username already exists:
```json
{
  "message": "Username already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

400 Bad Request - Validation error:
```json
{
  "message": [
    "password too weak. Must contain uppercase, lowercase, and number/special character",
    "username must be longer than or equal to 3 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 2. Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "code": 1,
    "username": "johndoe",
    "noms": "Doe",
    "prenoms": "John",
    "date_naissance": null,
    "contact_1": "1234567890",
    "contact_2": null,
    "addresse": "123 Main St, City",
    "code_createur": null,
    "code_modificateur": null,
    "date_creation": "2026-02-07T19:04:38.084Z",
    "date_modification": "2026-02-07T19:04:38.084Z",
    "roles": [
      {
        "code": 6,
        "libelle": "USER",
        "code_createur": null,
        "code_modificateur": null,
        "date_creation": "2026-02-07T18:48:48.222Z",
        "date_modification": "2026-02-07T18:48:48.222Z",
        "permissions": []
      }
    ]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 3. Get User Profile

Get current authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "user": {
    "code": 1,
    "username": "johndoe",
    "noms": "Doe",
    "prenoms": "John",
    "date_naissance": null,
    "contact_1": "1234567890",
    "contact_2": null,
    "addresse": "123 Main St, City",
    "code_createur": null,
    "code_modificateur": null,
    "date_creation": "2026-02-07T19:04:38.084Z",
    "date_modification": "2026-02-07T19:04:38.084Z",
    "roles": [
      {
        "code": 6,
        "libelle": "USER",
        "code_createur": null,
        "code_modificateur": null,
        "date_creation": "2026-02-07T18:48:48.222Z",
        "date_modification": "2026-02-07T18:48:48.222Z",
        "permissions": []
      }
    ]
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

### 4. Refresh Token

Refresh the access token for authenticated user.

**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

## Authentication Flow

### Registration Flow
1. User submits registration form with username, password, and optional details
2. Backend validates input (password strength, username uniqueness)
3. Password is hashed using bcrypt (10 rounds)
4. User is created with default USER role
5. JWT token is generated and returned
6. User can immediately access protected routes

### Login Flow
1. User submits username and password
2. Backend finds user by username
3. Password is compared with stored hash using bcrypt
4. If valid, JWT token is generated with user info and roles
5. Token is returned to client
6. Client stores token (localStorage, sessionStorage, or memory)
7. Client includes token in Authorization header for protected requests

### Protected Route Access
1. Client sends request with `Authorization: Bearer <token>` header
2. Backend validates token signature and expiration
3. User info is extracted from token payload
4. User is loaded from database with roles and permissions
5. Request proceeds if authorized

---

## Token Information

### JWT Payload
```json
{
  "sub": 1,                    // User ID
  "username": "johndoe",       // Username
  "roles": ["USER"],           // User roles
  "iat": 1770494678,          // Issued at
  "exp": 1770581078           // Expires at
}
```

### Token Expiration
- **Default:** 24 hours (86400 seconds)
- **Configuration:** Set via `JWT_EXPIRATION` in `.env`

---

## Security Features

### Password Security
- ✅ Minimum 6 characters
- ✅ Must contain uppercase letter
- ✅ Must contain lowercase letter
- ✅ Must contain number or special character
- ✅ Hashed with bcrypt (10 salt rounds)
- ✅ Never returned in API responses (uses @Exclude decorator)

### Token Security
- ✅ Signed with secret key (JWT_SECRET)
- ✅ 24-hour expiration
- ✅ Includes user roles for authorization
- ✅ Stateless (no server-side session storage)

### Role-Based Access Control
- ✅ Users assigned roles on registration
- ✅ Default role: USER
- ✅ Roles can have multiple permissions
- ✅ Protected routes check user roles via guards

---

## Using Protected Routes

### In Your Frontend

```javascript
// Store token after login/register
localStorage.setItem('access_token', response.access_token);

// Add to requests
const token = localStorage.getItem('access_token');
fetch('http://localhost:3000/api/v1/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### In Other Backend Routes

```typescript
// Protect route with JWT Guard
@Get('protected')
@UseGuards(JwtAuthGuard)
async protectedRoute(@GetUser() user: User) {
  return { message: 'This is protected', user };
}

// Protect with role requirement
@Get('admin-only')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
async adminRoute(@GetUser() user: User) {
  return { message: 'Admin only', user };
}
```

---

## Default Roles

The system comes with 6 predefined roles:

1. **SUPER_ADMIN** (code: 1) - Full system access
2. **ADMIN** (code: 2) - Administrative access
3. **PRIEST** (code: 3) - Priest-level access
4. **DEACON** (code: 4) - Deacon-level access
5. **VOLUNTEER** (code: 5) - Volunteer access
6. **USER** (code: 6) - Basic user access (default for new registrations)

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234","noms":"Test","prenoms":"User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234"}'
```

### Get Profile
```bash
TOKEN="your_access_token_here"
curl http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Refresh Token
```bash
TOKEN="your_access_token_here"
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Authorization: Bearer $TOKEN"
```

---

## Common Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid input data or validation failed |
| 401 | Unauthorized | Invalid credentials or missing/invalid token |
| 409 | Conflict | Username already exists |
| 404 | Not Found | USER role not found in database |

---

## Next Steps

1. Implement password reset functionality
2. Add email verification
3. Implement refresh token rotation
4. Add rate limiting for auth endpoints
5. Add 2FA (Two-Factor Authentication)
6. Implement OAuth2 providers (Google, Facebook, etc.)

---

**Last Updated:** February 7, 2026
