# Quick Reference Guide

## 🚀 Common Operations

### Start/Stop Services

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove all data (⚠️ destroys data!)
docker-compose down -v

# Restart database
docker-compose restart
```

### Application Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test
```

## 💾 Backup & Restore

### Quick Backup

```bash
# Create backup (easiest way)
./database/scripts/backup.sh

# Or manually
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > database/backups/my_backup.sql
```

### Quick Restore

```bash
# Restore from backup
./database/scripts/restore.sh database/backups/backup_20260207_210109.sql

# Or manually
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/backups/my_backup.sql
```

### Reset Database (⚠️ Dangerous!)

```bash
# Complete reset - requires typing "RESET" to confirm
./database/scripts/reset_db.sh
```

## 🗑️ Delete Operations

### Clear All Data (Keep Structure)

```bash
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END \$\$;
"
```

### Clear Specific Table

```bash
# Clear all users
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "TRUNCATE TABLE utilisateurs CASCADE;"

# Delete with condition
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "DELETE FROM activite WHERE code = 123;"
```

## 🔍 Database Inspection

### View Tables

```bash
# List all tables
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "\dt"

# View table structure
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "\d utilisateurs"
```

### Query Data

```bash
# View all roles
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "SELECT * FROM roles;"

# View all users
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "SELECT code, username, noms FROM utilisateurs;"

# Count records
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "SELECT COUNT(*) FROM utilisateurs;"
```

### Database Size

```bash
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
SELECT pg_size_pretty(pg_database_size('pariose_churchnow'));"
```

## 🛠️ Interactive Database Shell

```bash
# Open PostgreSQL shell
docker exec -it pariose-db psql -U pariose_user -d pariose_churchnow

# Inside the shell:
\dt              # List tables
\d table_name    # Describe table
\q               # Exit
```

## 🔧 Troubleshooting

### Database Won't Start

```bash
# Check container logs
docker logs pariose-db

# Check if port is in use
lsof -i :5432

# Restart with fresh start
docker-compose restart
```

### Connection Issues

```bash
# Test connection
docker exec pariose-db pg_isready -U pariose_user

# Check database exists
docker exec pariose-db psql -U pariose_user -l

# View active connections
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "SELECT * FROM pg_stat_activity;"
```

### Application Won't Connect

```bash
# Verify environment variables
cat .env

# Check if database is ready
docker ps

# Restart application
# Press Ctrl+C to stop, then:
npm run start:dev
```

## 📦 Import/Export Data

### Export Specific Tables

```bash
# Export users table
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow -t utilisateurs > users_export.sql

# Export multiple tables
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow -t utilisateurs -t roles -t permissions > user_data.sql
```

### Export Data as CSV

```bash
# Export users to CSV
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
COPY utilisateurs TO STDOUT WITH CSV HEADER" > users.csv

# Export with custom query
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
COPY (SELECT code, username, noms FROM utilisateurs) TO STDOUT WITH CSV HEADER" > users_simple.csv
```

### Import CSV Data

```bash
# Import from CSV
docker cp users.csv pariose-db:/tmp/users.csv
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
COPY utilisateurs FROM '/tmp/users.csv' WITH CSV HEADER"
```

## 🔐 Security

### Change Database Password

1. Update `.env` file with new password
2. Update Docker container:

```bash
docker exec pariose-db psql -U pariose_user -c "ALTER USER pariose_user PASSWORD 'new_password';"
```

3. Restart services:

```bash
docker-compose restart
npm run start:dev
```

## 📊 Monitoring

### Check Database Health

```bash
# Container health
docker ps --filter "name=pariose-db"

# Database size
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
SELECT
    pg_size_pretty(pg_database_size('pariose_churchnow')) as size,
    (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as tables;
"

# Active queries
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity
WHERE datname = 'pariose_churchnow';"
```

## 📚 Documentation Files

- `README.md` - Main project documentation
- `SETUP_COMPLETE.md` - Setup summary and status
- `database/DATABASE_OPERATIONS.md` - Detailed database operations
- `QUICK_REFERENCE.md` - This file (quick commands)

## 🆘 Emergency Commands

### Something Went Wrong - Full Reset

```bash
# 1. Backup current state (if possible)
./database/scripts/backup.sh

# 2. Complete reset
docker-compose down -v
docker-compose up -d
sleep 5

# 3. Restore from backup or run migrations
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/migrations/001_initial_schema.sql

# 4. Restart app
npm run start:dev
```

---

**Pro Tip**: Always backup before major operations!
```bash
./database/scripts/backup.sh
```
