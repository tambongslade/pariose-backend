# Multilingual Support Implementation Guide

## Overview

Your Pariose ChurchNow API now supports multilingual content using a translation table pattern. This allows you to serve content in multiple languages (English, French, and easily add more) without changing your database schema.

## What Has Been Implemented

### 1. **Language Module** ✅
- Complete CRUD operations for managing languages
- Default language configuration
- Active/inactive language management
- API endpoints at `/api/v1/languages`

### 2. **Ecclesiastical Units Translation** ✅
- Translation support for names, descriptions, and addresses
- Language-specific content retrieval
- Fallback to default language when translation missing
- Backward compatible with existing data

### 3. **Database Structure** ✅
- `languages` table for managing supported languages
- `ecclesiastical_unit_translations` table for storing translations
- Migration script ready to run

## Quick Start

### Step 1: Run the Migration

Execute the SQL migration to create the tables:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database -f migrations/001-add-multilingual-support.sql
```

This will:
- Create the `languages` table with English and French
- Create the `ecclesiastical_unit_translations` table
- Migrate any existing data to English translations
- Set up indexes for performance

### Step 2: Test the Language Endpoints

The application is already running! Test the endpoints:

```bash
# Get all languages
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/languages

# Get default language
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/languages/default

# Add a new language (Admin only)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "es",
    "name": "Español",
    "is_active": true
  }' \
  http://localhost:3000/api/v1/languages
```

## API Usage Examples

### Creating an Ecclesiastical Unit with Translations

```bash
POST /api/v1/ecclesiastical-units
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "code_type": 1,
  "code_unite_parent": null,
  "longitude": 11.5021,
  "latitude": 3.848,
  "statut_canonique": "Established Parish",
  "translations": [
    {
      "languageCode": "en",
      "nom": "Saint Mary Parish",
      "description": "A welcoming Catholic community in Montreal",
      "adresse": "123 Church Street, Montreal, QC H1A 1B1"
    },
    {
      "languageCode": "fr",
      "nom": "Paroisse Sainte-Marie",
      "description": "Une communauté catholique accueillante à Montréal",
      "adresse": "123 rue de l'Église, Montréal, QC H1A 1B1"
    }
  ]
}
```

### Getting Content in Specific Language

```bash
# Get in English (default)
GET /api/v1/ecclesiastical-units/1?lang=en

# Get in French
GET /api/v1/ecclesiastical-units/1?lang=fr

# Get all translations
GET /api/v1/ecclesiastical-units/1
```

### Response Format

**Single language request** (`?lang=en`):
```json
{
  "code": 1,
  "code_type": 1,
  "longitude": "11.5021",
  "latitude": "3.848",
  "statut_canonique": "Established Parish",
  "translations": [
    {
      "id": 1,
      "languageCode": "en",
      "nom": "Saint Mary Parish",
      "description": "A welcoming Catholic community in Montreal",
      "adresse": "123 Church Street, Montreal, QC H1A 1B1",
      "language": {
        "code": "en",
        "name": "English",
        "is_default": true
      }
    }
  ]
}
```

**All translations** (no `?lang` parameter):
```json
{
  "code": 1,
  "code_type": 1,
  "translations": [
    {
      "id": 1,
      "languageCode": "en",
      "nom": "Saint Mary Parish",
      "description": "A welcoming Catholic community in Montreal",
      "adresse": "123 Church Street, Montreal, QC H1A 1B1"
    },
    {
      "id": 2,
      "languageCode": "fr",
      "nom": "Paroisse Sainte-Marie",
      "description": "Une communauté catholique accueillante à Montréal",
      "adresse": "123 rue de l'Église, Montréal, QC H1A 1B1"
    }
  ]
}
```

## Language Management API

### Available Endpoints

1. **GET `/api/v1/languages`** - Get all languages
2. **GET `/api/v1/languages/active`** - Get only active languages
3. **GET `/api/v1/languages/default`** - Get the default language
4. **GET `/api/v1/languages/:code`** - Get specific language
5. **POST `/api/v1/languages`** - Create new language (Admin)
6. **PATCH `/api/v1/languages/:code`** - Update language (Admin)
7. **DELETE `/api/v1/languages/:code`** - Delete language (Admin)
8. **POST `/api/v1/languages/:code/set-default`** - Set as default (Admin)
9. **POST `/api/v1/languages/:code/activate`** - Activate language (Admin)
10. **POST `/api/v1/languages/:code/deactivate`** - Deactivate language (Admin)

### Managing Languages (Admin Only)

```bash
# Add Spanish
POST /api/v1/languages
{
  "code": "es",
  "name": "Español",
  "is_active": true
}

