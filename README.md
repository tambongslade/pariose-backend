# Pariose Backend - ChurchNow API

A comprehensive church management system backend built with NestJS and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Run migrations** (Already done - skip if database is set up)
   ```bash
   docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/migrations/001_initial_schema.sql
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   ```

5. **Access the API**
   ```
   http://localhost:3000/api/v1
   ```

## 📦 Database Structure

### Core Entities

#### 1. **Authentication & Users** 👥
- `utilisateurs` - User accounts
- `roles` - User roles (SUPER_ADMIN, ADMIN, PRIEST, DEACON, VOLUNTEER, USER)
- `permissions` - System permissions
- `role_permission` - Role-permission mappings
- `role_utilisateur` - User-role assignments

#### 2. **Ecclesiastical Structure** ⛪
- `unite_ecclesiale` - Church organizational units (Diocese, Parish, etc.)
- `abonnement_unite_ecclesiale` - User subscriptions to units

#### 3. **Liturgical Services** ✝️
- `celebration_eucharistique` - Mass schedules
- `intention_messe` - Mass intentions/prayer requests
- `confessions` - Confession schedules
- `langue_liturgique` - Liturgical languages

#### 4. **Activities & Programs** 📅
- `activite` - Church activities and events
- `type_activite` - Activity types (retreats, prayer groups, etc.)
- `programme_paroissial` - Parish programs
- `programme_celebration_eucharistique` - Mass program details

#### 5. **Communication** 📢
- `communiques_paroissiaux` - Parish announcements
- `type_communique` - Announcement types

#### 6. **Resources** 🏛️
- `lieux_saint` - Holy places/chapels
- `objets_sacres` - Sacred objects inventory

## 🔧 Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=pariose_user
DB_PASSWORD=pariose_password_2026
DB_NAME=pariose_churchnow

# Application
PORT=3000
NODE_ENV=development

# JWT (for authentication)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
```

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker logs pariose-db

# Access PostgreSQL CLI
docker exec -it pariose-db psql -U pariose_user -d pariose_churchnow

# Restart database
docker-compose restart
```

## 📊 Database Management

### Connect to Database
```bash
docker exec -it pariose-db psql -U pariose_user -d pariose_churchnow
```

### Useful SQL Commands
```sql
-- List all tables
\dt

-- Describe a table
\d table_name

-- View all roles
SELECT * FROM roles;

-- View all permissions
SELECT * FROM permissions;

-- Exit
\q
```

## 🔐 Default Roles

The system comes with 6 predefined roles:
1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Administrative access
3. **PRIEST** - Priest-level access
4. **DEACON** - Deacon-level access
5. **VOLUNTEER** - Volunteer access
6. **USER** - Basic user access

## 🔑 Default Permissions

11 default permissions are created:
- CREATE_USER
- UPDATE_USER
- DELETE_USER
- VIEW_USER
- MANAGE_ROLES
- MANAGE_PERMISSIONS
- MANAGE_ECCLESIASTICAL_UNITS
- MANAGE_ACTIVITIES
- MANAGE_CELEBRATIONS
- MANAGE_ANNOUNCEMENTS
- VIEW_REPORTS

## 📝 Scripts

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:cov

# Linting
npm run lint
npm run format
```

## 🏗️ Project Structure

```
pariose-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── modules/         # Feature modules (to be created)
│   ├── app.module.ts    # Root module
│   └── main.ts          # Entry point
├── database/
│   └── migrations/      # SQL migration files
├── docker-compose.yml   # Docker configuration
├── .env                 # Environment variables
└── README.md           # Documentation
```

## 🔜 Next Steps

1. **Create Entity Models** - TypeORM entities for each table
2. **Build API Modules** - CRUD operations for each resource
3. **Implement Authentication** - JWT-based auth system
4. **Add Authorization** - Role-based access control
5. **API Documentation** - Swagger/OpenAPI docs
6. **Validation** - DTOs with class-validator
7. **Testing** - Unit and e2e tests

## 📚 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token

### Users
- `GET /api/v1/users` - List users
- `GET /api/v1/users/:id` - Get user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Ecclesiastical Units
- `GET /api/v1/ecclesiastical-units` - List units
- `POST /api/v1/ecclesiastical-units` - Create unit
- `GET /api/v1/ecclesiastical-units/:id` - Get unit
- `PATCH /api/v1/ecclesiastical-units/:id` - Update unit

### Celebrations (Masses)
- `GET /api/v1/celebrations` - List masses
- `POST /api/v1/celebrations` - Create mass
- `GET /api/v1/celebrations/:id` - Get mass details

### Activities
- `GET /api/v1/activities` - List activities
- `POST /api/v1/activities` - Create activity
- `GET /api/v1/activities/:id` - Get activity details

### Announcements
- `GET /api/v1/announcements` - List announcements
- `POST /api/v1/announcements` - Create announcement

## 🛠️ Technology Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Validation**: class-validator & class-transformer
- **Runtime**: Node.js 18+
- **Package Manager**: npm

## 📄 License

UNLICENSED - Private Project

## 👨‍💻 Author

Pariose Development Team

---

**Status**: ✅ Database configured and connected
**Last Updated**: February 7, 2026
