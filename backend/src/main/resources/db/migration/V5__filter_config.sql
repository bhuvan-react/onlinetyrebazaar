CREATE TABLE filter_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filter_type VARCHAR(50) NOT NULL, -- 'PRICE_RANGE' or 'RATING'
    label VARCHAR(100) NOT NULL,
    min_value DECIMAL(10, 2) NOT NULL,
    max_value DECIMAL(10, 2),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Price Ranges
INSERT INTO filter_config (id, filter_type, label, min_value, max_value, sort_order) VALUES
(gen_random_uuid(), 'PRICE_RANGE', 'Under ₹2,000', 0, 2000, 1),
(gen_random_uuid(), 'PRICE_RANGE', '₹2,000 - ₹3,000', 2000, 3000, 2),
(gen_random_uuid(), 'PRICE_RANGE', '₹3,000 - ₹4,000', 3000, 4000, 3),
(gen_random_uuid(), 'PRICE_RANGE', '₹4,000 - ₹5,000', 4000, 5000, 4),
(gen_random_uuid(), 'PRICE_RANGE', 'Above ₹5,000', 5000, NULL, 5);

-- Insert Minimum Ratings
INSERT INTO filter_config (id, filter_type, label, min_value, max_value, sort_order) VALUES
(gen_random_uuid(), 'RATING', 'All', 0, NULL, 1),
(gen_random_uuid(), 'RATING', '3 & Up', 3.0, NULL, 2),
(gen_random_uuid(), 'RATING', '3.5 & Up', 3.5, NULL, 3),
(gen_random_uuid(), 'RATING', '4 & Up', 4.0, NULL, 4),
(gen_random_uuid(), 'RATING', '4.5 & Up', 4.5, NULL, 5);
