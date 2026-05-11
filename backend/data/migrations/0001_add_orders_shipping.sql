-- Migration: add shipping columns to orders table if missing
ALTER TABLE orders
  ADD COLUMN
IF NOT EXISTS address VARCHAR
(255) NULL,
ADD COLUMN
IF NOT EXISTS phone VARCHAR
(30) NULL,
ADD COLUMN
IF NOT EXISTS note TEXT NULL;
