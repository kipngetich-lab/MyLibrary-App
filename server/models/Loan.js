const mongoose = require('mongoose')

const LoanSchema = new mongoose.Schema({ member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, issueDate: { type: Date, default: Date.now }, dueDate: { type: Date, required: true }, returnDate: { type: Date }, renewedCount: { type: Number, default: 0 }, fine: { type: Number, default: 0 }, status: { type: String, enum: ['active', 'returned'], default: 'active' }, createdAt: { type: Date, default: Date.now }, })

LoanSchema.virtual('overdue').get(function () { 
		if (this.status === 'returned') 
			return false 
		return new Date() > new Date(this.dueDate) 
	})

module.exports = mongoose.model('Loan', LoanSchema)