#!/bin/bash

# Pariose Database Backup Script
# Usage: ./database/scripts/backup.sh

BACKUP_DIR="database/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting database backup...${NC}"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created successfully: $BACKUP_FILE${NC}"

    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}Backup size: $SIZE${NC}"

    # Keep only last 7 days of backups
    find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
    echo -e "${GREEN}Old backups cleaned up (kept last 7 days)${NC}"
else
    echo -e "\033[0;31m❌ Backup failed!${NC}"
    exit 1
fi
