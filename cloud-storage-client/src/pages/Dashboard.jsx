import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FileCard from '../components/FileCard'
import UploadModal from '../components/UploadModal'
import { getFiles, getFolders, createFolder, deleteFolder } from '../services/api'
import styles from './Dashboard.module.css'

const FILTERS = [
  { label: 'All',       value: 'all' },
  { label: 'Images',    value: 'image' },
  { label: 'Videos',    value: 'video' },
  { label: 'Docs',      value: 'document' },
  { label: 'Audio',     value: 'audio' },
  { label: 'PDF',       value: 'pdf' },
]

export default function Dashboard() {
  const [files, setFiles]         = useState([])
  const [folders, setFolders]     = useState([])
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [newFolder, setNewFolder] = useState('')
  const [loading, setLoading]     = useState(true)
  const navigate                  = useNavigate()

  const loadData = async () => {
    setLoading(true)
    try {
      const [filesRes, foldersRes] = await Promise.all([getFiles(), getFolders()])
      setFiles(filesRes.data)
      setFolders(foldersRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleCreateFolder = async (e) => {
    e.preventDefault()
    if (!newFolder.trim()) return
    try {
      const res = await createFolder({ folderName: newFolder.trim() })
      setFolders(prev => [...prev, res.data])
      setNewFolder('')
    } catch { alert('Failed to create folder') }
  }

  const handleDeleteFolder = async (id) => {
    if (!window.confirm('Delete this folder?')) return
    try {
      await deleteFolder(id)
      setFolders(prev => prev.filter(f => f._id !== id))
    } catch { alert('Failed to delete folder') }
  }

  const filteredFiles = files
    .filter(f => !f.folderId)  // only root-level files
    .filter(f => {
      if (filter === 'all') return true
      return f.fileType?.toLowerCase().includes(filter)
    })
    .filter(f => f.fileName?.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: files.length,
    images: files.filter(f => f.fileType?.includes('image')).length,
    videos: files.filter(f => f.fileType?.includes('video')).length,
    docs:   files.filter(f => f.fileType?.includes('pdf') || f.fileType?.includes('document')).length,
  }

  return (
    <div className={styles.page}>
      <Navbar
        onUpload={() => setShowUpload(true)}
        onSearch={setSearch}
        searchQuery={search}
      />

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>Total Files</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{stats.images}</span>
              <span className={styles.statLabel}>Images</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{stats.videos}</span>
              <span className={styles.statLabel}>Videos</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{stats.docs}</span>
              <span className={styles.statLabel}>Docs</span>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Folders</p>
            {folders.length === 0 && (
              <p className={styles.empty}>No folders yet</p>
            )}
            {folders.map(folder => (
              <div key={folder._id} className={styles.folderRow}>
                <span
                  className={styles.folderName}
                  onClick={() => navigate(`/folder/${folder._id}`)}
                >
                  📁 {folder.folderName}
                </span>
                <button
                  className={styles.folderDel}
                  onClick={() => handleDeleteFolder(folder._id)}
                >✕</button>
              </div>
            ))}
            <form onSubmit={handleCreateFolder} className={styles.newFolderForm}>
              <input
                value={newFolder}
                onChange={e => setNewFolder(e.target.value)}
                placeholder="New folder name…"
                className={styles.folderInput}
              />
              <button type="submit" className={styles.folderBtn}>+</button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <div className={styles.topBar}>
            <div className={styles.filters}>
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`${styles.filterBtn} ${filter === f.value ? styles.active : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className={styles.count}>{filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}</p>
          </div>

          {loading ? (
            <div className={styles.loadWrap}>
              <div className={styles.spinner} />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>☁</div>
              <h3>No files here</h3>
              <p>Upload your first file to get started</p>
              <button className={styles.uploadCTA} onClick={() => setShowUpload(true)}>Upload File</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredFiles.map(file => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDelete={id => setFiles(prev => prev.filter(f => f._id !== id))}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={f => setFiles(prev => [f, ...prev])}
        />
      )}
    </div>
  )
}
