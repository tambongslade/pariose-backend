#!/bin/bash

# Pariose Database Restore Script
# Usage: ./database/scripts/restore.sh <backup_file>

if [ -z "$1" ]; then
    echo "❌ Error: No backup file specified"
    echo "Usage: ./database/scripts/restore.sh <backup_file>"
    echo "Example: ./database/scripts/restore.sh database/backups/backup_20260207_120000.sql"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}⚠️  WARNING: This will restore the database from backup!${NC}"
echo -e "${YELLOW}Database: pariose_churchnow${NC}"
echo -e "${YELLOW}Backup file: $BACKUP_FILE${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}Restore cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}Creating safety backup of current database...${NC}"
SAFETY_BACKUP="database/backups/before_restore_$(date +%Y%m%d_%H%M%S).sql"
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > $SAFETY_BACKUP

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Safety backup created: $SAFETY_BACKUP${NC}"
else
    echo -e "${RED}❌ Failed to create safety backup!${NC}"
    exit 1
fi

echo -e "${YELLOW}Restoring database from backup...${NC}"

# Drop and recreate database
docker exec pariose-db psql -U pariose_user -c "DROP DATABASE IF EXISTS pariose_churchnow;"
docker exec pariose-db psql -U pariose_user -c "CREATE DATABASE pariose_churchnow;"

# Restore backup
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
    echo -e "${GREEN}Safety backup available at: $SAFETY_BACKUP${NC}"
else
    echo -e "${RED}❌ Restore failed!${NC}"
    echo -e "${YELLOW}Attempting to restore from safety backup...${NC}"
    docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < $SAFETY_BACKUP
    exit 1
fi
