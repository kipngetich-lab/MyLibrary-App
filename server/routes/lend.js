const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/lendController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

router.get('/', auth, permit('admin','librarian'), ctrl.list) 
router.post('/issue', auth, permit('admin','librarian'), ctrl.issue) 
router.post('/return/:id', auth, permit('admin','librarian'), ctrl.returnBook) 
router.post('/renew/:id', auth, permit('admin','librarian'), ctrl.renew)

module.exports = router