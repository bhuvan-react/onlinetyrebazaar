-- Add tyre_id column to leads table
ALTER TABLE leads ADD COLUMN tyre_id UUID;

-- Add foreign key constraint
ALTER TABLE leads ADD CONSTRAINT fk_leads_tyre FOREIGN KEY (tyre_id) REFERENCES tyres(id);
