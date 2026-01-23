-- Add restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    city_slug VARCHAR(100),
    cuisine VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    price_range VARCHAR(50),
    image_url TEXT,
    eazydiner_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_city_slug ON restaurants(city_slug);
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);

-- Alter bills table to add restaurant_id
ALTER TABLE bills ADD COLUMN restaurant_id INTEGER REFERENCES restaurants(id);

-- Run this migration
-- psql -d code404 -U postgres -f migrations/002_add_restaurants.sql