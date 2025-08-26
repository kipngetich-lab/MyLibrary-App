const jwt = require('jsonwebtoken') 
const User = require('../models/User') 
const dotenv = require('dotenv') 
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

async function auth(req, res, next) { 
	const authHeader = req.headers.authorization 
	if (!authHeader) 
		return res.status(401).json({ message: 'No token provided' }) 
	const parts = authHeader.split(' ') 
	if (parts.length !== 2) 
		return res.status(401).json({ message: 'Token error' })

	const [scheme, token] = parts 
	if (!/^Bearer$/i.test(scheme)) 
	return res.status(401).json({ message: 'Token malformatted' }) 
	try { 
		const decoded = jwt.verify(token, JWT_SECRET) 
		const user = await User.findById(decoded.id).select('-password') 
		if (!user) 
			return res.status(401).json({ message: 'User not found' }) 
		req.user = user 
		next() 
	} 
	catch (err) { 
		return res.status(401).json({ message: 'Token invalid' }) 
	} 
}

module.exports = auth