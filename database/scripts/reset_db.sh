#!/bin/bash

# Pariose Database Reset Script
# Usage: ./database/scripts/reset_db.sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}⚠️  WARNING: This will completely reset your database!${NC}"
echo -e "${RED}All data will be lost!${NC}"
echo ""
read -p "Are you sure you want to continue? Type 'RESET' to confirm: " CONFIRM

if [ "$CONFIRM" != "RESET" ]; then
    echo -e "${YELLOW}Reset cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}Creating backup before reset...${NC}"
BACKUP_FILE="database/backups/before_reset_$(date +%Y%m%d_%H%M%S).sql"
docker exec pariose-db pg_dump -U pariose_user -d pariose_churchnow > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Failed to create backup! Aborting reset.${NC}"
    exit 1
fi

echo -e "${YELLOW}Dropping database...${NC}"
docker exec pariose-db psql -U pariose_user -c "DROP DATABASE IF EXISTS pariose_churchnow;"

echo -e "${YELLOW}Creating fresh database...${NC}"
docker exec pariose-db psql -U pariose_user -c "CREATE DATABASE pariose_churchnow;"

echo -e "${YELLOW}Running migrations...${NC}"
docker exec -i pariose-db psql -U pariose_user -d pariose_churchnow < database/migrations/001_initial_schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database reset successfully!${NC}"
    echo -e "${GREEN}Fresh database created with clean schema${NC}"
    echo -e "${YELLOW}Backup saved at: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Migration failed!${NC}"
    exit 1
fi
