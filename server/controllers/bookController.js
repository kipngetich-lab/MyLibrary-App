const Book = require('../models/Book') 
const Reservation = require('../models/Reservation')

exports.list = async (req, res, next) => { 
	try { 
		const books = await Book.find().sort({ title: 1 }) 
		res.json(books) 
	} catch (err) { 
		next(err) 
	} 
}

exports.create = async (req, res, next) => { 
	try { 
		const data = req.body 
		data.copiesAvailable = data.copies != null ? data.copies : 1 
		const book = new Book(data) 
		await book.save() 
		res.json(book) 
	} catch (err) { 
		next(err) 
	} 
}

exports.get = async (req, res, next) => { 
	try { 
		const book = await Book.findById(req.params.id) 
		if (!book) return res.status(404).json({ message: 'Not found' }) 
			res.json(book) 
	} catch (err) { 
		next(err) 
	} 
}

exports.update = async (req, res, next) => { 
	try { 
		const data = req.body 
		const book = await Book.findByIdAndUpdate(req.params.id, data, { new: true }) 
	if (!book) return res.status(404).json({ message: 'Not found' }) 
		// if copies changed and copiesAvailable > copies, adjust 
	if (book.copiesAvailable > book.copies) book.copiesAvailable = book.copies 
		await book.save() 
	res.json(book) 
	} catch (err) { 
	next(err) 
	} 
}

exports.remove = async (req, res, next) => { 
	try { 
		await Book.findByIdAndDelete(req.params.id) 
		// also remove reservations for the book 
		await Reservation.deleteMany({ book: req.params.id }) 
		res.json({ message: 'Deleted' }) 
	} catch (err) { 
		next(err) 
	} 
}

exports.search = async (req, res, next) => { 
	try { 
		const q = req.query.q || '' 
		if (!q) 
		return res.json([]) 
		// text search first, fallback to regex 
		let results = await Book.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(50) 
		if (results.length === 0) { 
			const regex = new RegExp(q.split(' ').join('|'), 'i') 
			results = await Book.find({ $or: [{ title: regex }, { author: regex }, { isbn: regex }, { category: regex }] }).limit(50) 
		} 
		res.json(results) 
	} catch (err) { 
		next(err) 
	} 
}