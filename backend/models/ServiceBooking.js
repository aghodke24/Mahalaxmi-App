const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  applianceType: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'], default: 'Pending' },
  inspectionFee: { type: Number, default: 299 }
}, { timestamps: true });

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);