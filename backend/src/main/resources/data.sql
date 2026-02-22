-- Serviceable Locations
INSERT INTO serviceable_locations (id, pincode, city, state) VALUES (gen_random_uuid(), '500001', 'Hyderabad', 'Telangana') ON CONFLICT DO NOTHING;
INSERT INTO serviceable_locations (id, pincode, city, state) VALUES (gen_random_uuid(), '560001', 'Bengaluru', 'Karnataka') ON CONFLICT DO NOTHING;
INSERT INTO serviceable_locations (id, pincode, city, state) VALUES (gen_random_uuid(), '400001', 'Mumbai', 'Maharashtra') ON CONFLICT DO NOTHING;

-- Recharge Packages
INSERT INTO recharge_packages (id, name, price_in_inr, base_credits, bonus_credits, popular, active)
VALUES (gen_random_uuid(), 'Starter Pack', 1000, 100, 10, false, true)
ON CONFLICT DO NOTHING;

INSERT INTO recharge_packages (id, name, price_in_inr, base_credits, bonus_credits, popular, active)
VALUES (gen_random_uuid(), 'Pro Dealer Pack', 5000, 500, 100, true, true)
ON CONFLICT DO NOTHING;

-- Dummy Dealers
INSERT INTO dealers (id, business_name, owner_name, is_verified, email, phone_number, street, city, state, zip_code, country, opening_time, closing_time)
VALUES ('d1000000-0000-0000-0000-000000000001', 'Best Tyres Hyderabad', 'Ramesh Kumar', true, 'ramesh@besttyres.com', '9876543210', 'Road No 1, Banjara Hills', 'Hyderabad', 'Telangana', '500034', 'India', '09:00:00', '20:00:00')
ON CONFLICT (phone_number) DO NOTHING;

INSERT INTO dealers (id, business_name, owner_name, is_verified, email, phone_number, street, city, state, zip_code, country, opening_time, closing_time)
VALUES ('d1000000-0000-0000-0000-000000000002', 'Speedy Wheels Bangalore', 'Suresh Reddy', false, 'suresh@speedy.com', '9876543211', 'Indiranagar 100ft Road', 'Bengaluru', 'Karnataka', '560038', 'India', '10:00:00', '21:00:00')
ON CONFLICT (phone_number) DO NOTHING;

-- Open Days for Dummy Dealers (Mon–Sat)
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000001', 'MONDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000001', 'TUESDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000001', 'WEDNESDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000001', 'THURSDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000001', 'FRIDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000001', 'SATURDAY') ON CONFLICT DO NOTHING;

INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000002', 'MONDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000002', 'TUESDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000002', 'WEDNESDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000002', 'THURSDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000002', 'FRIDAY') ON CONFLICT DO NOTHING;
INSERT INTO dealer_open_days (dealer_id, open_day) VALUES ('d1000000-0000-0000-0000-000000000002', 'SATURDAY') ON CONFLICT DO NOTHING;

-- Wallets for Dummy Dealers
INSERT INTO wallets (id, dealer_id, purchased_credits, bonus_credits)
VALUES (gen_random_uuid(), 'd1000000-0000-0000-0000-000000000001', 500, 50)
ON CONFLICT (dealer_id) DO NOTHING;

INSERT INTO wallets (id, dealer_id, purchased_credits, bonus_credits)
VALUES (gen_random_uuid(), 'd1000000-0000-0000-0000-000000000002', 0, 0)
ON CONFLICT (dealer_id) DO NOTHING;

-- Dummy Leads (matching current leads table schema)
INSERT INTO leads (id, customer_mobile, vehicle_type, tyre_type, tyre_brand, vehicle_model, location_area, location_pincode, status)
VALUES (gen_random_uuid(), '9988776655', 'FOUR_WHEELER', 'TUBELESS', 'MRF', 'Swift Dzire', 'Banjara Hills', '500034', 'NEW')
ON CONFLICT DO NOTHING;

