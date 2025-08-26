const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/notificationController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

router.get('/', auth, permit('admin','librarian'), ctrl.list) 
router.post('/send', auth, permit('admin','librarian'), ctrl.send)

module.exports = router