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

INSERT INTO products
  (name, category, gender, brand, price, sale_price, stock, status)
VALUES
  ('G-SHOCK GA-100CF-1A', 'analog-digital', 'men', 'G-SHOCK', 4200000.00, 3890000.00, 45, 'active'),
  ('G-SHOCK GA-2100-1A1', 'analog-digital', 'men', 'G-SHOCK', 4900000.00, 4590000.00, 38, 'active'),
  ('G-SHOCK DW-5600BB-1DR', 'digital', 'men', 'G-SHOCK', 3600000.00, 3290000.00, 30, 'active'),
  ('G-SHOCK GST-B400D-1A', 'analog-digital', 'men', 'G-SHOCK', 8600000.00, 7990000.00, 22, 'active'),
  ('EDIFICE EFR-526L-1AV', 'chronograph', 'men', 'EDIFICE', 4650000.00, 4290000.00, 24, 'active'),
  ('EDIFICE EFS-S570DB-1A', 'chronograph', 'men', 'EDIFICE', 6350000.00, 5980000.00, 20, 'active'),
  ('EDIFICE ECB-2000DC-1A', 'analog-digital', 'men', 'EDIFICE', 9500000.00, 8990000.00, 16, 'active'),
  ('CASIO MTP-1374D-1AV', 'analog', 'men', 'CASIO', 1850000.00, 1690000.00, 56, 'active'),
  ('CASIO MTP-V300D-1AU', 'analog', 'men', 'CASIO', 1980000.00, 1790000.00, 48, 'active'),
  ('CASIO LTP-V300L-7AU', 'analog', 'women', 'CASIO', 1650000.00, 1490000.00, 52, 'active'),
  ('CASIO A168WEM-7DF', 'digital', 'unisex', 'CASIO', 1500000.00, 1390000.00, 80, 'active'),
  ('CASIO AQ-230A-7DMQ', 'analog-digital', 'unisex', 'CASIO', 1750000.00, NULL, 62, 'active'),
  ('BABY-G BA-110XRG-1A', 'analog-digital', 'women', 'BABY-G', 4200000.00, 3950000.00, 26, 'active'),
  ('BABY-G BGA-250-7A2', 'analog-digital', 'women', 'BABY-G', 3900000.00, 3590000.00, 28, 'active'),
  ('SHEEN SHE-3060SPG-7A', 'analog', 'women', 'SHEEN', 5200000.00, 4890000.00, 18, 'active'),
  ('SHEEN SHE-4539M-7AU', 'analog', 'women', 'SHEEN', 4680000.00, 4390000.00, 20, 'active'),
  ('PRO TREK PRG-340-1DR', 'digital', 'men', 'PRO TREK', 7600000.00, 7190000.00, 14, 'active'),
  ('PRO TREK PRT-B70-5DR', 'digital', 'men', 'PRO TREK', 6900000.00, 6490000.00, 12, 'active');

INSERT INTO products
  (name, category, gender, brand, price, sale_price, stock, status)
VALUES
  ('G-SHOCK GA-700-1BDR', 'analog-digital', 'men', 'G-SHOCK', 4350000.00, 4050000.00, 34, 'active'),
  ('G-SHOCK GA-B2100-1ADR', 'analog-digital', 'men', 'G-SHOCK', 6200000.00, 5890000.00, 28, 'active'),
  ('G-SHOCK GBD-200-1DR', 'digital', 'unisex', 'G-SHOCK', 5600000.00, 5290000.00, 25, 'active'),
  ('G-SHOCK GM-110G-1A9DR', 'analog-digital', 'men', 'G-SHOCK', 7800000.00, 7390000.00, 18, 'active'),
  ('EDIFICE EFV-640D-1AV', 'chronograph', 'men', 'EDIFICE', 4980000.00, 4690000.00, 22, 'active'),
  ('EDIFICE EFS-S510D-2AV', 'chronograph', 'men', 'EDIFICE', 6850000.00, 6490000.00, 20, 'active'),
  ('EDIFICE ERA-120DB-1AV', 'analog-digital', 'men', 'EDIFICE', 5450000.00, NULL, 16, 'active'),
  ('CASIO MTP-VD03D-2AU', 'analog', 'men', 'CASIO', 1580000.00, 1450000.00, 60, 'active'),
  ('CASIO MTP-1302D-1A1V', 'analog', 'men', 'CASIO', 1990000.00, 1850000.00, 54, 'active'),
  ('CASIO LTP-1183A-7A', 'analog', 'women', 'CASIO', 1420000.00, 1290000.00, 58, 'active'),
  ('CASIO LA680WGA-9DF', 'digital', 'women', 'CASIO', 1680000.00, 1550000.00, 46, 'active'),
  ('CASIO B640WB-1ADF', 'digital', 'unisex', 'CASIO', 1890000.00, 1750000.00, 40, 'active'),
  ('BABY-G BGA-280-4A2DR', 'analog-digital', 'women', 'BABY-G', 3650000.00, 3390000.00, 24, 'active'),
  ('BABY-G BA-130-7A1DR', 'analog-digital', 'women', 'BABY-G', 4450000.00, 4150000.00, 20, 'active'),
  ('SHEEN SHE-4540CGM-4AU', 'analog', 'women', 'SHEEN', 5550000.00, 5190000.00, 14, 'active'),
  ('SHEEN SHE-4554PG-4AU', 'analog', 'women', 'SHEEN', 5980000.00, 5620000.00, 12, 'active'),
  ('PRO TREK PRW-35Y-3DR', 'digital', 'men', 'PRO TREK', 9800000.00, 9390000.00, 10, 'active'),
  ('PRO TREK PRG-30-2DR', 'digital', 'unisex', 'PRO TREK', 6250000.00, 5890000.00, 13, 'active'),
  ('G-SHOCK DW-6900RGB-1DR', 'digital', 'men', 'G-SHOCK', 4050000.00, 3750000.00, 26, 'active'),
  ('CASIO AE-1200WHD-1AV', 'digital', 'unisex', 'CASIO', 1650000.00, 1490000.00, 72, 'active');