INSERT INTO leads (id, customer_mobile, vehicle_type, tyre_type, tyre_brand, vehicle_model, location_area, location_pincode, status)
VALUES (gen_random_uuid(), '9988776644', 'TWO_WHEELER', 'TUBE', 'CEAT', 'Honda Activa', 'Koramangala', '560034', 'NEW')
ON CONFLICT DO NOTHING;

INSERT INTO leads (id, customer_mobile, vehicle_type, tyre_type, tyre_brand, vehicle_model, location_area, location_pincode, status, selected_dealer_id)
VALUES (gen_random_uuid(), '9988776633', 'FOUR_WHEELER', 'TUBELESS', 'Apollo', 'Hyundai Creta', 'Indiranagar', '560038', 'DEALER_SELECTED', 'd1000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Tyres Inventory
INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years)
VALUES (gen_random_uuid(), 'MRF', 'Zapper', '90/100-10', 1200.00, 'MRF-ZAP-001', 'Long lasting, Good grip', 'https://m.media-amazon.com/images/I/51p+fTzJcRL._AC_UF1000,1000_QL80_.jpg', 3)
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years)
VALUES (gen_random_uuid(), 'CEAT', 'Milaze', '145/80 R12', 2500.00, 'CEAT-MIL-002', 'Fuel efficient, Durable', 'https://m.media-amazon.com/images/I/51-u7w-DqCL._AC_UF1000,1000_QL80_.jpg', 5)
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years)
VALUES (gen_random_uuid(), 'Apollo', 'Amazer', '165/80 R14', 3200.00, 'APO-AMA-003', 'Comfortable ride, Low noise', 'https://m.media-amazon.com/images/I/61r-vj+jZPL._AC_UF1000,1000_QL80_.jpg', 5)
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years)
VALUES (gen_random_uuid(), 'JK Tyre', 'Taxi Max', '4.00-8', 1500.00, 'JK-TAX-004', 'Heavy Load, Long Life', 'https://m.media-amazon.com/images/I/51+9+8+7+6L._AC_UF1000,1000_QL80_.jpg', 2)
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO tyres (id, brand, pattern, size, price, product_code, features, image_url, warranty_years)
VALUES (gen_random_uuid(), 'Michelin', 'City Pro', '2.75-17', 1800.00, 'MICH-CIT-005', 'Puncture Resistant', 'https://m.media-amazon.com/images/I/71+9+8+7+6L._AC_UF1000,1000_QL80_.jpg', 4)
ON CONFLICT (product_code) DO NOTHING;

-- Vehicles Master Data
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '2W', 'Hero', 'Splendor Plus', 'Kick Start', '80/100-18') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '2W', 'Hero', 'HF Deluxe', 'Self Start', '2.75-18') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '2W', 'Honda', 'Activa 6G', 'Standard', '90/100-10') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '2W', 'Honda', 'Shine', 'Disc', '80/100-18') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '2W', 'Royal Enfield', 'Classic 350', 'Dual Channel ABS', '90/90-19') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '2W', 'TVS', 'Jupiter', 'Classic', '90/90-12') ON CONFLICT DO NOTHING;

INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '3W', 'Bajaj', 'RE Compact', 'CNG', '4.00-8') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '3W', 'Bajaj', 'Maxima', 'Diesel', '4.50-10') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '3W', 'Piaggio', 'Ape City', 'Petrol', '4.00-8') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '3W', 'Mahindra', 'Alfa', 'Passenger', '4.50-10') ON CONFLICT DO NOTHING;

INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '4W', 'Maruti Suzuki', 'Swift', 'LXi', '165/80 R14') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '4W', 'Maruti Suzuki', 'Baleno', 'Delta', '185/65 R15') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '4W', 'Hyundai', 'Creta', 'SX', '205/65 R16') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '4W', 'Hyundai', 'i20', 'Sportz', '195/55 R16') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '4W', 'Tata', 'Nexon', 'XZ', '215/60 R16') ON CONFLICT DO NOTHING;
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES (gen_random_uuid(), '4W', 'Mahindra', 'XUV700', 'AX5', '235/65 R17') ON CONFLICT DO NOTHING;
