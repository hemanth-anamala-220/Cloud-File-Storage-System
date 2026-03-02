# ☁️ CloudVault — Node.js Backend

## 🚀 Setup (Step by Step)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create your .env file
Create a file called `.env` in this folder:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/cloudvault
JWT_SECRET=any_long_random_string_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3 — Get your MongoDB URI (Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster (free M0)
3. Database Access → Add user with password
4. Network Access → Allow 0.0.0.0/0
5. Connect → Drivers → Copy the URI
6. Replace <password> in your .env

### Step 4 — Get Cloudinary keys (Free)
1. Go to https://cloudinary.com → Sign up free
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Paste into your .env

### Step 5 — Run the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at: http://localhost:5000

---

## 📁 Folder Structure
```
cloud-storage-server/
├── config/
│   ├── db.js            # MongoDB connection
│   └── cloudinary.js    # Cloudinary + Multer setup
├── controllers/
│   ├── authController.js
│   ├── fileController.js
│   └── folderController.js
├── models/
│   ├── User.js
│   ├── File.js
│   └── Folder.js
├── routes/
│   ├── authRoutes.js
│   ├── fileRoutes.js
│   └── folderRoutes.js
├── middleware/
│   └── authMiddleware.js  # JWT protect
├── server.js
├── .env                   # You create this!
└── package.json
```

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login → returns JWT |
| GET  | /api/auth/profile | Get current user |
| POST | /api/files/upload | Upload file |
| GET  | /api/files | Get all files |
| DELETE | /api/files/:id | Delete file |
| GET  | /api/files/download/:id | Download file |
| GET  | /api/folders | Get folders |
| POST | /api/folders | Create folder |
| DELETE | /api/folders/:id | Delete folder |
