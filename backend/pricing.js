const tf = require('@tensorflow/tfjs-node');

class PricingEngine {
  constructor() {
    this.model = null;
    this.initialized = false;
    this.initialize();
  }
  
  // Initialize TensorFlow model
  async initialize() {
    try {
      // Simple model
      const model = tf.sequential();
      
      model.add(tf.layers.dense({ 
        inputShape: [3], 
        units: 5, 
        activation: 'relu' 
      }));
      
      model.add(tf.layers.dense({ units: 1 }));
      
      model.compile({ 
        optimizer: 'adam', 
        loss: 'meanSquaredError' 
      });
      
      this.model = model;
      this.initialized = true;
      console.log('Pricing model initialized');
    } catch (err) {
      console.error('Error initializing pricing model:', err);
    }
  }
  
  // Calculate dynamic price based on room and occupancy
  calculatePrice(room, occupancyRate) {
    // Base price from room data
    const basePrice = room.basePrice || 100;
    
    // If ML model is ready, use it
    if (this.initialized && this.model) {
      try {
        // Input features: room type (0-2), day of week (0-6), occupancy (0-1)
        const roomTypeValue = 
          room.type === 'standard' ? 0 : 
          room.type === 'deluxe' ? 1 : 2;
        
        const dayOfWeek = new Date().getDay();
        
        const input = tf.tensor2d([[
          roomTypeValue / 2,  // Normalize to 0-1
          dayOfWeek / 6,      // Normalize to 0-1
          occupancyRate       // Already 0-1
        ]]);
        
        // Get prediction
        const prediction = this.model.predict(input);
        const priceMultiplier = prediction.dataSync()[0];
        
        // Apply multiplier within reasonable bounds
        return Math.round(basePrice * Math.max(0.7, Math.min(1.5, priceMultiplier)));
      } catch (err) {
        console.error('ML price calculation error:', err);
        // Fall back to simple calculation
        return this.simpleCalculation(room, occupancyRate);
      }
    } else {
      // Use simple calculation if model isn't ready
      return this.simpleCalculation(room, occupancyRate);
    }
  }
  
  // Simple price calculation as fallback
  simpleCalculation(room, occupancyRate) {
    const basePrice = room.basePrice || 100;
    
    // Apply room type multiplier
    const typeMultiplier = 
      room.type === 'standard' ? 1.0 :
      room.type === 'deluxe' ? 1.5 : 2.0;
    
    // Weekend multiplier
    const isWeekend = [0, 6].includes(new Date().getDay());
    const weekendMultiplier = isWeekend ? 1.2 : 1.0;
    
    // Occupancy multiplier (higher occupancy = higher price)
    const occupancyMultiplier = 0.8 + (occupancyRate * 0.4);
    
    // Calculate final price
    const price = basePrice * typeMultiplier * weekendMultiplier * occupancyMultiplier;
    
    // Round to nearest dollar
    return Math.round(price);
  }

  // Predict maintenance needs
  predictMaintenance(room) {
    // Basic logic without ML
    const daysSinceLastMaintenance = (new Date() - new Date(room.lastMaintenance)) / (1000 * 60 * 60 * 24);
    const totalBookings = room.bookingCount || 0;
    
    // Simple scoring
    let score = 0;
    
    // Time-based factor
    if (daysSinceLastMaintenance > 90) score += 3;
    else if (daysSinceLastMaintenance > 45) score += 2;
    else if (daysSinceLastMaintenance > 30) score += 1;
    
    // Usage-based factor
    if (totalBookings > 50) score += 3;
    else if (totalBookings > 25) score += 2;
    else if (totalBookings > 10) score += 1;
    
    // Issue-based factor (mock data)
    const reportedIssues = room.reportedIssues || 0;
    score += reportedIssues;
    
    // Return maintenance priority (0-10 scale)
    return Math.min(10, score);
  }
  
  // With ML model (future enhancement)
  async predictMaintenanceML(room) {
    if (!this.maintenanceModel) {
      // Initialize model...
      return this.predictMaintenance(room);
    }
    
    try {
      // Features: days since maintenance, bookings, reported issues
      const input = tf.tensor2d([[
        Math.min(180, daysSinceLastMaintenance) / 180,
        Math.min(100, totalBookings) / 100,
        Math.min(5, reportedIssues) / 5
      ]]);
      
      const prediction = this.maintenanceModel.predict(input);
      return prediction.dataSync()[0] * 10; // Scale to 0-10
    } catch (err) {
      console.error('ML maintenance prediction error:', err);
      return this.predictMaintenance(room);
    }
  }
}

module.exports = new PricingEngine();
