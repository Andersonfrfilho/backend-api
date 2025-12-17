#!/bin/bash

# cleanup-test-db.sh - Cleanup script for GitLab CI test database

set -e

echo "🧹 Cleaning up test database..."

# Drop test database
echo "📦 Dropping test database: $DATABASE_POSTGRES_TEST_E2E_NAME"
psql -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS \"$DATABASE_POSTGRES_TEST_E2E_NAME\";" 2>/dev/null || {
  echo "⚠️  Could not drop database (may not exist or still in use)"
}

echo "✅ Test database cleanup complete!"