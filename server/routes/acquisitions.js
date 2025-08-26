const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/acquisitionController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

router.get('/', auth, permit('admin','librarian'), ctrl.list) 
router.post('/', auth, ctrl.create)

module.exports = router