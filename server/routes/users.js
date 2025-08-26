const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/userController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

router.get('/', auth, permit('admin', 'librarian'), ctrl.list) 
router.put('/:id/role', auth, permit('admin'), ctrl.updateRole)

module.exports = router