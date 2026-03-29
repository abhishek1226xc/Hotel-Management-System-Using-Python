#!/bin/bash

# Beyond Booking 2.0 Project Setup Script
# This script creates the entire project structure for the Beyond Booking hotel management system

echo "Setting up Beyond Booking 2.0 project structure..."

# Create root project directory
mkdir -p Beyond-Booking-2.0
cd Beyond-Booking-2.0

# Create README and other root files
echo "# Beyond Booking 2.0: BST in Hotel Management" > README.md
echo "node_modules/" > .gitignore
echo "{}" > package.json

# Frontend structure
mkdir -p frontend/public frontend/src/{components,pages,services,store,styles,utils}
mkdir -p frontend/src/components/{dashboard,booking,guest,common}
mkdir -p frontend/src/store/{reducers,actions}

# Create basic frontend files
echo "/* Tailwind CSS imports and custom styles */" > frontend/src/styles/index.css
echo "import React from 'react';" > frontend/src/index.js
echo "module.exports = { content: ['./src/**/*.{js,jsx}'], theme: {}, plugins: [] }" > frontend/tailwind.config.js
echo "{\"name\": \"beyond-booking-frontend\", \"version\": \"1.0.0\"}" > frontend/package.json

# Backend structure
mkdir -p backend/{src,config,tests}
mkdir -p backend/src/{api,services,models,utils,middleware}
mkdir -p backend/src/models/bst
mkdir -p backend/src/api/routes

# Create backend service files
touch backend/src/services/{roomService.js,bookingService.js,pricingService.js,recommendationService.js,maintenanceService.js}

# Create BST implementation files
cat > backend/src/models/bst/BSTNode.js << EOF
/**
 * Binary Search Tree Node implementation
 * for Beyond Booking Hotel Management System
 */
class BSTNode {
  constructor(key, value = null) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // Used for AVL tree balancing
  }
}

module.exports = BSTNode;
EOF

cat > backend/src/models/bst/BinarySearchTree.js << EOF
/**
 * Binary Search Tree implementation
 * for Beyond Booking Hotel Management System
 */
const BSTNode = require('./BSTNode');

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(key, value) {
    this.root = this._insertNode(this.root, key, value);
    return this;
  }
  
  _insertNode(node, key, value) {
    if (!node) {
      return new BSTNode(key, value);
    }
    
    if (key < node.key) {
      node.left = this._insertNode(node.left, key, value);
    } else if (key > node.key) {
      node.right = this._insertNode(node.right, key, value);
    } else {
      // Update value if key already exists
      node.value = value;
    }
    
    return node;
  }
  
  search(key) {
    return this._searchNode(this.root, key);
  }
  
  _searchNode(node, key) {
    if (!node) return null;
    
    if (key === node.key) {
      return node.value;
    }
    
    if (key < node.key) {
      return this._searchNode(node.left, key);
    }
    
    return this._searchNode(node.right, key);
  }
  
  // Additional methods would be implemented here
}

module.exports = BinarySearchTree;
EOF

cat > backend/src/models/bst/AVLTree.js << EOF
/**
 * AVL Tree implementation (self-balancing BST)
 * for Beyond Booking Hotel Management System
 */
const BSTNode = require('./BSTNode');

class AVLTree {
  constructor() {
    this.root = null;
  }
  
  // Helper method to get height of a node
  height(node) {
    return node ? node.height : 0;
  }
  
  // Helper method to get balance factor of a node
  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }
  
  // Right rotation
  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    
    return x;
  }
  
  // Left rotation
  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    
    return y;
  }
  
  // Insert a node
  insert(key, value) {
    this.root = this._insertNode(this.root, key, value);
    return this;
  }
  
  _insertNode(node, key, value) {
    // Standard BST insert
    if (!node) {
      return new BSTNode(key, value);
    }
    
    if (key < node.key) {
      node.left = this._insertNode(node.left, key, value);
    } else if (key > node.key) {
      node.right = this._insertNode(node.right, key, value);
    } else {
      // Update value if key already exists
      node.value = value;
      return node;
    }
    
    // Update height
    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
    
    // Get balance factor
    const balance = this.balanceFactor(node);
    
    // Left Left Case
    if (balance > 1 && key < node.left.key) {
      return this.rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && key > node.right.key) {
      return this.leftRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && key > node.left.key) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && key < node.right.key) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    
    return node;
  }
  
  // Additional methods would be implemented here
}

module.exports = AVLTree;
EOF

cat > backend/src/models/bst/MultiDimensionalBST.js << EOF
/**
 * Multi-Dimensional BST for complex hotel room queries
 * Allows searching based on multiple attributes (price, capacity, etc.)
 */
