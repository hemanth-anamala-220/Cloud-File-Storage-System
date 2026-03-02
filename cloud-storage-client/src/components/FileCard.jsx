import { useState } from 'react'
import { downloadFile, deleteFile } from '../services/api'
import ViewModal from './ViewModal'
import styles from './FileCard.module.css'

const ICONS = {
  image:   { icon: '🖼', bg: 'rgba(67,233,123,0.12)' },
  video:   { icon: '🎬', bg: 'rgba(249,202,36,0.12)' },
  audio:   { icon: '🎵', bg: 'rgba(108,99,255,0.12)' },
  pdf:     { icon: '📄', bg: 'rgba(255,101,132,0.12)' },
  default: { icon: '📁', bg: 'rgba(116,185,255,0.12)' },
}

function getFileStyle(type) {
  if (!type) return ICONS.default
  if (type.includes('image')) return ICONS.image
  if (type.includes('video')) return ICONS.video
  if (type.includes('audio')) return ICONS.audio
  if (type.includes('pdf'))   return ICONS.pdf
  return ICONS.default
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024)        return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function FileCard({ file, onDelete }) {
  const [showView, setShowView] = useState(false)
  const { icon, bg } = getFileStyle(file.fileType)

  const handleDownload = async (e) => {
    e && e.stopPropagation()
    try {
      const res = await downloadFile(file._id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href    = url
      a.download = file.fileName
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      window.open(file.fileUrl, '_blank')
    }
  }

  const handleDelete = async (e) => {
    e && e.stopPropagation()
    if (!window.confirm(`Delete "${file.fileName}"?`)) return
    try {
      await deleteFile(file._id)
      onDelete(file._id)
    } catch {
      alert('Delete failed.')
    }
  }

  const handleView = (e) => {
    e && e.stopPropagation()
    setShowView(true)
  }

  return (
    <>
      <div className={styles.card}>
        {/* Icon — click to view */}
        <div className={styles.iconWrap} style={{ background: bg }} onClick={handleView}>
          <span className={styles.icon}>{icon}</span>
          <div className={styles.viewHover}>👁 View</div>
        </div>

        {/* File info — click to view */}
        <div className={styles.info} onClick={handleView}>
          <p className={styles.name} title={file.fileName}>{file.fileName}</p>
          <p className={styles.meta}>{formatSize(file.fileSize)} · {formatDate(file.createdAt)}</p>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            title="View"
            onClick={handleView}
          >👁</button>

          <button
            className={styles.actionBtn}
            title="Download"
            onClick={handleDownload}
          >↓</button>

          <button
            className={`${styles.actionBtn} ${styles.del}`}
            title="Delete"
            onClick={handleDelete}
          >✕</button>
        </div>
      </div>

      {showView && (
        <ViewModal
          file={file}
          onClose={() => setShowView(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  )
}