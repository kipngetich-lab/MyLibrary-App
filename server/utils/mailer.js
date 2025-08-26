const createTransporter = require('../config/mailer') 
const dotenv = require('dotenv') 
dotenv.config()

async function sendMail({ to, subject, html, text }) { 
	const transporter = await createTransporter() 
	const from = process.env.FROM_EMAIL || 'Library no-reply@library.local' 
	const info = await transporter.sendMail({ from, to, subject, text, html, }) 
	// If using Ethereal, log preview URL 
	if (nodemailerPreviewAvailable(info)) { 
		console.log('Preview URL:', nodemailerPreviewURL(info)) 
	} 
	return info 
}

function nodemailerPreviewAvailable(info) { return !!(info && info.messageId && info.response && info.envelope && info.accepted) } function nodemailerPreviewURL(info) { try { return require('nodemailer').getTestMessageUrl(info) } catch { return null } }

module.exports = { sendMail, nodemailerPreviewURL }