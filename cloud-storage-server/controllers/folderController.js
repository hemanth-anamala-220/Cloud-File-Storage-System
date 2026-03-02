const Folder = require('../models/Folder')
const File   = require('../models/File')

// GET /api/folders
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(folders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/folders
const createFolder = async (req, res) => {
  try {
    const { folderName, parentFolder } = req.body
    if (!folderName) return res.status(400).json({ message: 'Folder name required' })
    const folder = await Folder.create({ userId: req.user._id, folderName, parentFolder: parentFolder || null })
    res.status(201).json(folder)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/folders/:id
const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user._id })
    if (!folder) return res.status(404).json({ message: 'Folder not found' })
    // Also delete all files inside
    await File.deleteMany({ folderId: req.params.id, userId: req.user._id })
    await folder.deleteOne()
    res.json({ message: 'Folder deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getFolders, createFolder, deleteFolder }
