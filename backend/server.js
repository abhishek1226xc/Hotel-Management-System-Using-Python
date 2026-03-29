require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ai_pricing_user',
  password: process.env.DB_PASSWORD || 'securepassword123',
  database: process.env.DB_NAME || 'ai_pricing',
  waitForConnections: true,
  connectionLimit: 10
});

// Middleware
app.use(cors({
  origin: ['http://localhost:8080']
}));
app.use(express.json());

// API Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calculate', async (req, res) => {
  const { productId } = req.body;
  
  try {
    // Get product
    const [product] = await pool.query(
      'SELECT * FROM products WHERE id = ?', 
      [productId]
    );
    
    if (!product.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    // AI calculation (simulated)
    const basePrice = product[0].base_price;
    const aiPrice = (basePrice * (0.8 + Math.random() * 0.2)).toFixed(2);
    const discount = ((basePrice - aiPrice) / basePrice * 100).toFixed(1);

    // Save calculation
    await pool.query(
      `INSERT INTO price_calculations 
       (product_id, base_price, ai_price, discount_percent)
       VALUES (?, ?, ?, ?)`,
      [productId, basePrice, aiPrice, discount]
    );

    res.json({
      name: product[0].name,
      basePrice,
      aiPrice,
      discount: discount + '%',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});