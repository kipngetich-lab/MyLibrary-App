const express = require('express') 
const router = express.Router() 
const ctrl = require('../controllers/bookController') 
const auth = require('../middleware/auth') 
const { permit } = require('../middleware/roles')

// public search 
router.get('/search', ctrl.search)

router.get('/', auth, ctrl.list) 
router.post('/', auth, permit('admin', 'librarian'), ctrl.create) 
router.get('/:id', auth, ctrl.get) 
router.put('/:id', auth, permit('admin', 'librarian'), ctrl.update) 
router.delete('/:id', auth, permit('admin', 'librarian'), ctrl.remove)

module.exports = router