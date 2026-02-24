-- Seed Data for Vehicles Table

-- 4W (Four Wheeler)
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES
(gen_random_uuid(), '4W', 'Maruti Suzuki', 'Swift', 'LXI', '165/80 R14'),
(gen_random_uuid(), '4W', 'Maruti Suzuki', 'Swift', 'VXI', '185/65 R15'),
(gen_random_uuid(), '4W', 'Maruti Suzuki', 'Swift', 'ZXI', '185/65 R15'),
(gen_random_uuid(), '4W', 'Maruti Suzuki', 'Baleno', 'Sigma', '185/65 R15'),
(gen_random_uuid(), '4W', 'Maruti Suzuki', 'Baleno', 'Alpha', '195/55 R16'),
(gen_random_uuid(), '4W', 'Hyundai', 'Creta', 'E', '205/65 R16'),
(gen_random_uuid(), '4W', 'Hyundai', 'Creta', 'SX', '215/60 R17'),
(gen_random_uuid(), '4W', 'Hyundai', 'i20', 'Magna', '185/65 R15'),
(gen_random_uuid(), '4W', 'Hyundai', 'i20', 'Sportz', '195/55 R16'),
(gen_random_uuid(), '4W', 'Honda', 'City', 'V', '185/60 R15'),
(gen_random_uuid(), '4W', 'Honda', 'City', 'ZX', '185/55 R16'),
(gen_random_uuid(), '4W', 'Tata', 'Nexon', 'Smart', '195/60 R16'),
(gen_random_uuid(), '4W', 'Tata', 'Punch', 'Creative', '195/60 R16'),
(gen_random_uuid(), '4W', 'Mahindra', 'Thar', 'LX', '255/65 R18'),
(gen_random_uuid(), '4W', 'Mahindra', 'XUV700', 'AX7', '235/60 R18'),
(gen_random_uuid(), '4W', 'Toyota', 'Fortuner', '4x4 AT', '265/60 R18'),
(gen_random_uuid(), '4W', 'Toyota', 'Innova Crysta', 'ZX', '215/55 R17'),
(gen_random_uuid(), '4W', 'Kia', 'Seltos', 'GTX+', '215/60 R17');

-- 2W (Two Wheeler)
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES
(gen_random_uuid(), '2W', 'Hero', 'Splendor Plus', 'Standard', '80/100-18'),
(gen_random_uuid(), '2W', 'Honda', 'Activa 6G', 'Standard', '90/90-12'),
(gen_random_uuid(), '2W', 'TVS', 'Jupiter', 'Classic', '90/90-12'),
(gen_random_uuid(), '2W', 'Bajaj', 'Pulsar 150', 'Twin Disc', '90/90-17'),
(gen_random_uuid(), '2W', 'Royal Enfield', 'Classic 350', 'Signals', '100/90-19');

-- 3W (Three Wheeler)
INSERT INTO vehicles (id, type, make, model, variant, tyre_size) VALUES
(gen_random_uuid(), '3W', 'Bajaj', 'RE Compact', 'CNG', '4.00-8'),
(gen_random_uuid(), '3W', 'Piaggio', 'Ape City', 'Plus', '4.50-10'),
(gen_random_uuid(), '3W', 'Mahindra', 'Treo', 'Standard', '3.75-12');
