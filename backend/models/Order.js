const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      title: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash / UPI on Delivery' },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);