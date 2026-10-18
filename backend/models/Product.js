// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true }, // e.g. Washing Machine, RO, AC
//   type: { type: String, enum: ['appliance', 'spare', 'service'], required: true },
//   price: { type: Number, required: true },
//   originalPrice: { type: Number },
//   discount: { type: String },
//   rating: { type: Number, default: 4.8 },
//   reviews: { type: Number, default: 0 },
//   image: { type: String, required: true },
//   badge: { type: String },
//   desc: { type: String },
//   inStock: { type: Boolean, default: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['appliance', 'spare', 'service'], required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  badge: { type: String },
  desc: { type: String },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);