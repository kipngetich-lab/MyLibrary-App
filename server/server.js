const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('./config/db')
const socketSetup = require('./sockets/chat')
const Loan = require('./models/Loan')
const Notification = require('./models/Notification')
const User = require('./models/User')
const { sendMail } = require('./utils/mailer')
const path = require('path')

const currentDir= path.resolve();

dotenv.config()

const app = express()
const server = http.createServer(app)

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/books', require('./routes/books'))
app.use('/api/users', require('./routes/users'))
app.use('/api/lend', require('./routes/lend'))
app.use('/api/reservations', require('./routes/reservations'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/opac', require('./routes/opac'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/acquisitions', require('./routes/acquisitions'))

app.get('/health', function (req, res) {
  res.json({ ok: true })
})

// Socket.IO
var io = socketSetup(server)

// Background job: auto-calc fines and notify overdue users
async function processOverdues() {
  try {
    var now = new Date()
    // find active loans that are overdue
    var overdueLoans = await Loan.find({ status: 'active', dueDate: { $lt: now } }).populate('member').populate('book')
    for (var i = 0; i < overdueLoans.length; i++) {
      var loan = overdueLoans[i]
      var due = new Date(loan.dueDate)
      var days = Math.ceil((now - due) / (1000 * 60 * 60 * 24))
      var finePerDay = Number(process.env.FINE_PER_DAY || 1)
      var newFine = days * finePerDay
      // only update and notify once per change
      if (loan.fine !== newFine) {
        loan.fine = newFine
        await loan.save()
        // create a notification and email
        var notif = new Notification({
          title: 'Overdue: ' + (loan.book && loan.book.title ? loan.book.title : 'Book'),
          body: 'Your loan for "' + (loan.book && loan.book.title ? loan.book.title : 'Book') + '" is overdue by ' + days + ' day(s). Current fine: $' + newFine + '. Please return or renew.',
          type: 'overdue',
          recipients: [loan.member._id]
        })
        await notif.save()
        // send email if user has email
        if (loan.member && loan.member.email) {
          try {
            await sendMail({ to: loan.member.email, subject: notif.title, text: notif.body })
          } catch (err) {
            console.error('Failed to send overdue email', err)
          }
        }
      }
    }
  } catch (err) {
    console.error('Error processing overdues', err)
  }
}

// schedule job
var intervalMs = process.env.NODE_ENV === 'development' ? 60 * 1000 : 24 * 60 * 60 * 1000 // 1min dev, 24h prod
setInterval(processOverdues, intervalMs)
// run at startup
processOverdues().catch(function (err) { console.error(err) })

// Error handler fallback
app.use(function (err, req, res, next) {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//production
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(currentDir,"/client/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(currentDir,"client","dist","index.html"));
  })
}

//start server
var PORT = process.env.PORT || 5000
server.listen(PORT, function () {
  console.log('Server listening on port ' + PORT)
})