-- Fix: Remove duplicate migration record from database
-- Run this in phpMyAdmin or MySQL command line

-- Select your database first
USE devpass_db;

-- Remove the duplicate migration record
DELETE FROM migrations 
WHERE migration = '2025_11_23_042314_create_device_scans_table';

-- Verify it's gone (optional - check the result)
SELECT * FROM migrations WHERE migration LIKE '%device_scans%';

-- You should only see: 2025_11_21_222542_create_device_scans_table

