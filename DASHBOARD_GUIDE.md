# Dashboard & Analytics Guide

## Overview

Your Pariose ChurchNow API now includes comprehensive role-based dashboard and analytics endpoints. Different user roles have access to different levels of analytics.

## What Has Been Implemented

### 1. **Dashboard Module** ✅
- Role-based analytics endpoints
- System-wide statistics for admins
- Parish-specific statistics for priests/deacons
- Personal dashboards for all users
- API endpoints at `/api/v1/dashboard`

### 2. **Super Admin Seeding** ✅
- Automated seeding of standard roles
- Super admin user creation
- Default credentials ready to use

## Role-Based Access Control

### 🔴 SUPER_ADMIN / ADMIN
Full system access including:
- **System Overview** - Total counts, recent activity, distributions
- **User Growth Statistics** - Monthly registration trends
- **Activity Statistics** - Activity by date range
- **Most Active Parishes** - Ranking by engagement metrics
- **My Parish Statistics** - Their own parish data

### 🟡 PRIEST / DEACON
Parish management access:
- **My Parish Statistics** - Statistics for parishes they manage
- **Parish Subscribers** - Total subscribers count
- **Upcoming Celebrations** - Next 30 days
- **Recent Activities** - Last 30 days
- **My Dashboard** - Personal feed

### 🟢 VOLUNTEER
Activity-focused access:
- **My Dashboard** - Subscriptions and upcoming events

### 🔵 USER
Personal access:
- **My Dashboard** - Personal feed with subscriptions, upcoming events, and recent announcements

## API Endpoints

### 1. System Overview (Admin Only)

```bash
GET /api/v1/dashboard/overview
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**
```json
{
  "overview": {
    "totalUsers": 156,
    "totalEcclesiasticalUnits": 45,
    "totalCelebrations": 234,
    "totalActivities": 89,
    "totalAnnouncements": 67,
    "totalConfessions": 12,
    "totalHolyPlaces": 23,
    "totalSacredObjects": 34
  },
  "recentActivity": {
    "newUsersLast30Days": 15,
    "upcomingCelebrationsNext7Days": 8,
    "activeAnnouncements": 12
  },
  "distributions": {
    "usersByRole": [
      { "role": "USER", "count": 120 },
      { "role": "PRIEST", "count": 15 }
    ],
    "unitsByType": [
      { "type": "1", "count": 25 },
      { "type": "2", "count": 20 }
    ]
  }
}
```

### 2. User Growth Statistics (Admin Only)

```bash
GET /api/v1/dashboard/user-growth?months=12
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**
```json
[
  { "month": "2025-02", "newUsers": 12 },
  { "month": "2025-03", "newUsers": 18 },
  { "month": "2026-01", "newUsers": 25 },
  { "month": "2026-02", "newUsers": 15 }
]
```

### 3. My Parish Statistics (Priest/Deacon)

```bash
GET /api/v1/dashboard/my-parish
Authorization: Bearer <PRIEST_TOKEN>
```

**Response:**
```json
{
  "parishInfo": {
    "units": [
      {
        "code": 1,
        "libelle": "Saint Mary Parish",
        "titre": "Parish"
      }
    ]
  },
  "statistics": {
    "totalCelebrations": 45,
    "totalActivities": 23,
    "totalAnnouncements": 12,
    "totalSubscribers": 156
  },
  "upcomingCelebrations": [...],
  "recentActivities": [...]
}
```

### 4. My Personal Dashboard (All Users)

```bash
GET /api/v1/dashboard/my-dashboard
Authorization: Bearer <USER_TOKEN>
```

**Response:**
```json
{
  "subscriptions": [
    {
      "code": 1,
      "libelle": "Saint Mary Parish",
      "titre": "Parish",
      "adresse": "123 Church St"
    }
  ],
  "upcomingCelebrations": [...],
  "upcomingActivities": [...],
  "recentAnnouncements": [...]
}
```

### 5. Activity Statistics by Date Range (Admin Only)

```bash
GET /api/v1/dashboard/activity-statistics?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**
```json
{
  "period": {
    "start": "2026-01-01T00:00:00.000Z",
    "end": "2026-01-31T23:59:59.999Z"
  },
  "statistics": {
    "celebrationsCreated": 12,
    "activitiesCreated": 8,
    "announcementsPublished": 15,
    "newUsers": 25
  }
}
```

### 6. Most Active Parishes (Admin Only)

```bash
GET /api/v1/dashboard/most-active-parishes?limit=10
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**
```json
[
  {
    "code": 1,
    "libelle": "Saint Mary Parish",
    "subscribers": 156,
    "celebrations": 45,
    "activities": 23,
    "announcements": 12
  },
  {
    "code": 2,
    "libelle": "Holy Family Church",
    "subscribers": 142,
    "celebrations": 38,
    "activities": 19,
    "announcements": 10
  }
]
```

## Setup Instructions

### Step 1: Run the Migrations

Execute both SQL migrations in order:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database

# Run migration 1 (Languages & Translations)
\i migrations/001-add-multilingual-support.sql

