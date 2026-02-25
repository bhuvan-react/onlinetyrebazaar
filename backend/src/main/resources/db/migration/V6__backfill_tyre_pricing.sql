-- Backfill extended pricing fields for all tyres
UPDATE tyres 
SET 
    new_price = price,
    used_price = ROUND(CAST(price * 0.6 AS numeric), 2),
    original_price = ROUND(CAST(price * 1.2 AS numeric), 2),
    rating = 4.5,
    review_count = FLOOR(RANDOM() * 300) + 50
WHERE new_price IS NULL;
