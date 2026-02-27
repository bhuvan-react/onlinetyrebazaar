-- V8: Create password_reset_tokens table for Forgot Password flow

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id   UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    expires_at  TIMESTAMP NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prt_dealer ON password_reset_tokens(dealer_id);
