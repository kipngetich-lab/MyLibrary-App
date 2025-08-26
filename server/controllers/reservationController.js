const Reservation = require('../models/Reservation') 
const Book = require('../models/Book') 
const User = require('../models/User') 
const Notification = require('../models/Notification') 
const { sendMail } = require('../utils/mailer')

exports.list = async (req, res, next) => { 
	try { 
		const reservations = await Reservation.find().populate('book').populate('user').sort({ createdAt: -1 }) 
		res.json(reservations) 
	} catch (err) { 
		next(err) 
	} 
}

exports.create = async (req, res, next) => { 
	try { 
		const { bookId, userId } = req.body 
		if (!bookId || !userId) 
			return res.status(400).json({ message: 'Missing fields' }) 
		const book = await Book.findById(bookId) 
		if (!book) 
			return res.status(404).json({ message: 'Book not found' }) 
		const existing = await Reservation.findOne({ book: bookId, user: userId, status: { $in: ['pending','notified'] } }) 
		if (existing) 
			return res.status(400).json({ message: 'You already have a reservation for this book' }) 
		const r = new Reservation({ book: bookId, user: userId }) 
		await r.save() 
		res.json({ message: 'Reserved', reservation: r }) 
	} catch (err) { 
		next(err) 
	} 
}

exports.remove = async (req, res, next) => { 
	try { 
		const id = req.params.id 
		const r = await Reservation.findById(id) 
		if (!r) 
			return res.status(404).json({ message: 'Not found' }) 
			r.status = 'cancelled' 
			await r.save() 
			res.json({ message: 'Cancelled' }) 
	} catch (err) { 
		next(err) 
	} 
}