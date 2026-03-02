const File      = require('../models/File')
const { cloudinary } = require('../config/cloudinary')
const axios     = require('axios')

// POST /api/files/upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    // req.file.path = the Cloudinary URL
    // For 'raw' files, Cloudinary returns the correct public URL in req.file.path
    const file = await File.create({
      userId:   req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl:  req.file.path,       // full Cloudinary URL
      publicId: req.file.filename,   // public_id for deletion
      folderId: req.body.folderId || null,
    })

    res.status(201).json(file)
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ message: err.message })
  }
}

// GET /api/files
const getFiles = async (req, res) => {
  try {
    const query = { userId: req.user._id }
    if (req.query.folderId) query.folderId = req.query.folderId
    else if (!req.query.all) query.folderId = null

    const files = await File.find(query).sort({ createdAt: -1 })
    res.json(files)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/files/:id
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user._id })
    if (!file) return res.status(404).json({ message: 'File not found' })

    // Delete from Cloudinary — try both 'raw' and 'auto' resource types
    if (file.publicId) {
      try {
        await cloudinary.uploader.destroy(file.publicId, { resource_type: 'raw' })
      } catch {
        await cloudinary.uploader.destroy(file.publicId, { resource_type: 'image' })
      }
    }

    await file.deleteOne()
    res.json({ message: 'File deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/files/download/:id
const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user._id })
    if (!file) return res.status(404).json({ message: 'File not found' })

    const response = await axios.get(file.fileUrl, { responseType: 'stream' })
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`)
    res.setHeader('Content-Type', file.fileType)
    response.data.pipe(res)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { uploadFile, getFiles, deleteFile, downloadFile }
