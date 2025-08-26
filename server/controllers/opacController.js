const Book = require('../models/Book')

exports.search = async (req, res, next) => { 
	try { 
		const q = req.query.q || '' 
		if (!q) 
			return res.json([]) 
		let results = await Book.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(50) 
		if (results.length === 0) { 
		const regex = new RegExp(q.split(' ').join('|'), 'i') 
		results = await Book.find({ $or: [{ title: regex }, { author: regex }, { isbn: regex }, { category: regex }] }).limit(50) } 
		// only return public info 
		const out = results.map(b => ({ _id: b._id, title: b.title, author: b.author, copiesAvailable: b.copiesAvailable })) 
		res.json(out) 
	} catch (err) { 
		next(err) 
	} 
}