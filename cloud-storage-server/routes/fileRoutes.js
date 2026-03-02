const express = require('express')
const router  = express.Router()
const { uploadFile, getFiles, deleteFile, downloadFile } = require('../controllers/fileController')
const { protect } = require('../middleware/authMiddleware')
const { upload }  = require('../config/cloudinary')

router.post('/upload',       protect, upload.single('file'), uploadFile)
router.get('/',              protect, getFiles)
router.delete('/:id',        protect, deleteFile)
router.get('/download/:id',  protect, downloadFile)

module.exports = router
