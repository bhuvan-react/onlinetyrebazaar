-- V12: Convert ENUM columns to VARCHAR to fix Hibernate 6 comparison issues

-- 1. Convert leads.status
ALTER TABLE leads ALTER COLUMN status TYPE VARCHAR(50);

-- 2. Convert otps.otp_type
ALTER TABLE otps ALTER COLUMN otp_type TYPE VARCHAR(50);

-- 3. Drop implicit casts for these enums (no longer needed)
DROP CAST IF EXISTS (varchar AS lead_status);
DROP CAST IF EXISTS (varchar AS otp_category);

-- Note: We keep the ENUM types in the database for now to avoid dropping them if they are referenced elsewhere,
-- but the columns themselves are now standard VARCHAR, which Hibernate 6 handles correctly.