INSERT INTO products
  (name, category, gender, brand, price, sale_price, stock, status)
VALUES
  ('G-SHOCK GA-2200M-1ADR', 'analog-digital', 'men', 'G-SHOCK', 5100000.00, 4780000.00, 29, 'active'),
  ('G-SHOCK GMA-S2100-1ADR', 'analog-digital', 'women', 'G-SHOCK', 4700000.00, 4380000.00, 32, 'active'),
  ('G-SHOCK DW-5900TS-1DR', 'digital', 'men', 'G-SHOCK', 3950000.00, 3620000.00, 25, 'active'),
  ('G-SHOCK MTG-B3000D-1A', 'analog-digital', 'men', 'G-SHOCK', 26500000.00, 24900000.00, 8, 'active'),
  ('EDIFICE EFR-571D-1AV', 'chronograph', 'men', 'EDIFICE', 5480000.00, 5190000.00, 18, 'active'),
  ('EDIFICE EFV-C120D-1A', 'analog-digital', 'men', 'EDIFICE', 5250000.00, 4890000.00, 19, 'active'),
  ('EDIFICE EFR-S108D-1AV', 'analog', 'men', 'EDIFICE', 4550000.00, 4250000.00, 23, 'active'),
  ('EDIFICE ECB-900DB-1A', 'analog-digital', 'men', 'EDIFICE', 10300000.00, 9750000.00, 11, 'active'),
  ('CASIO MTP-1381L-7AV', 'analog', 'men', 'CASIO', 1820000.00, 1690000.00, 42, 'active'),
  ('CASIO MTP-1314D-1AV', 'analog', 'men', 'CASIO', 1760000.00, 1620000.00, 47, 'active'),
  ('CASIO A700W-1ADF', 'digital', 'unisex', 'CASIO', 1320000.00, 1190000.00, 68, 'active'),
  ('CASIO LF-20W-8ADF', 'digital', 'unisex', 'CASIO', 1450000.00, 1320000.00, 64, 'active'),
  ('CASIO LTP-1234DD-7A', 'analog', 'women', 'CASIO', 1590000.00, 1450000.00, 44, 'active'),
  ('CASIO LTP-E175D-7AV', 'analog', 'women', 'CASIO', 1680000.00, 1540000.00, 40, 'active'),
  ('BABY-G BGA-290-5ADR', 'analog-digital', 'women', 'BABY-G', 3980000.00, 3650000.00, 22, 'active'),
  ('BABY-G BGD-565SC-3DR', 'digital', 'women', 'BABY-G', 3480000.00, 3250000.00, 28, 'active'),
  ('BABY-G BA-130SP-7ADR', 'analog-digital', 'women', 'BABY-G', 4620000.00, 4290000.00, 19, 'active'),
  ('SHEEN SHE-4559D-7AU', 'analog', 'women', 'SHEEN', 5350000.00, 4990000.00, 13, 'active'),
  ('SHEEN SHE-3059PGL-7A', 'analog', 'women', 'SHEEN', 5750000.00, 5390000.00, 12, 'active'),
  ('SHEEN SHE-4543CG-4A', 'analog', 'women', 'SHEEN', 6120000.00, 5790000.00, 9, 'active'),
  ('PRO TREK PRG-601YB-2DR', 'digital', 'men', 'PRO TREK', 12200000.00, 11500000.00, 8, 'active'),
  ('PRO TREK PRT-B50-1DR', 'digital', 'men', 'PRO TREK', 7150000.00, 6790000.00, 14, 'active'),
  ('PRO TREK PRW-61Y-1B', 'digital', 'men', 'PRO TREK', 14500000.00, 13800000.00, 7, 'active'),
  ('CASIO AQ-S810W-1AV', 'analog-digital', 'men', 'CASIO', 2190000.00, 1990000.00, 38, 'active');


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





