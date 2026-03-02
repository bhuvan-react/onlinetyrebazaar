-- Update lead purchase cost to 30 credits (1 Rupee = 1 Credit)
ALTER TABLE lead_purchases ALTER COLUMN cost_paid SET DEFAULT 30;

-- Update existing packages to match 1 Rupee = 1 Credit
UPDATE recharge_packages SET base_credits = price_in_inr;
