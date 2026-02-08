# Swagger API Documentation Guide

## 🔐 How to Use Bearer Token Authentication in Swagger

### Step-by-Step:

1. **Login First**
   - Go to http://localhost:3000/api/docs
   - Find the **Authentication** section
   - Expand `POST /api/v1/auth/login`
   - Click "Try it out"
   - Enter your credentials:
     ```json
     {
       "username": "superadmin",
       "password": "SuperAdmin@123"
     }
     ```
   - Click "Execute"
   - **Copy the `access_token`** from the response

2. **Authorize Swagger**
   - Look at the **top right** of the Swagger page
   - Click the green **"Authorize" button** 🔓
   - In the popup, paste your token in the **"Value"** field:
     ```
     Bearer YOUR_TOKEN_HERE
     ```
   - **OR** just paste the token without "Bearer " (Swagger adds it automatically)
   - Click **"Authorize"**
   - Click **"Close"**

3. **Test Protected Endpoints**
   - All endpoints will now include your Bearer token automatically
   - The lock icons 🔒 will change to show they're authorized
   - Try any endpoint - it will work!

---

## 📂 Endpoints Grouped by Module

All endpoints are now organized with **tags** for easy navigation:

### **Authentication**
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register (if enabled)

### **Users**
- `GET /api/v1/users` - List all users
- `POST /api/v1/users` - Create user (Admin)
- `GET /api/v1/users/:id` - Get user details
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)
- `POST /api/v1/users/:id/roles` - Assign roles (Admin)

### **Roles** ✨ NEW
- `GET /api/v1/roles` - List all roles (Admin)
- `POST /api/v1/roles` - Create role (Super Admin only)
- `GET /api/v1/roles/:id` - Get role details
- `PATCH /api/v1/roles/:id` - Update role (Super Admin only)
- `DELETE /api/v1/roles/:id` - Delete role (Super Admin only)
- `GET /api/v1/roles/stats` - Role statistics

### **Dashboard**
- `GET /api/v1/dashboard/overview` - System overview (Admin)
- `GET /api/v1/dashboard/user-growth` - User growth stats (Admin)
- `GET /api/v1/dashboard/activity-statistics` - Activity stats (Admin)
- `GET /api/v1/dashboard/most-active-parishes` - Active parishes (Admin)
- `GET /api/v1/dashboard/my-parish` - My parish stats (Priest/Deacon/Admin)
- `GET /api/v1/dashboard/my-dashboard` - Personal dashboard (All users)

### **Ecclesiastical Units**
- Church units and parishes management

### **Celebrations**
- Mass schedules and liturgical celebrations

### **Activities**
- Parish activities and events

### **Announcements**
- Parish announcements and notices

### **Confessions**
- Confession schedules

### **Holy Places**
- Holy places and chapels management

### **Sacred Objects**
- Sacred objects inventory management

### **Languages**
- Liturgical languages management

---

## 🎯 Role Management Endpoints (NEW)

### Create a Role (Super Admin only)
```bash
POST /api/v1/roles
```
**Body:**
```json
{
  "libelle": "PARISH_ADMIN",
  "description": "Administrator for a specific parish",
  "permissionIds": [1, 2, 3]
}
```

### Get All Roles (Admin/Super Admin)
```bash
GET /api/v1/roles
```
**Response:**
```json
[
  {
    "code": 1,
    "libelle": "SUPER_ADMIN",
    "description": null,
    "date_creation": "2026-02-07T18:48:48.222Z",
    "permissions": []
  }
]
```

### Get Role by ID (Admin/Super Admin)
```bash
GET /api/v1/roles/1
```

### Update Role (Super Admin only)
```bash
PATCH /api/v1/roles/1
```
**Body:**
```json
{
  "libelle": "PARISH_MODERATOR",
  "description": "Updated description"
}
```

### Delete Role (Super Admin only)
```bash
DELETE /api/v1/roles/1
```
**Note:** System roles (SUPER_ADMIN, ADMIN, PRIEST, DEACON, VOLUNTEER, USER) cannot be deleted.

### Get Role Statistics (Admin/Super Admin)
```bash
GET /api/v1/roles/stats
```
**Response:**
```json
{
  "totalRoles": 6,
  "roles": [
    {
      "code": 1,
      "libelle": "SUPER_ADMIN",
      "permissionsCount": 0
    }
  ]
}
```

---

## 🚀 Quick Start Checklist

- [ ] Start your backend: `npm run start:dev`
- [ ] Open Swagger: http://localhost:3000/api/docs
- [ ] Login via `/auth/login` endpoint
- [ ] Copy the `access_token`
- [ ] Click "Authorize" button (top right)
- [ ] Paste token and click "Authorize"
- [ ] All endpoints now work with your authentication!
- [ ] Use the tags (dropdown) to navigate between modules

---

## 🔍 Troubleshooting

### "Unauthorized" Error
- Make sure you clicked the "Authorize" button
- Check if your token is still valid (expires after 24 hours)
- Login again to get a fresh token

### "Forbidden - Insufficient permissions"
- Your role doesn't have access to this endpoint
- Check the endpoint description for required roles
- Login with a higher-privileged account

### Can't Find an Endpoint
- Use the search bar at the top
- Click on the tag (module name) to expand all endpoints in that module
- Tags are collapsible - make sure they're expanded

---

## 📊 Endpoint Organization

The API is organized into **logical modules** using Swagger tags. Each tag groups related endpoints together:

1. **Authentication & Authorization** - Auth, Users, Roles
2. **Analytics** - Dashboard
3. **Church Management** - Ecclesiastical Units, Holy Places, Sacred Objects
4. **Liturgy** - Celebrations, Confessions, Languages
5. **Community** - Activities, Announcements

This makes it easy to find what you need without scrolling through hundreds of endpoints!

---

**Happy API Testing!** 🎉
