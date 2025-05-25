// models/product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  licence: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'], // restrict to image types
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
