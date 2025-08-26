const mongoose = require('mongoose')

const AcquisitionSchema = new mongoose.Schema({ title: { type: String, required: true }, author: { type: String }, isbn: { type: String }, qty: { type: Number, default: 1 }, requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['requested', 'ordered', 'received', 'rejected'], default: 'requested' }, createdAt: { type: Date, default: Date.now }, })

module.exports = mongoose.model('Acquisition', AcquisitionSchema)