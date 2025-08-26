// Creates or exports a Nodemailer transporter. If SMTP env vars are not set, we create an Ethereal test account. 
const nodemailer = require('nodemailer') 
const dotenv = require('dotenv') 
dotenv.config()

async function createTransporter() { 
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env 
	if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) { 
		return nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS, }, }) 
	}

	// Create ethereal test account 
	const testAccount = await nodemailer.createTestAccount() 
	return nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: { user: testAccount.user, pass: testAccount.pass, }, }) 
}

module.exports = createTransporter