# Set French as default
POST /api/v1/languages/fr/set-default

# Deactivate a language
POST /api/v1/languages/es/deactivate
```

## Fallback Strategy

The system implements intelligent fallback:

1. If a translation exists for the requested language → return it
2. If not, check for translation in the default language → return it
3. If neither exists → return empty translations array

This ensures users always get content, even if translations are incomplete.

## Database Queries

### Find units missing French translations

```sql
SELECT
  eu.code,
  eu.libelle,
  eut_en.nom as english_name
FROM unite_ecclesiale eu
LEFT JOIN ecclesiastical_unit_translations eut_en
  ON eu.code = eut_en.ecclesiastical_unit_code AND eut_en.language_code = 'en'
LEFT JOIN ecclesiastical_unit_translations eut_fr
  ON eu.code = eut_fr.ecclesiastical_unit_code AND eut_fr.language_code = 'fr'
WHERE eut_fr.id IS NULL;
```

### Translation coverage report

```sql
SELECT
  l.code as language,
  l.name,
  COUNT(eut.id) as translated_count,
  (SELECT COUNT(*) FROM unite_ecclesiale) as total_count,
  ROUND(
    COUNT(eut.id)::numeric /
    (SELECT COUNT(*) FROM unite_ecclesiale) * 100,
    2
  ) as coverage_percentage
FROM languages l
LEFT JOIN ecclesiastical_unit_translations eut ON l.code = eut.language_code
WHERE l.is_active = true
GROUP BY l.code, l.name
ORDER BY coverage_percentage DESC;
```

## Testing in Swagger

1. Open Swagger UI: http://localhost:3000/api/docs
2. Find the **Languages** section
3. Test the endpoints:
   - `GET /languages` - View available languages
   - `GET /languages/active` - See active languages
4. Find the **Ecclesiastical Units** section
5. Test creating units with translations
6. Test retrieving in different languages using `?lang=en` or `?lang=fr`

## Backward Compatibility

The implementation is **fully backward compatible**:

- Existing `libelle`, `description`, and `adresse` fields remain in the database
- New `translations` array is optional in POST/PATCH requests
- If translations are not provided, the system works with existing fields
- You can gradually migrate to using translations

## Performance Considerations

- **Indexes**: All translation tables have proper indexes on unit_code and language_code
- **Eager/Lazy Loading**: Translations are loaded lazily (only when requested)
- **Caching**: Consider adding Redis caching for frequently accessed translations
- **Query Optimization**: Using JOINs with language filter instead of N+1 queries

## Next Steps

### Option 1: Gradual Migration
- Keep using existing fields for now
- Add translations when creating new content
- Gradually translate existing content

### Option 2: Full Migration
- Run the migration script
- Update all existing units with translations
- Eventually remove `libelle`, `description`, `adresse` columns from base table

### Option 3: Add More Entities
Use the same pattern for other entities:
- Announcements
- Activities
- Celebrations
- Holy Places
- Sacred Objects

## Common Issues & Solutions

### Issue: "No default language configured"
**Solution**: Run the migration script, or manually insert:
```sql
INSERT INTO languages (code, name, is_default, is_active)
VALUES ('en', 'English', true, true);
```

### Issue: Translations not showing in response
**Solution**: Make sure:
1. Migration has been run
2. Translations were created with valid language codes
3. You're using `?lang=en` parameter or checking all translations

### Issue: Cannot delete default language
**Solution**: This is by design. Set another language as default first:
```bash
POST /api/v1/languages/fr/set-default
```

## Support

For issues or questions:
- Check Swagger documentation: http://localhost:3000/api/docs
- Review migration script: `migrations/001-add-multilingual-support.sql`
- Check implementation details in `src/languages/` and `src/ecclesiastical-units/`

## Summary

✅ Languages module fully implemented
✅ Ecclesiastical Units translation support added
✅ Migration script created
✅ API endpoints documented in Swagger
✅ Backward compatible
✅ Fallback to default language
✅ Performance optimized with indexes

Your API is now ready for multilingual content! 🌍🎉
