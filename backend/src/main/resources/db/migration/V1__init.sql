
CREATE TYPE vehicle_category AS ENUM ('TWO_WHEELER', 'THREE_WHEELER', 'FOUR_WHEELER');
CREATE TYPE otp_category AS ENUM ('REGISTRATION', 'LOGIN', 'PASSWORD_RESET');
CREATE TYPE request_category AS ENUM ('SELL', 'BUY');
CREATE TYPE request_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');


CREATE CAST (varchar AS vehicle_category) WITH INOUT AS IMPLICIT;
CREATE CAST (varchar AS otp_category) WITH INOUT AS IMPLICIT;
CREATE CAST (varchar AS request_category) WITH INOUT AS IMPLICIT;
CREATE CAST (varchar AS request_status) WITH INOUT AS IMPLICIT;
CREATE TYPE lead_status AS ENUM ('NEW', 'VERIFIED', 'OFFER_RECEIVED', 'DEALER_SELECTED', 'CLOSED');

CREATE CAST (varchar AS lead_status) WITH INOUT AS IMPLICIT;

-- Users Table (Customers)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100),
    password VARCHAR(255),
    pincode VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(100),
    google_id VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Serviceable Locations
CREATE TABLE serviceable_locations (
    id UUID PRIMARY KEY,
    pincode VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Unified OTPs Table
CREATE TABLE otps (
    id UUID PRIMARY KEY,
    mobile VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    otp_type otp_category NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    attempts INTEGER NOT NULL DEFAULT 0
);

-- Dealers Table
CREATE TABLE dealers (
    id UUID PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) NOT NULL UNIQUE,
    alternate_phone_number VARCHAR(255),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    zip_code VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dealer_open_days (
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    open_day VARCHAR(255) NOT NULL,
    PRIMARY KEY (dealer_id, open_day)
);

-- Leads Table (Tyre Requirements)
CREATE TABLE leads (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    customer_mobile VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    tyre_type VARCHAR(50) NOT NULL,
    tyre_brand VARCHAR(100),
    vehicle_model VARCHAR(255) NOT NULL,
    location_area VARCHAR(255),
    location_pincode VARCHAR(20),
    status lead_status NOT NULL DEFAULT 'NEW',
    selected_dealer_id UUID REFERENCES dealers(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP
);

-- Offers Table
CREATE TABLE offers (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    tyre_condition VARCHAR(100) NOT NULL,
    stock_available BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offer_images (
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL
);

CREATE TABLE lead_skips (
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    PRIMARY KEY (lead_id, dealer_id)
);

-- Recharge Packages
CREATE TABLE recharge_packages (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_in_inr INTEGER NOT NULL,
    base_credits INTEGER NOT NULL,
    bonus_credits INTEGER NOT NULL,
    popular BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    dealer_id UUID NOT NULL UNIQUE REFERENCES dealers(id) ON DELETE CASCADE,
    purchased_credits INTEGER NOT NULL DEFAULT 0,
    bonus_credits INTEGER NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    type VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL,
    purchased_credits INTEGER NOT NULL DEFAULT 0,
    bonus_credits INTEGER NOT NULL DEFAULT 0,
    description VARCHAR(255),
    payment_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_payment_id ON transactions(payment_id);

-- Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_dealers_upd BEFORE UPDATE ON dealers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_wallets_upd BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_otp_lookup ON otps(mobile, code);
CREATE INDEX idx_leads_status ON leads(status);

-- Vehicles Master Data
CREATE TABLE vehicles (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(100) NOT NULL,
    tyre_size VARCHAR(50) NOT NULL
);

-- User Garage
CREATE TABLE user_vehicles (
    id UUID PRIMARY KEY,
    dealer_id UUID NOT NULL,
    vehicle_name VARCHAR(100),
    registration_number VARCHAR(50),
    tyre_size VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    make VARCHAR(100),
    model VARCHAR(100),
    variant VARCHAR(100)
);

-- Tyres
CREATE TABLE tyres (
    id UUID PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    pattern VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    product_code VARCHAR(100) UNIQUE,
    features TEXT,
    image_url VARCHAR(255),
    warranty_years INTEGER
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    dealer_id UUID NOT NULL,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    order_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount DOUBLE PRECISION
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    tyre_id UUID,
    tyre_name VARCHAR(255),
    quantity INTEGER,
    unit_price DOUBLE PRECISION,
    total_price DOUBLE PRECISION
);

-- Quote Requests
CREATE TABLE quote_requests (
    id UUID PRIMARY KEY,
    dealer_id UUID NOT NULL,
    request_number VARCHAR(100) UNIQUE,
    request_date TIMESTAMP,
    status VARCHAR(50),
    details TEXT,
    vehicle_id UUID,
    tyre_id UUID
);

-- Sell Requests
CREATE TABLE sell_requests (
    id UUID PRIMARY KEY,
    dealer_id UUID NOT NULL,
    request_number VARCHAR(100) UNIQUE,
    request_date TIMESTAMP,
    status VARCHAR(50),
    tyre_brand VARCHAR(100),
    tyre_size VARCHAR(50),
    tyre_pattern VARCHAR(100),
    condition VARCHAR(50),
    quantity INTEGER,
    expected_price DOUBLE PRECISION,
    image_urls TEXT,
    vehicle_type VARCHAR(50),
    tyre_age VARCHAR(50),
    km_driven INTEGER,
    pickup_date VARCHAR(50),
    pickup_time_slot VARCHAR(50),
    mobile VARCHAR(20)
);
