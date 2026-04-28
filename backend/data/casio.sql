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
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  gender ENUM('men','women','unisex') NOT NULL,
  brand VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NULL,
  image_url VARCHAR(255) NULL,   -- thêm dòng này
  stock INT NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brand (brand),
  INDEX idx_price (price),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_gender (gender)
);

DELETE FROM products;

ALTER TABLE products AUTO_INCREMENT = 1;

INSERT INTO products (name, category, gender, brand, price, image_url, stock)
VALUES

-- ================= G-SHOCK =================
('Casio G-Shock DW-5600WS-1DR', 'G-Shock', 'unisex', 'Casio', 2500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777116791/Casio_G-Shock_DW-5600WS-1DR.jpg', 10),
('Casio G-SHOCK GST-B500D-1A1DR', 'G-Shock', 'men', 'Casio', 8500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/Casio_G-SHOCK_GST-B500D-1A1DR_lqcsvd.jpg', 8),
('G-Shock GMA-S2100MD-4ADR', 'G-Shock', 'women', 'Casio', 4200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/G-Shock_GMA-S2100MD-4ADR_fa0uc5.jpg', 12),
('Casio G-Shock GA-900A-1A9DR', 'G-Shock', 'men', 'Casio', 3900000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/Casio_G-Shock_GA-900A-1A9DR_dbdxn0.jpg', 7),
('G-Shock GMA-S2100MD-7ADR', 'G-Shock', 'women', 'Casio', 4100000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/G-Shock_GMA-S2100MD-7ADR_jgxxqv.jpg', 9),
('Casio G-Shock GM-5600-1DR', 'G-Shock', 'men', 'Casio', 6000000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/Casio_G-Shock_GM-5600-1DR_zhs4nq.jpg', 6),
('Casio G-Shock GA-2100-4ADR', 'G-Shock', 'unisex', 'Casio', 3500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/Casio_G-Shock_GA-2100-4ADR_vfhowy.jpg', 15),
('Casio G-Shock GA-2000-2ADR', 'G-Shock', 'men', 'Casio', 3700000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117416/Casio_G-Shock_GA-2000-2ADR_se91aa.jpg', 10),
('Casio G-Shock GA-100A-9AHDR', 'G-Shock', 'men', 'Casio', 3300000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117415/Casio_G-Shock_GA-100A-9AHDR_zqfp3n.jpg', 11),
('Casio G-Shock DW-6900NB-7DR', 'G-Shock', 'unisex', 'Casio', 2900000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777118638/Casio%20G-Shock%20DW-6900NB-7DR.png', 10),

-- ================= EDIFICE =================
('Casio Edifice EQB-1200AT-1ADR', 'Edifice', 'men', 'Casio', 12500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117703/Casio_Edifice_EQB-1200AT-1ADR_zqrfgf.png', 5),
('Casio Edifice EFV-650D-3AVUDF', 'Edifice', 'men', 'Casio', 3200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117702/Casio_Edifice_EFV-650D-3AVUDF_ekhobu.jpg', 10),
('Casio Edifice EFV-100L-7AVUDF', 'Edifice', 'men', 'Casio', 2800000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117701/Casio_Edifice_EFV-100L-7AVUDF_lm02cs.jpg', 12),
('Casio Edifice EFV-610SG-5AVUDF', 'Edifice', 'men', 'Casio', 4500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117701/Casio_Edifice_EFV-610SG-5AVUDF_bwjhug.jpg', 7),
('Casio Edifice EFV-600D-2AVUDF', 'Edifice', 'men', 'Casio', 3500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117701/Casio_Edifice_EFV-600D-2AVUDF_i3f1g4.jpg', 9),
('Casio Edifice EFV-120DB-1AVUDF', 'Edifice', 'men', 'Casio', 3000000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117700/Casio_Edifice_EFV-120DB-1AVUDF_haxxn9.jpg', 11),
('Casio Edifice EFR-574D-2AVUDF', 'Edifice', 'men', 'Casio', 3700000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117700/Casio_Edifice_EFR-574D-2AVUDF_tzjdl6.jpg', 8),
('Casio Edifice ECB-10DB-1BDF', 'Edifice', 'men', 'Casio', 6200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117699/Casio_Edifice_ECB-10DB-1BDF_jhgycx.jpg', 6),
('Casio Edifice EFB-710D-7AVUDF', 'Edifice', 'men', 'Casio', 5800000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117699/Casio_Edifice_EFB-710D-7AVUDF_onnsau.jpg', 5),
('Casio Edifice ECB-10DC-1ADF', 'Edifice', 'men', 'Casio', 6400000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117699/Casio_Edifice_ECB-10DC-1ADF_eldxii.jpg', 4),

-- ================= CLASSIC =================
('Casio MTP-1375L-7AVDF', 'Classic', 'men', 'Casio', 1800000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117969/Casio_MTP-1375L-7AVDF_wiwh8n.jpg', 15),
('Casio MDV-10D-1A1VDF', 'Classic', 'men', 'Casio', 2200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117968/Casio_MDV-10D-1A1VDF_sx7vow.jpg', 12),
('Casio MTP-VT01L-7B2UDF', 'Classic', 'men', 'Casio', 1200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777118824/Casio%20MTP-VT01L-7B2UDF.jpg', 15),
('Casio MTP-VT01GL-1B2', 'Classic', 'men', 'Casio', 1300000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777118980/CASIO%20MTP-VT01GL-1B2.jpg', 12),
('Casio LTP-VT01GL-9B', 'Classic', 'women', 'Casio', 1200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777118979/Casio%20LTP-VT01GL-9B_Seq1_kudlus.jpg', 14),

-- ================= G-SQUAD =================
('Casio G-SQUAD BSA-B100-4A1DR', 'G-SQUAD', 'women', 'Casio', 3500000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117874/Casio_G-SQUAD_BSA-B100-4A1DR_ydvx9w.jpg', 10),
('Casio G-SQUAD GBD-200-1DR', 'G-SQUAD', 'men', 'Casio', 4800000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777119314/Casio%20G-SQUAD%20GBD-200-1DR.png', 8),

-- ================= BABY-G =================
('Casio Baby-G BSA-B100MF-7ADR', 'Baby-G', 'women', 'Casio', 3200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117874/Casio_Baby-G_BSA-B100MF-7ADR_gsfbmc.jpg', 9),
('Casio Baby-G BSA-B100MF-1ADR', 'Baby-G', 'women', 'Casio', 3200000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117873/Casio_Baby-G_BSA-B100MF-1ADR_mhil1t.jpg', 9),
('Casio Baby-G BSA-B100AC-2ADR', 'Baby-G', 'women', 'Casio', 3300000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117873/Casio_Baby-G_BSA-B100AC-2ADR_pab4qz.jpg', 8),
('Casio Baby-G BSA-B100-2ADR', 'Baby-G', 'women', 'Casio', 3100000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117872/Casio_Baby-G_BSA-B100-2ADR_j9g76u.jpg', 10),
('Casio Baby-G BSA-B100-4A2D', 'Baby-G', 'women', 'Casio', 3100000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117872/Casio_Baby-G_BSA-B100-4A2D_ojlye6.jpg', 10),
('Casio Baby-G BSA-B100-1ADR', 'Baby-G', 'women', 'Casio', 3000000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117871/Casio_Baby-G_BSA-B100-1ADR_txlqyq.jpg', 11),
('Casio Baby-G BGD-570THB-7DR', 'Baby-G', 'women', 'Casio', 2800000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117871/Casio_Baby-G_BGD-570THB-7DR_zcl2ze.jpg', 7),
('Casio Baby-G BGD-560THB-7DR', 'Baby-G', 'women', 'Casio', 2700000, 'https://res.cloudinary.com/dba2jwxfs/image/upload/v1777117870/Casio_Baby-G_BGD-560THB-7DR_lrbdtr.jpg', 6);



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

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_note VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS payment_qr_content TEXT NULL,
  ADD COLUMN IF NOT EXISTS paid_at DATETIME NULL;

