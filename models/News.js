// models/product.js
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
    category: {
    type: String,
    required: true,
    trim: true
  },
   
}, {
  timestamps: true
});

const News = mongoose.model('News', newsSchema);

export default News;
