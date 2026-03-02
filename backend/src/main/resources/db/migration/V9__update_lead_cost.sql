-- Update lead purchase cost to 1 credit
ALTER TABLE lead_purchases ALTER COLUMN cost_paid SET DEFAULT 1;
-- We don't necessarily want to update historical records as they represent actual past transactions,
-- but for local testing it might be desired. Usually we just change the default and the code constant.
