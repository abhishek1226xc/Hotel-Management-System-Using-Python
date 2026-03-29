class Node {
    constructor(room) {
      this.room = room;
      this.left = null;
      this.right = null;
    }
  }
  
  class BST {
    constructor() {
      this.root = null;
    }
    
    // Insert a room into the BST
    insert(room) {
      const newNode = new Node(room);
      
      if (!this.root) {
        this.root = newNode;
        return;
      }
      
      this._insertNode(this.root, newNode);
    }
    
    _insertNode(node, newNode) {
      // Using room ID as the key for BST ordering
      if (newNode.room.id < node.room.id) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          this._insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          this._insertNode(node.right, newNode);
        }
      }
    }
    
    // Find a room by ID
    findById(id) {
      return this._findById(this.root, id);
    }
    
    _findById(node, id) {
      if (node === null) {
        return null;
      }
      
      if (id === node.room.id) {
        return node.room;
      }
      
      if (id < node.room.id) {
        return this._findById(node.left, id);
      } else {
        return this._findById(node.right, id);
      }
    }
    
    // Update room availability
    updateAvailability(id, available) {
      this._updateAvailability(this.root, id, available);
    }
    
    _updateAvailability(node, id, available) {
      if (node === null) {
        return;
      }
      
      if (id === node.room.id) {
        node.room.available = available;
        return;
      }
      
      if (id < node.room.id) {
        this._updateAvailability(node.left, id, available);
      } else {
        this._updateAvailability(node.right, id, available);
      }
    }
    
    // Update room price
    updatePrice(id, price) {
      this._updatePrice(this.root, id, price);
    }
    
    _updatePrice(node, id, price) {
      if (node === null) {
        return;
      }
      
      if (id === node.room.id) {
        node.room.price = price;
        return;
      }
      
      if (id < node.room.id) {
        this._updatePrice(node.left, id, price);
      } else {
        this._updatePrice(node.right, id, price);
      }
    }
    
    // Search for rooms matching criteria
    search(criteria) {
      const results = [];
      this._search(this.root, criteria, results);
      return results;
    }
    
    _search(node, criteria, results) {
      if (node === null) {
        return;
      }
      
      // Check if current node matches criteria
      if (this._matchesCriteria(node.room, criteria)) {
        results.push(node.room);
      }
      
      // Search both subtrees
      this._search(node.left, criteria, results);
      this._search(node.right, criteria, results);
    }
    
    _matchesCriteria(room, criteria) {
      // Check all criteria
      if (criteria.type && room.type !== criteria.type) {
        return false;
      }
      
      if (criteria.minPrice !== undefined && room.price < criteria.minPrice) {
        return false;
      }
      
      if (criteria.maxPrice !== undefined && room.price > criteria.maxPrice) {
        return false;
      }
      
      if (criteria.available !== undefined && room.available !== criteria.available) {
        return false;
      }
      
      // All criteria matched
      return true;
    }
  }
  
  module.exports = BST;