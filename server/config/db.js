const mongoose = require('mongoose') 
const dotenv = require('dotenv') 
dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/library'

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })

mongoose.connection.on('connected', () => { console.log('MongoDB connected') })

mongoose.connection.on('error', (err) => { console.error('MongoDB connection error:', err) })

module.exports = mongoose