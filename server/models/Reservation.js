const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, status: { type: String, enum: ['pending', 'notified', 'collected', 'cancelled'], default: 'pending' }, createdAt: { type: Date, default: Date.now }, notifiedAt: { type: Date }, })

module.exports = mongoose.model('Reservation', ReservationSchema)