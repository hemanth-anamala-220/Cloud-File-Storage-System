const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderName:   { type: String, required: true, trim: true },
  parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
}, { timestamps: true })

module.exports = mongoose.model('Folder', folderSchema)
