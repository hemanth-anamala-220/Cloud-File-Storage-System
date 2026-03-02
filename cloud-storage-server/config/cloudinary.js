const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Strip extension from public_id to avoid double extension (.pdf.pdf)
    const nameWithoutExt = file.originalname
      .replace(/\s+/g, '_')
      .replace(/\.[^/.]+$/, '')  // remove last extension

    // Use 'raw' for PDFs and documents so Cloudinary doesn't transform them
    let resource_type = 'auto'
    const mime = file.mimetype.toLowerCase()
    if (
      mime.includes('pdf') ||
      mime.includes('word') ||
      mime.includes('excel') ||
      mime.includes('spreadsheet') ||
      mime.includes('powerpoint') ||
      mime.includes('presentation') ||
      mime.includes('text')
    ) {
      resource_type = 'raw'
    }

    return {
      folder:        'cloudvault',
      resource_type,
      public_id:     `${Date.now()}-${nameWithoutExt}`,
      access_mode:   'public',   // make file publicly accessible
    }
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
})

module.exports = { upload, cloudinary }