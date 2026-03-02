const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName:  { type: String, required: true },
  fileType:  { type: String },
  fileSize:  { type: Number },
  fileUrl:   { type: String, required: true },
  publicId:  { type: String }, // Cloudinary public_id for deletion
  folderId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
}, { timestamps: true })

module.exports = mongoose.model('File', fileSchema)
