# Database Operations Guide

## 📦 Backup & Dump Operations

### 1. Create Full Database Dump (Backup)

```bash
# Create a backup with data
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > database/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Create a backup (custom format - compressed)
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow -Fc -f /tmp/backup.dump
docker cp pariose-db:/tmp/backup.dump database/backups/backup_$(date +%Y%m%d_%H%M%S).dump
```

### 2. Create Schema-Only Dump (No Data)

```bash
# Backup structure only (no data)
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow --schema-only > database/backups/schema_only_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Create Data-Only Dump (No Schema)

```bash
# Backup data only (no structure)
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow --data-only > database/backups/data_only_$(date +%Y%m%d_%H%M%S).sql
```

### 4. Backup Specific Tables

```bash
# Backup specific tables
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow -t utilisateurs -t roles > database/backups/users_roles_backup.sql
```

## 🔄 Restore Operations

### 1. Restore Full Database

```bash
# Restore from SQL dump
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/backups/backup_20260207.sql

# Restore from custom format
docker cp database/backups/backup.dump pariose-db:/tmp/backup.dump
docker exec pariose-db pg_restore -U pariose_user -d pariose_churchnow -c /tmp/backup.dump
```

### 2. Restore to a New Database

```bash
# Create new database
docker exec pariose-db psql -U pariose_user -c "CREATE DATABASE pariose_churchnow_restore;"

# Restore into it
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow_restore < database/backups/backup.sql
```

## 🗑️ Delete/Clear Operations

### 1. Clear All Data (Keep Tables)

```bash
# Delete all data from all tables but keep structure
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

### 2. Drop All Tables

```bash
# Drop all tables (structure and data)
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO pariose_user;
GRANT ALL ON SCHEMA public TO public;
"
```

### 3. Delete Specific Table Data

```bash
# Clear data from specific table
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "TRUNCATE TABLE utilisateurs CASCADE;"

# Delete with condition
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "DELETE FROM activite WHERE date_activite < '2025-01-01';"
```

### 4. Drop Entire Database

```bash
# Drop the entire database
docker exec pariose-db psql -U pariose_user -c "DROP DATABASE pariose_churchnow;"

# Create fresh database
docker exec pariose-db psql -U pariose_user -c "CREATE DATABASE pariose_churchnow;"
```

## 🔄 Complete Database Reset

### Reset Everything (Nuclear Option)

```bash
# Stop and remove container + volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait for database to be ready
sleep 5

# Run migrations
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/migrations/001_initial_schema.sql
```

## 📋 Useful Management Commands

### View Database Size

```bash
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
SELECT pg_size_pretty(pg_database_size('pariose_churchnow')) as database_size;
"
```

### View Table Sizes

```bash
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Count Records in All Tables

```bash
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "
SELECT
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.tables t WHERE t.table_name = pg_tables.tablename AND t.table_schema = pg_tables.schemaname) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
"
```

## 🛡️ Best Practices

### 1. Regular Backups

Create a backup script:

```bash
#!/bin/bash
# database/scripts/backup.sh

BACKUP_DIR="database/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup created: $BACKUP_FILE"
```

Make it executable:
```bash
chmod +x database/scripts/backup.sh
```

Run it:
```bash
./database/scripts/backup.sh
```

### 2. Before Major Operations

Always backup before:
- Migrations
- Major data changes
- Production deployments
- Testing destructive operations

```bash
# Quick backup before operation
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > database/backups/before_operation_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Test Restores

Periodically test your backups:

```bash
# Create test database
docker exec pariose-db psql -U pariose_user -c "CREATE DATABASE test_restore;"

# Restore backup to test database
docker exec -i pariose-db psql -U pariose_user -d test_restore < database/backups/latest_backup.sql

# Verify
docker exec pariose-db psql -U pariose_user -d test_restore -c "\dt"

# Drop test database
docker exec pariose-db psql -U pariose_user -c "DROP DATABASE test_restore;"
```

## 🚨 Emergency Recovery

### If Database is Corrupted

```bash
# 1. Stop the application
# Stop NestJS app (Ctrl+C)

# 2. Backup current state (if possible)
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > database/backups/corrupted_backup.sql 2>&1

# 3. Drop and recreate database
docker exec pariose-db psql -U pariose_user -c "DROP DATABASE pariose_churchnow;"
docker exec pariose-db psql -U pariose_user -c "CREATE DATABASE pariose_churchnow;"

# 4. Restore from last good backup
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/backups/last_good_backup.sql

# 5. Restart application
npm run start:dev
```

### If Container is Lost

```bash
# 1. Stop everything
docker-compose down

# 2. Start fresh (volume persists)
docker-compose up -d

# If volume was lost, restore from backup:
sleep 5
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/backups/latest_backup.sql
```

## 📊 Automated Backup with Cron

Add to your crontab (Linux/Mac):

```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * cd /path/to/pariose-backend && docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > database/backups/daily_backup_$(date +\%Y\%m\%d).sql
```

## 🔍 Verify Database Integrity

```bash
# Check for corrupted indexes
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "REINDEX DATABASE pariose_churchnow;"

# Vacuum and analyze
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "VACUUM ANALYZE;"

# Check database connections
docker exec pariose-db psql -U pariose_user -d pariose_churchnow -c "SELECT * FROM pg_stat_activity WHERE datname = 'pariose_churchnow';"
```

---

**Remember**: Always backup before performing destructive operations!
