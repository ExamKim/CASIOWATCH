-- Chọn database thủ công nếu lệnh USE casio bị lỗi quyền
USE casio;

-- 1. Tạo bảng users
CREATE TABLE
IF NOT EXISTS users
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR
(50) NOT NULL,
  email VARCHAR
(120) NOT NULL UNIQUE,
  password_hash VARCHAR
(255) NOT NULL,
  role ENUM
('admin','user') NOT NULL DEFAULT 'user',
  phone VARCHAR
(30) NULL,
  address VARCHAR
(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng products
CREATE TABLE
IF NOT EXISTS products
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR
(255) NOT NULL,
  category VARCHAR
(100) NOT NULL,
  gender ENUM
('men','women','unisex') NOT NULL,
  brand VARCHAR
(100) NULL,
  price DECIMAL
(10,2) NOT NULL,
  sale_price DECIMAL
(10,2) NULL,
  stock INT NOT NULL DEFAULT 0,
  status ENUM
('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brand (brand),
  INDEX idx_price (price),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_gender (gender)
);


INSERT INTO products
  (name, category, gender, brand, price, sale_price, stock, status)
VALUES
  ('Casio G-Shock DW-5600', 'digital', 'men', 'G-SHOCK', 99.99, 79.99, 50, 'active'),
  ('Casio G-Shock GA-2100', 'analog-digital', 'men', 'G-SHOCK', 120.00, NULL, 35, 'active'),
  ('Casio Vintage A168', 'digital', 'unisex', 'CASIO', 39.99, 29.99, 100, 'active'),
  ('Casio F-91W', 'digital', 'unisex', 'CASIO', 19.99, NULL, 200, 'active'),
  ('Casio Edifice EFV-100', 'analog', 'men', 'EDIFICE', 89.99, NULL, 25, 'active'),
  ('Casio Sheen SHE-4050', 'analog', 'women', 'SHEEN', 110.00, 95.00, 15, 'active'),
  ('Casio Pro Trek PRG-270', 'digital', 'men', 'PRO TREK', 180.00, 150.00, 12, 'active'),
  ('Casio Baby-G BA-110', 'analog-digital', 'women', 'BABY-G', 105.00, NULL, 20, 'active'),
  ('Casio Edifice ECB-10', 'analog-digital', 'men', 'EDIFICE', 160.00, 140.00, 10, 'inactive'),
  ('Casio Vintage LA670', 'digital', 'women', 'CASIO', 29.99, NULL, 60, 'active');


USE casio;

UPDATE products SET image_url = '/images/dw-5600.jpg'
WHERE name = 'Casio G-Shock DW-5600';

UPDATE products SET image_url = '/images/ga-2100.jpg'
WHERE name = 'Casio G-Shock GA-2100';

UPDATE products SET image_url = '/images/a168.jpg'
WHERE name = 'Casio Vintage A168';

UPDATE products SET image_url = '/images/f-91w.jpg'
WHERE name = 'Casio F-91W';

UPDATE products SET image_url = '/images/efv-100.jpg'
WHERE name = 'Casio Edifice EFV-100';

UPDATE products SET image_url = '/images/she-4050.jpg'
WHERE name = 'Casio Sheen SHE-4050';

UPDATE products SET image_url = '/images/prg-270.jpg'
WHERE name = 'Casio Pro Trek PRG-270';

UPDATE products SET image_url = '/images/ba-110.jpg'
WHERE name = 'Casio Baby-G BA-110';

UPDATE products SET image_url = '/images/ecb-10.jpg'
WHERE name = 'Casio Edifice ECB-10';

UPDATE products SET image_url = '/images/la670.jpg'
WHERE name = 'Casio Vintage LA670';

CREATE TABLE 
IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id)
);

CREATE TABLE 
IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 
IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  name VARCHAR(255),
  price DECIMAL(10,2),
  quantity INT
);





