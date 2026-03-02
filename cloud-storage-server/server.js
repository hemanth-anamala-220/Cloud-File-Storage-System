const express  = require('express')
const cors     = require('cors')
const dotenv   = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth',    require('./routes/authRoutes'))
app.use('/api/files',   require('./routes/fileRoutes'))
app.use('/api/folders', require('./routes/folderRoutes'))

// Health check
app.get('/', (req, res) => res.json({ message: '✅ CloudVault API is running' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Server Error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