# Run migration 2 (Roles & Super Admin)
\i migrations/002-seed-roles-and-superadmin.sql
```

### Step 2: Verify Super Admin Creation

```sql
-- Check if super admin was created
SELECT
  u.code,
  u.username,
  u.noms,
  u.prenoms,
  STRING_AGG(r.libelle, ', ') as roles
FROM utilisateurs u
LEFT JOIN utilisateur_role ur ON u.code = ur.code_utilisateur
LEFT JOIN roles r ON ur.code_role = r.code
WHERE u.username = 'superadmin'
GROUP BY u.code, u.username, u.noms, u.prenoms;
```

### Step 3: Login as Super Admin

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "superadmin",
  "password": "SuperAdmin@123"
}
```

**Response:**
```json
{
  "user": {
    "code": 1,
    "username": "superadmin",
    "noms": "System",
    "prenoms": "Administrator",
    "roles": [
      {
        "code": 1,
        "libelle": "SUPER_ADMIN"
      }
    ]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 4: Test Dashboard Endpoints

```bash
# Get system overview
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/dashboard/overview

# Get user growth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/dashboard/user-growth?months=6

# Get personal dashboard
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/dashboard/my-dashboard
```

## Security Best Practices

### ⚠️ IMPORTANT: Change Default Password

**Immediately after first login, change the super admin password:**

```bash
PATCH /api/v1/users/1
Authorization: Bearer <SUPERADMIN_TOKEN>
Content-Type: application/json

{
  "password": "YourNewSecurePassword123!@#"
}
```

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number or special character

### Generate Secure Passwords

Use the included script to generate password hashes:

```bash
# Generate hash for a new password
node scripts/generate-password-hash.js "YourNewPassword123!"

# Output will show the bcrypt hash to use in database
```

## Role Management

### Viewing All Roles

```sql
SELECT * FROM roles ORDER BY code;
```

### Assigning Roles to Users

```bash
POST /api/v1/users/:id/roles
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "roleIds": [1, 2]  // SUPER_ADMIN and ADMIN
}
```

### Standard Roles

| Role ID | Role Name      | Description                          |
|---------|----------------|--------------------------------------|
| 1       | SUPER_ADMIN    | Full system access                   |
| 2       | ADMIN          | Administrative access                |
| 3       | PRIEST         | Parish priest access                 |
| 4       | DEACON         | Deacon access                        |
| 5       | VOLUNTEER      | Volunteer access                     |
| 6       | USER           | Basic user access                    |

## Testing in Swagger

1. **Login as Super Admin**
   - Navigate to http://localhost:3000/api/docs
   - Find **Authentication** section
   - Use `/auth/login` with credentials:
     - username: `superadmin`
     - password: `SuperAdmin@123`

2. **Authorize Swagger**
   - Copy the `access_token` from login response
   - Click **"Authorize"** button at top of Swagger
   - Enter: `Bearer YOUR_TOKEN`
   - Click **"Authorize"**

3. **Test Dashboard Endpoints**
   - Navigate to **Dashboard** section
   - Try different endpoints based on your role
   - View request/response schemas

## Dashboard Use Cases

### For System Administrators
- Monitor system growth and health
- Identify most active parishes
- Track user registration trends
- Generate activity reports

### For Parish Priests
- View parish statistics
- See subscriber counts
- Monitor upcoming events
- Track parish engagement

### For Regular Users
- Stay updated with parish events
- View upcoming celebrations
- See recent announcements
- Manage subscriptions

## Performance Considerations

- **Caching**: Consider adding Redis caching for frequently accessed statistics
- **Indexes**: All necessary database indexes are created by migrations
- **Query Optimization**: Uses efficient JOINs and query builders
- **Pagination**: Most list endpoints support pagination

## Troubleshooting

### Issue: "No default language configured"
**Solution**: Run migration 001 which creates languages table

### Issue: "Forbidden - Insufficient permissions"
**Solution**: Verify user has correct role assigned
```sql
SELECT * FROM utilisateur_role WHERE code_utilisateur = YOUR_USER_ID;
```

### Issue: Super admin login fails
**Solution**: Verify super admin was created
```sql
SELECT * FROM utilisateurs WHERE username = 'superadmin';
```

If not found, manually run the super admin creation section from migration 002.

### Issue: "No parish assigned" in my-parish endpoint
**Solution**: This happens when the user hasn't created any ecclesiastical units.
Create a unit or modify the service to use a proper assignment system.

## Next Steps

1. ✅ Run both migrations
2. ✅ Login as super admin and change password
3. ✅ Create additional admin/priest users
4. ✅ Assign roles appropriately
5. ⬜ Add more analytics as needed
6. ⬜ Implement caching for high-traffic endpoints
7. ⬜ Add data visualization on frontend

## API Summary

**Dashboard Endpoints:**
- `GET /dashboard/overview` - System overview (Admin)
- `GET /dashboard/user-growth` - User growth statistics (Admin)
- `GET /dashboard/my-parish` - My parish statistics (Priest/Deacon)
- `GET /dashboard/my-dashboard` - Personal dashboard (All users)
- `GET /dashboard/activity-statistics` - Activity by date range (Admin)
- `GET /dashboard/most-active-parishes` - Parish rankings (Admin)

**All endpoints fully documented in Swagger!**

---

**Your API is now ready for production with comprehensive analytics and role-based access control! 🎉📊**
