-- Enhanced with calculation history
CREATE TABLE IF NOT EXISTS price_calculations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  ai_price DECIMAL(10,2) NOT NULL,
  discount_percent DECIMAL(5,2) NOT NULL,
  calculation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- New feature matrix column
ALTER TABLE products ADD COLUMN features JSON DEFAULT NULL;

-- Sample feature data
UPDATE products SET features = JSON_MERGE_PRESERVE(
  JSON_OBJECT(
    'ai_capabilities', 
    CASE 
      WHEN name LIKE '%Pro%' THEN 'Advanced'
      WHEN name LIKE '%Enterprise%' THEN 'Premium' 
      ELSE 'Basic'
    END,
    'api_access',
    CASE 
      WHEN name LIKE '%Enterprise%' THEN TRUE
      ELSE FALSE
    END
  ),
  JSON_OBJECT(
    'support_level',
    CASE
      WHEN base_price > 100 THEN '24/7'
      ELSE 'Business hours'
    END
  )
);