const Notification = require('../models/Notification') 
const User = require('../models/User') 
const { sendMail } = require('../utils/mailer')

exports.list = async (req, res, next) => { 
	try { 
		const notifs = await Notification.find().sort({ createdAt: -1 }) 
		res.json(notifs) 
	} catch (err) { 
		next(err) 
	} 
}

exports.send = async (req, res, next) => { 
	try { 
		const { id } = req.body 
		const notif = await Notification.findById(id) 
		if (!notif) 
			return res.status(404).json({ message: 'Notification not found' }) 
		// find recipients 
		const recipients = notif.recipients && notif.recipients.length ? await User.find({ _id: { $in: notif.recipients } }) : [] 
		// send to each 
		for (const r of recipients) { 
			if (r.email) { 
				try { 
					await sendMail({ to: r.email, subject: notif.title, text: notif.body }) 
				} 
				catch (err) { 
					console.error('Send mail failed for', r.email, err) 
				} 
			} 
		} 
		notif.sentAt = new Date() 
		await notif.save() 
		res.json({ message: 'Sent' }) 
	} catch (err) { 
		next(err) 
	} 
}