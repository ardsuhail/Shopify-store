const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'flat'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true 
  },
  minOrderAmount: { 
    type: Number, 
    default: 0 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
