# ☁️ CloudVault — React Frontend

A production-ready React frontend for the Cloud File Storage system.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server (backend must be running on port 5000)
npm run dev

# Build for production
npm run build
```

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx         # Top navigation bar with search + upload
│   ├── Navbar.module.css
│   ├── FileCard.jsx       # Individual file card with download/delete
│   ├── FileCard.module.css
│   ├── UploadModal.jsx    # Drag & drop file upload modal
│   └── UploadModal.module.css
│
├── pages/
│   ├── Login.jsx          # Login page
│   ├── Signup.jsx         # Signup page
│   ├── Auth.module.css    # Shared auth styles
│   ├── Dashboard.jsx      # Main dashboard with files + folders
│   ├── Dashboard.module.css
│   ├── FolderView.jsx     # View files inside a folder
│   └── FolderView.module.css
│
├── context/
│   └── AuthContext.jsx    # Auth state (login/logout/user)
│
├── services/
│   └── api.js             # All Axios API calls
│
├── App.jsx                # Routes & protected routes
├── main.jsx               # Entry point
└── index.css              # Global CSS variables & reset
```

## 🔗 API Expected

The frontend expects a backend at `/api` (proxied to `http://localhost:5000`).

### Required endpoints:
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/profile | Get current user |
| POST | /api/files/upload | Upload file (multipart) |
| GET | /api/files | List files (optional: ?folderId=) |
| DELETE | /api/files/:id | Delete file |
| GET | /api/files/download/:id | Download file |
| GET | /api/folders | List folders |
| POST | /api/folders | Create folder { folderName } |
| DELETE | /api/folders/:id | Delete folder |

## 🎨 Tech Stack
- React 18 + Vite
- React Router v6
- Axios
- CSS Modules (zero external UI libraries)