const AVLTree = require('./AVLTree');

class MultiDimensionalBST {
  constructor(dimensions) {
    this.dimensions = dimensions; // Array of attribute names to index
    this.trees = {};
    
    // Create a separate tree for each dimension
    for (const dim of dimensions) {
      this.trees[dim] = new AVLTree();
    }
  }
  
  /**
   * Insert an item with multiple attributes
   * @param {Object} item - The item to insert with properties matching dimensions
   * @param {string} id - Unique identifier for the item
   */
  insert(item, id) {
    for (const dim of this.dimensions) {
      if (item[dim] !== undefined) {
        // Store references to the original item in each tree
        this.trees[dim].insert(item[dim], { id, item });
      }
    }
    return this;
  }
  
  /**
   * Find items within a range for a specific dimension
   * @param {string} dimension - The dimension to search on
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {Array} - Array of matching items
   */
  rangeQuery(dimension, min, max) {
    if (!this.trees[dimension]) {
      throw new Error(\`Dimension \${dimension} not indexed\`);
    }
    
    const results = new Set();
    this._rangeSearch(this.trees[dimension].root, min, max, results);
    
    return Array.from(results).map(result => result.item);
  }
  
  _rangeSearch(node, min, max, results) {
    if (!node) return;
    
    // If current node is in range, add to results
    if (node.key >= min && node.key <= max) {
      results.add(node.value);
    }
    
    // If min is less than current key, search left subtree
    if (min < node.key) {
      this._rangeSearch(node.left, min, max, results);
    }
    
    // If max is greater than current key, search right subtree
    if (max > node.key) {
      this._rangeSearch(node.right, min, max, results);
    }
  }
  
  // Additional methods for complex queries would be implemented here
}

module.exports = MultiDimensionalBST;
EOF

# Create API route files
touch backend/src/api/routes/{bookingRoutes.js,roomRoutes.js,guestRoutes.js,adminRoutes.js,maintenanceRoutes.js}

# Create basic backend config
echo "{\"name\": \"beyond-booking-backend\", \"version\": \"1.0.0\"}" > backend/package.json
echo "PORT=4000\nDB_CONNECTION_STRING=postgresql://postgres:password@localhost:5432/beyond_booking" > backend/.env.example

# Create app.js
cat > backend/src/app.js << EOF
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const bookingRoutes = require('./api/routes/bookingRoutes');
const roomRoutes = require('./api/routes/roomRoutes');
const guestRoutes = require('./api/routes/guestRoutes');
const adminRoutes = require('./api/routes/adminRoutes');
const maintenanceRoutes = require('./api/routes/maintenanceRoutes');

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
EOF

# Create server.js
cat > backend/src/server.js << EOF
const app = require('./app');
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(\`Beyond Booking server running on port \${port}\`);
});
EOF

# Database structure
mkdir -p database/{schemas,migrations,seeds}

# Create database schema files
cat > database/schemas/rooms.sql << EOF
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL UNIQUE,
  floor INTEGER NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,
  price_category VARCHAR(20) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  amenities JSONB,
  status VARCHAR(20) DEFAULT 'available',
  last_maintenance_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_type ON rooms(room_type);
CREATE INDEX idx_rooms_price ON rooms(base_price);
EOF

cat > database/schemas/bookings.sql << EOF
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking_reference VARCHAR(20) NOT NULL UNIQUE,
  guest_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  booking_status VARCHAR(20) DEFAULT 'confirmed',
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (guest_id) REFERENCES guests(id)
);

CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
EOF

cat > database/schemas/guests.sql << EOF
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  preferences JSONB,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_loyalty ON guests(loyalty_points);
EOF

cat > database/schemas/maintenance.sql << EOF
CREATE TABLE maintenance (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL,
  maintenance_type VARCHAR(50) NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status VARCHAR(20) DEFAULT 'scheduled',
  priority VARCHAR(10) DEFAULT 'medium',
  assigned_to VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE INDEX idx_maintenance_room ON maintenance(room_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_maintenance_date ON maintenance(scheduled_date);
EOF

# Create database setup script
cat > database/setup.sql << EOF
-- Create database
CREATE DATABASE beyond_booking;
\c beyond_booking;

-- Apply schemas
\i schemas/guests.sql
\i schemas/rooms.sql
\i schemas/bookings.sql
\i schemas/maintenance.sql

-- Apply seeds (if available)
-- \i seeds/seed_data.sql
EOF

echo "Project structure setup complete!"
echo "To initialize the project:"
echo "1. cd Beyond-Booking-2.0"
echo "2. cd frontend && npm install"
echo "3. cd ../backend && npm install"
echo "4. Create PostgreSQL database using database/setup.sql"ch