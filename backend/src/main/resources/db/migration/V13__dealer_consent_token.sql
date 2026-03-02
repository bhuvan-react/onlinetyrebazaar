-- V13: Add consent_token column to dealers for T&C acceptance audit trail
-- This column stores an immutable, signed JWT capturing dealer consent at registration time.
-- It should NEVER be updated after initial INSERT.
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS consent_token TEXT;
