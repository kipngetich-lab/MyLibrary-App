const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({ title: { type: String, required: true, index: true }, author: { type: String, index: true }, isbn: { type: String, index: true }, category: { type: String, index: true }, description: { type: String }, copies: { type: Number, default: 1 }, copiesAvailable: { type: Number, default: 1 }, location: { type: String }, branches: [{ type: String }], createdAt: { type: Date, default: Date.now }, })

// Simple text index for search 
BookSchema.index({ title: 'text', author: 'text', isbn: 'text', category: 'text', description: 'text' })

module.exports = mongoose.model('Book', BookSchema)