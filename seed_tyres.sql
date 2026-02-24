-- Seed Data for Tyres Table

-- 235/60 R18 (User specifically requested)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Michelin', 'Primacy SUV', '235/60 R18', 15500.0, 'MICH-235-60-18-P', 'Superb Braking, Quiet Ride, Long Lasting', '/michelin-suv.jpg', 5),
(gen_random_uuid(), 'Bridgestone', 'Dueler H/P Sport', '235/60 R18', 14200.0, 'BS-235-60-18-D', 'High Performance, Excellent Wet Grip', '/bridgestone-suv.jpg', 6),
(gen_random_uuid(), 'Apollo', 'Apterra HT2', '235/60 R18', 9800.0, 'AP-235-60-18-A', 'All Terrain, Low Noise, Durability', '/apollo-suv.jpg', 4);

-- 185/65 R15 (Common 4W)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'MRF', 'ZVTV', '185/65 R15', 4599.0, 'MRF-185-65-15-Z', 'All Season, Tubeless', '/mrf-car.jpg', 5),
(gen_random_uuid(), 'CEAT', 'SecuraDrive', '185/65 R15', 3999.0, 'CEAT-185-65-15-S', 'Wet Grip, Silent', '/ceat-car.jpg', 4);

-- 195/55 R16 (Baleno/i20)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Bridgestone', 'Ecopia EP150', '195/55 R16', 7200.0, 'BS-195-55-16-E', 'Eco Friendly, Fuel Efficient', '/bridgestone-car.jpg', 6),
(gen_random_uuid(), 'Yokohama', 'Earth-1', '195/55 R16', 6800.0, 'YOKO-195-55-16-E', 'Japanese Quality, Superior Grip', '/yokohama-car.jpg', 5);

-- 215/60 R17 (Creta/Seltos)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Goodyear', 'Assurance TripleMax 2', '215/60 R17', 9500.0, 'GY-215-60-17-A', 'HydroTred Technology, Wet Braking', '/goodyear-car.jpg', 5),
(gen_random_uuid(), 'JK Tyre', 'UX Royale', '215/60 R17', 7800.0, 'JK-215-60-17-U', 'Balanced Performance, Comfortable', '/jk-car.jpg', 4);

-- 165/80 R14 (Swift LXI)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'MRF', 'ZVTS', '165/80 R14', 3200.0, 'MRF-165-80-14-Z', 'Value for Money, Long Life', '/mrf-car.jpg', 5),
(gen_random_uuid(), 'Apollo', 'Amazer 4G Life', '165/80 R14', 3100.0, 'AP-165-80-14-A', 'Highest Mileage, Durability', '/apollo-car.jpg', 4);

-- 205/65 R16 (Creta E/EX)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Continental', 'UltraContact UC6', '205/65 R16', 8200.0, 'CONT-205-65-16-U', 'Diamond Edge, Noise Breakers', '/conti-car.jpg', 5);

-- 185/60 R15 (City V)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Pirelli', 'Cinturato P1', '185/60 R15', 6200.0, 'PIR-185-60-15-C', 'Green Performance, High Grip', '/pirelli-car.jpg', 5);

-- 185/55 R16 (City ZX)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Michelin', 'Energy XM2+', '185/55 R16', 8800.0, 'MICH-185-55-16-E', 'Stands Strong in Tough Conditions', '/michelin-car.jpg', 5);

-- 195/60 R16 (Nexon/Punch)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'MRF', 'Wanderer Estreet', '195/60 R16', 6500.0, 'MRF-195-60-16-W', 'On-Off Road Traction', '/mrf-car.jpg', 5);

-- 255/65 R18 (Thar)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Ceat', 'Czar A/T', '255/65 R18', 12000.0, 'CEAT-255-65-18-C', 'Rugged Performance, All Terrain', '/ceat-suv.jpg', 4);

-- 265/60 R18 (Fortuner)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Bridgestone', 'Dueler A/T 693', '265/60 R18', 16500.0, 'BS-265-60-18-D', 'Original Equipment Performance', '/bridgestone-suv.jpg', 6);

-- 215/55 R17 (Innova Crysta)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Yokohama', 'BlueEarth-GT AE51', '215/55 R17', 10500.0, 'YOKO-215-55-17-B', 'High Comfort, Fuel Efficient', '/yokohama-car.jpg', 5);

-- 80/100-18 (Splendor)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'CEAT', 'Milaze', '80/100-18', 1850.0, 'CEAT-80-100-18-M', 'Long Life, Better Grip', '/ceat-2w.jpg', 4),
(gen_random_uuid(), 'MRF', 'Nylogrip Plus', '80/100-18', 1950.0, 'MRF-80-100-18-N', 'Standard Street Tyre', '/mrf-2w.jpg', 5);

-- 90/90-12 (Activa/Jupiter)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Apollo', 'Actizip S2', '90/90-12', 1250.0, 'AP-90-90-12-A', 'Z-category, High Grip', '/apollo-2w.jpg', 4),
(gen_random_uuid(), 'JK Tyre', 'Blaze BA21', '90/90-12', 1150.0, 'JK-90-90-12-B', 'Enhanced Durability', '/jk-2w.jpg', 3);

-- 90/90-17 (Pulsar)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'MRF', 'Mogrip Meteor', '90/90-17', 2200.0, 'MRF-90-90-17-M', 'Off-road Grip, Rugged', '/mrf-2w.jpg', 5);

-- 100/90-19 (Classic 350)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'CEAT', 'Zoom Plus', '100/90-19', 2800.0, 'CEAT-100-90-19-Z', 'Cruising Performance', '/ceat-2w.jpg', 4);

-- 4.00-8 (RE Compact)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'MRF', 'Nylogrip', '4.00-8', 1100.0, 'MRF-4-00-8-N', 'Heavy Duty, 3W Special', '/mrf-3w.jpg', 5);

-- 4.50-10 (Ape City)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'Apollo', 'Loadstar', '4.50-10', 1450.0, 'AP-4-50-10-L', 'High Load Capacity', '/apollo-3w.jpg', 4);

-- 3.75-12 (Treo)
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years) VALUES
(gen_random_uuid(), 'CEAT', 'Anmol', '3.75-12', 1350.0, 'CEAT-3-75-12-A', 'Fuel Efficient 3W', '/ceat-3w.jpg', 4);
