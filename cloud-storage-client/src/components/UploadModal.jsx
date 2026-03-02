import { useState, useRef } from 'react'
import { uploadFile } from '../services/api'
import styles from './UploadModal.module.css'

export default function UploadModal({ onClose, onUploaded, folderId }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile]         = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const inputRef                = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 50 * 1024 * 1024) { setError('File must be under 50 MB'); return }
    setError('')
    setFile(f)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    if (folderId) fd.append('folderId', folderId)
    try {
      const res = await uploadFile(fd)
      onUploaded(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.')
      setUploading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Upload File</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div
          className={`${styles.dropzone} ${dragging ? styles.active : ''} ${file ? styles.hasFile : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={e => handleFile(e.target.files[0])}
          />
          {file ? (
            <>
              <div className={styles.filePreview}>📄</div>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <div className={styles.uploadIcon}>⬆</div>
              <p className={styles.dropText}>Drag & drop a file here</p>
              <p className={styles.dropSub}>or click to browse · Max 50 MB</p>
            </>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          {file && !uploading && (
            <button className={styles.changeBtn} onClick={() => { setFile(null); setError('') }}>
              Change File
            </button>
          )}
          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading…' : 'Upload File →'}
          </button>
        </div>
      </div>
    </div>
  )
}
