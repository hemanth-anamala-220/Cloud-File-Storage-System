import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FileCard from '../components/FileCard'
import UploadModal from '../components/UploadModal'
import { getFiles, getFolders } from '../services/api'
import styles from './Dashboard.module.css'
import fStyles from './FolderView.module.css'

export default function FolderView() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const [files, setFiles]         = useState([])
  const [folder, setFolder]       = useState(null)
  const [search, setSearch]       = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [filesRes, foldersRes] = await Promise.all([
          getFiles({ folderId: id }),
          getFolders()
        ])
        setFiles(filesRes.data)
        const found = foldersRes.data.find(f => f._id === id)
        setFolder(found)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const filtered = files.filter(f =>
    f.fileName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <Navbar
        onUpload={() => setShowUpload(true)}
        onSearch={setSearch}
        searchQuery={search}
      />

      <main style={{ padding: '28px', flex: 1 }}>
        <div className={fStyles.breadcrumb}>
          <button onClick={() => navigate('/dashboard')}>My Files</button>
          <span>/</span>
          <span>{folder?.folderName || 'Folder'}</span>
        </div>

        {loading ? (
          <div className={styles.loadWrap}><div className={styles.spinner} /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <h3>This folder is empty</h3>
            <p>Upload files into this folder</p>
            <button className={styles.uploadCTA} onClick={() => setShowUpload(true)}>Upload File</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(file => (
              <FileCard
                key={file._id}
                file={file}
                onDelete={fid => setFiles(prev => prev.filter(f => f._id !== fid))}
              />
            ))}
          </div>
        )}
      </main>

      {showUpload && (
        <UploadModal
          folderId={id}
          onClose={() => setShowUpload(false)}
          onUploaded={f => setFiles(prev => [f, ...prev])}
        />
      )}
    </div>
  )
}
