#!/bin/bash

# setup-test-db.sh - Setup script for GitLab CI test database

set -e

echo "🔧 Setting up test database for GitLab CI..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
for i in {1..30}; do
  if pg_isready -h localhost -p 5432 -U postgres; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  echo "⏳ Attempt $i/30..."
  sleep 2
done

# Create test database if it doesn't exist
echo "📦 Creating test database: $DATABASE_POSTGRES_TEST_E2E_NAME"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE \"$DATABASE_POSTGRES_TEST_E2E_NAME\";" 2>/dev/null || {
  echo "⚠️  Database already exists or creation failed (continuing...)"
}

echo "✅ Test database setup complete!"