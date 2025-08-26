const Loan = require('../models/Loan') 
const Book = require('../models/Book') 
const User = require('../models/User') 
const Reservation = require('../models/Reservation') 
const Notification = require('../models/Notification') 
const { sendMail } = require('../utils/mailer') 
const dotenv = require('dotenv') 
dotenv.config()

const FINE_PER_DAY = Number(process.env.FINE_PER_DAY || 1)

exports.list = async (req, res, next) => { 
try { 
	const loans = await Loan.find({ status: 'active' }).populate('member').populate('book').sort({ dueDate: 1 }) 
	// add overdue flag 
	const result = loans.map(l => { 
		const o = l.toObject() 
		o.overdue = new Date() > new Date(l.dueDate) 
		return o 
	}) 
		res.json(result) 
	} catch (err) {
	 next(err) 
	} 
}

exports.issue = async (req, res, next) => { 
try { 
		const { memberId, bookId, dueDate } = req.body 
		if (!memberId || !bookId || !dueDate) 
			return res.status(400).json({ message: 'Missing fields' }) 
		const book = await Book.findById(bookId) 
		if (!book) return res.status(404).json({ message: 'Book not found' }) 
		if (book.copiesAvailable <= 0) 
			return res.status(400).json({ message: 'No copies available' }) 
		const user = await User.findById(memberId) 
		if (!user) return res.status(404).json({ message: 'User not found' }) 
		// reduce available 
		book.copiesAvailable -= 1 
		await book.save() 
		const loan = new Loan({ member: memberId, book: bookId, dueDate }) 
		await loan.save() 
		// if there are reservations, mark first reservation collected if matches user 
		await Reservation.updateMany({ book: bookId, user: memberId, status: 'notified' }, { status: 'collected' }) 
		res.json({ message: 'Issued', loan }) 
	} catch (err) { 
		next(err) 
		} 
}

exports.returnBook = async (req, res, next) => {
	try { 
	const id = req.params.id 
	// loan id 
	const loan = await Loan.findById(id).populate('book').populate('member') 
	if (!loan) 
		return res.status(404).json({ message: 'Loan not found' }) 
	if (loan.status === 'returned') 
		return res.status(400).json({ message: 'Already returned' }) 
	loan.returnDate = new Date() 
	loan.status = 'returned' 
	// compute fine if overdue 
	const now = new Date() 
	const due = new Date(loan.dueDate) 
	if (now > due) { 
		const days = Math.ceil((now - due) / (1000 * 60 * 60 * 24)) 
		loan.fine = days * FINE_PER_DAY } 
		await loan.save() 
		// increment book availability 
		const book = await Book.findById(loan.book._id) 
		book.copiesAvailable = Math.min(book.copiesAvailable + 1, book.copies) 
		await book.save()
// handle reservations: notify earliest pending reservation
const nextRes = await Reservation.findOne({ book: book._id, status: 'pending' }).sort({ createdAt: 1 }).populate('user')
if (nextRes) {
  nextRes.status = 'notified'
  nextRes.notifiedAt = new Date()
  await nextRes.save()
  // create notification entry
  const notif = new Notification({
    title: `Book available: ${book.title}`,
    body: `The book "${book.title}" you reserved is now available.`,
    type: 'reservation',
    recipients: [nextRes.user._id]
  })
  await notif.save()
  // send email
  if (nextRes.user && nextRes.user.email) {
    try {
      await sendMail({
        to: nextRes.user.email,
        subject: `Reservation available: ${book.title}`,
        text: `The book "${book.title}" you reserved is available. Please collect it within 3 days.`,
      })
    } catch (err) {
      console.error('Failed sending reservation email', err)
    }
  }
}

res.json({ message: 'Returned', loan })

} catch (err) { next(err) } }

exports.renew = async (req, res, next) => { 
	try { 
		const id = req.params.id 
		const loan = await Loan.findById(id) 
		if (!loan) 
			return res.status(404).json({ message: 'Loan not found' }) 
		if (loan.status === 'returned') 
			return res.status(400).json({ message: 'Already returned' }) 
		// simple rule: add 7 days and increment renewedCount 
		const newDue = new Date(loan.dueDate) 
		newDue.setDate(newDue.getDate() + 7) 
		loan.dueDate = newDue 
		loan.renewedCount = (loan.renewedCount || 0) + 1 
		await loan.save() 
		res.json({ message: 'Renewed', loan }) 
	} catch (err) { 
		next(err) 
	} 
}

