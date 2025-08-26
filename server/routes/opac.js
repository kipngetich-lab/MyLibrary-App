const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/opacController')

router.get('/search', ctrl.search)

module.exports = router