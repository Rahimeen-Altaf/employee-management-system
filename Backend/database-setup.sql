-- Employee Management System - Complete Database Setup Script
-- Run this script in PostgreSQL to set up the complete database structure

-- Create database (uncomment if you need to create the database)
-- CREATE DATABASE employee_management;
-- \c employee_management;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing ENUM types if they exist
DROP TYPE IF EXISTS enum_users_role CASCADE;
DROP TYPE IF EXISTS enum_employees_status CASCADE;

-- Create ENUM types
CREATE TYPE enum_users_role AS ENUM ('employee', 'admin');
CREATE TYPE enum_employees_status AS ENUM ('active', 'inactive', 'terminated');

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    role enum_users_role DEFAULT 'employee' NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_firstName_length CHECK (LENGTH("firstName") >= 2 AND LENGTH("firstName") <= 50),
    CONSTRAINT users_lastName_length CHECK (LENGTH("lastName") >= 2 AND LENGTH("lastName") <= 50),
    CONSTRAINT users_phone_length CHECK (LENGTH(phone) >= 10 AND LENGTH(phone) <= 15)
);

-- Create Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    "employeeId" VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    salary DECIMAL(10,2),
    "hireDate" DATE,
    address TEXT,
    "dateOfBirth" DATE,
    "emergencyContact" VARCHAR(255),
    "emergencyPhone" VARCHAR(255),
    status enum_employees_status DEFAULT 'active',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign key constraint
    CONSTRAINT fk_employees_userId FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Constraints
    CONSTRAINT employees_salary_positive CHECK (salary >= 0),
    CONSTRAINT employees_employeeId_not_empty CHECK ("employeeId" != ''),
    CONSTRAINT employees_department_not_empty CHECK (department IS NULL OR department != ''),
    CONSTRAINT employees_position_not_empty CHECK (position IS NULL OR position != '')
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_isActive ON users("isActive");
CREATE INDEX idx_employees_userId ON employees("userId");
CREATE INDEX idx_employees_employeeId ON employees("employeeId");
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_hireDate ON employees("hireDate");

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
-- Password is 'admin123' hashed with bcrypt (10 rounds)
INSERT INTO users ("firstName", "lastName", email, password, phone, role, "isActive", "createdAt", "updatedAt") 
VALUES (
    'Admin',
    'User',
    'admin@company.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '5551234567',
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data (optional - uncomment if you want sample data)
/*
-- Sample employee user
INSERT INTO users ("firstName", "lastName", email, password, phone, role, "isActive", "createdAt", "updatedAt") 
VALUES (
    'Sarah',
    'Chen',
    'sarah.chen@company.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
    '5551234567',
    'employee',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Sample employee profile (linked to Sarah Chen)
INSERT INTO employees ("employeeId", department, position, salary, "hireDate", address, "dateOfBirth", "emergencyContact", "emergencyPhone", status, "userId", "createdAt", "updatedAt")
VALUES (
    'EMP001',
    'Engineering',
    'Senior Software Developer',
    85000.00,
    '2023-03-15',
    '456 Oak Avenue, Seattle, WA 98101',
    '1992-08-14',
    'Michael Chen',
    '5559876543',
    'active',
    (SELECT id FROM users WHERE email = 'sarah.chen@company.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
*/

-- Verify the setup
SELECT 'Database setup completed successfully!' as message;
SELECT 'Users table created with ' || COUNT(*) || ' records' as users_status FROM users;
SELECT 'Employees table created with ' || COUNT(*) || ' records' as employees_status FROM employees;

-- Show admin user details
SELECT 
    'Admin user created:' as info,
    "firstName" || ' ' || "lastName" as name,
    email,
    'Password: admin123' as password_info,
    role
FROM users 
WHERE role = 'admin';

-- Display table information
\d+ users;
\d+ employees;

-- Show all indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('users', 'employees')
ORDER BY tablename, indexname;

COMMIT;