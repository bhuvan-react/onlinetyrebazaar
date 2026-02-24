-- V3__lead_questionnaire.sql
-- Adds detailed questionnaire fields to the leads table to support the dealer app dashboard

ALTER TABLE leads ADD COLUMN tyre_size VARCHAR(50);
ALTER TABLE leads ADD COLUMN tyre_position VARCHAR(50);
ALTER TABLE leads ADD COLUMN urgency VARCHAR(50);
ALTER TABLE leads ADD COLUMN issues JSONB;
ALTER TABLE leads ADD COLUMN usage_type VARCHAR(100);
ALTER TABLE leads ADD COLUMN budget VARCHAR(50);
ALTER TABLE leads ADD COLUMN preferences JSONB;
ALTER TABLE leads ADD COLUMN service_requirement VARCHAR(100);
ALTER TABLE leads ADD COLUMN quantity INTEGER DEFAULT 1;
