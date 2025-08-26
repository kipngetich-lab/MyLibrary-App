const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/reservationController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

router.get('/', auth, permit('admin','librarian'), ctrl.list) 
router.post('/', auth, ctrl.create) // members can create 
router.delete('/:id', auth, ctrl.remove)

module.exports = router