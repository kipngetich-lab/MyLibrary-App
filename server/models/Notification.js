const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({ title: { type: String, required: true }, body: { type: String }, type: { type: String, enum: ['overdue', 'reservation', 'announcement', 'custom'], default: 'custom' }, recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], sentAt: { type: Date }, createdAt: { type: Date, default: Date.now }, })

module.exports = mongoose.model('Notification', NotificationSchema)