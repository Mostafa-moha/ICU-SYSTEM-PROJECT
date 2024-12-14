-- Step 1: Database Schema Design

-- Create the patients table
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(50) NOT NULL,
    condition VARCHAR(255),
    location_latitude FLOAT NOT NULL,
    location_longitude FLOAT NOT NULL,
    contact_number VARCHAR(15),
    password VARCHAR(255) NOT NULL -- Store encrypted password
);

-- Create the hospitals table
CREATE TABLE hospitals (
    hospital_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    contact_number VARCHAR(15) NOT NULL
);

-- Create the ICU rooms table
CREATE TABLE icu_rooms (
    room_id SERIAL PRIMARY KEY,
    hospital_id INT NOT NULL REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    occupancy_status BOOLEAN DEFAULT FALSE, -- false = not occupied
    monitoring_equipment_status VARCHAR(255) DEFAULT 'Good',
    patient_id INT REFERENCES patients(patient_id) ON DELETE SET NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the reservations table
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    room_id INT NOT NULL REFERENCES icu_rooms(room_id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending' -- Possible values: Pending, Confirmed, Cancelled
);

-- Create the users table for SuperAdmin and Admin roles
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role VARCHAR(50) CHECK (role IN ('SuperAdmin', 'Admin')) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store encrypted password
    phone_number VARCHAR(15),
    hospital_id INT REFERENCES hospitals(hospital_id) ON DELETE SET NULL -- Only for Admin role
);

-- Indexes for faster querying
CREATE INDEX idx_patients_location ON patients (location_latitude, location_longitude);
CREATE INDEX idx_hospitals_location ON hospitals (latitude, longitude);
