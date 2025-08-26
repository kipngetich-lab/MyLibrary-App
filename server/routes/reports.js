const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/reportController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

router.get('/most-borrowed', auth, permit('admin','librarian'), ctrl.mostBorrowed) 
router.get('/trends', auth, permit('admin','librarian'), ctrl.trends)

module.exports = router