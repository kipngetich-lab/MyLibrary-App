const User = require('../models/User')
const jwt = require('jsonwebtoken') 
const dotenv = require('dotenv') 
dotenv.config() 
const JWT_SECRET = process.env.JWT_SECRET || 'secret' 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

exports.register = async (req, res, next) => { 
	try { 
		const { name, email, password, role } = req.body 
		if (!name || !email || !password) 
			return res.status(400).json({ message: 'Missing fields' }) 
		const exists = await User.findOne({ email }) 
		if (exists) 
			return res.status(400).json({ message: 'Email already registered' }) 
		const user = new User({ name, email, password, role }) 
		await user.save() 
		res.json({ message: 'Registered' }) 
	} catch (err) { 
		next(err) 
	} 
}

exports.login = async (req, res, next) => {
 try { 
 	const { email, password } = req.body 
 	if (!email || !password) 
 		return res.status(400).json({ message: 'Missing credentials' }) 
 	const user = await User.findOne({ email }) 
 	if (!user) 
 		return res.status(400).json({ message: 'Invalid credentials' }) 
 	const ok = await user.comparePassword(password) 
 	if (!ok) 
 		return res.status(400).json({ message: 'Invalid credentials' }) 
 	const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }) 
 	const userSafe = user.toObject() 
 	delete userSafe.password 
 	res.json({ user: userSafe, token }) 
 } catch (err) { 
 	next(err) 
 } 
}

exports.me = async (req, res, next) => { 
	try {
	 res.json(req.user) 
	} catch (err) { 
		next(err) 
	} 
}