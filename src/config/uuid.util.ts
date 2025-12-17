import { v7 as uuidv7 } from 'uuid';

/**
 * Generates a UUID v7
 * - Sortable (timestamp-based prefix)
 * - Better performance for database indexing
 * - Used by major companies (Discord, Stripe, etc)
 */
export function generateUUIDv7(): string {
  return uuidv7();
}

/**
 * Creates a PostgreSQL function for UUID v7 generation
 * This allows the database to generate UUIDs directly
 */
export function getUUIDv7PostgresFunction(): string {
  return `
    CREATE OR REPLACE FUNCTION gen_random_uuid_v7()
    RETURNS uuid AS $$
    BEGIN
      RETURN (
        (extract(epoch from now())::bigint * 1000)::bit(48)::text ||
        (random()::bit(12)::text) ||
        (random()::bit(32)::text) ||
        (random()::bit(32)::text) ||
        (random()::bit(16)::text)
      )::uuid;
    END;
    $$ LANGUAGE plpgsql;
  `;
}
