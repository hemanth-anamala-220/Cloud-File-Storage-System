const express = require('express')
const router  = express.Router()
const { getFolders, createFolder, deleteFolder } = require('../controllers/folderController')
const { protect } = require('../middleware/authMiddleware')

router.get('/',      protect, getFolders)
router.post('/',     protect, createFolder)
router.delete('/:id', protect, deleteFolder)

module.exports = router
