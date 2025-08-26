const mongoose = require('mongoose') 
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, unique: true, required: true, index: true }, password: { type: String, required: true }, role: { type: String, enum: ['admin', 'librarian', 'member', 'public'], default: 'member' }, createdAt: { type: Date, default: Date.now }, }, { toJSON: { virtuals: true } })

UserSchema.pre('save', async function (next) { 
	if (!this.isModified('password')) 
		return next() 

	const salt = await bcrypt.genSalt(10) 
	this.password = await bcrypt.hash(this.password, salt) 
	next() 
})

UserSchema.methods.comparePassword = function (candidate) { return bcrypt.compare(candidate, this.password) }

module.exports = mongoose.model('User', UserSchema)