const Acquisition = require('../models/Acquisition')

exports.list = async (req, res, next) => { 
	try { 
		const acqs = await Acquisition.find().sort({ createdAt: -1 }) 
		res.json(acqs) 
	} catch (err) { 
		next(err) 
	} 
}

exports.create = async (req, res, next) => { 
	try { 
		const data = req.body 
		const a = new Acquisition(data) 
		await a.save() 
		res.json(a) 
	} catch (err) { 
		next(err) 
	} 
}