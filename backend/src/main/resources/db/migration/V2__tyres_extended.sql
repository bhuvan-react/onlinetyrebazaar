-- Extend tyres table with pricing, rating, stock, and type fields
ALTER TABLE tyres
    ADD COLUMN IF NOT EXISTS new_price       DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS used_price      DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS original_price  DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS rating          DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS review_count    INTEGER,
    ADD COLUMN IF NOT EXISTS type            VARCHAR(10) DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS in_stock        BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS condition       VARCHAR(50),
    ADD COLUMN IF NOT EXISTS tread_depth     INTEGER,
    ADD COLUMN IF NOT EXISTS free_installation BOOLEAN DEFAULT TRUE;
