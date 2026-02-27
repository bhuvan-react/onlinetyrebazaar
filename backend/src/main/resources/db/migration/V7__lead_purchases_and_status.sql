-- V7: Add lead_purchases table for per-dealer lead tracking + add SKIPPED and FOLLOW_UP to lead_status enum

-- Extend the lead_status enum with new values
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'SKIPPED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'FOLLOW_UP';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'CONVERTED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'REJECTED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'DUPLICATE';

-- lead_purchases: tracks when a dealer pays to unlock a lead (per-dealer, independent)
-- Many dealers can buy the same lead independently.
CREATE TABLE IF NOT EXISTS lead_purchases (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    dealer_id   UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    cost_paid   INTEGER NOT NULL DEFAULT 50,
    purchased_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (lead_id, dealer_id)  -- one purchase per dealer per lead
);

CREATE INDEX IF NOT EXISTS idx_lead_purchases_dealer ON lead_purchases(dealer_id);
CREATE INDEX IF NOT EXISTS idx_lead_purchases_lead   ON lead_purchases(lead_id);
