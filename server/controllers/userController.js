const User = require('../models/User')

exports.list = async (req, res, next) => { 
	try { 
		const filter = {} 
		if (req.query.role) 
			filter.role = req.query.role 
		const users = await User.find(filter).select('-password').sort({ name: 1 }) 
		res.json(users) 
	} catch (err) { 
		next(err) 
	} 
}

exports.updateRole = async (req, res, next) => {
 	try { 
 		const { role } = req.body 
 		const user = await User.findById(req.params.id) 
 		if (!user) 
 			return res.status(404).json({ message: 'User not found' }) 
 		user.role = role 
 		await user.save() 
 		res.json({ message: 'Updated', user: { _id: user._id, name: user.name, email: user.email, role: user.role } }) 
 	} catch (err) { 
 		next(err) 
 	}
 }