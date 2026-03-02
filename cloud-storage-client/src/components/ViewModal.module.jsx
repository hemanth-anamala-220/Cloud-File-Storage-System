import { useState } from 'react'
import styles from './ViewModal.module.css'

function getFileCategory(type, name) {
  if (!type && !name) return 'other'
  const t = (type || '').toLowerCase()
  const n = (name || '').toLowerCase()
  if (t.includes('image')) return 'image'
  if (t.includes('video')) return 'video'
  if (t.includes('audio')) return 'audio'
  if (t.includes('pdf') || n.endsWith('.pdf')) return 'pdf'
  if (t.includes('text') || n.endsWith('.txt')) return 'text'
  if (n.endsWith('.doc') || n.endsWith('.docx')) return 'word'
  if (n.endsWith('.xls') || n.endsWith('.xlsx')) return 'excel'
  if (n.endsWith('.ppt') || n.endsWith('.pptx')) return 'ppt'
  return 'other'
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function ViewModal({ file, onClose, onDownload }) {
  const [iframeError, setIframeError] = useState(false)
  const category = getFileCategory(file.fileType, file.fileName)

  // Google Docs viewer URL — works for PDF, DOCX, XLSX, PPTX
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(file.fileUrl)}&embedded=true`

  const renderPreview = () => {
    switch (category) {

      case 'image':
        return (
          <div className={styles.previewWrap}>
            <img src={file.fileUrl} alt={file.fileName} className={styles.image} />
          </div>
        )

      case 'video':
        return (
          <div className={styles.previewWrap}>
            <video controls className={styles.video} src={file.fileUrl}>
              Your browser does not support video.
            </video>
          </div>
        )

      case 'audio':
        return (
          <div className={styles.audioWrap}>
            <div className={styles.audioIcon}>🎵</div>
            <p className={styles.audioName}>{file.fileName}</p>
            <audio controls className={styles.audio} src={file.fileUrl} />
          </div>
        )

      case 'pdf':
        return (
          <div className={styles.docWrap}>
            {!iframeError ? (
              <>
                <div className={styles.docToolbar}>
                  <span className={styles.docBadge}>📄 PDF Document</span>
                  <div className={styles.docToolbarActions}>
                    <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.openBtn}>
                      ↗ Open in new tab
                    </a>
                  </div>
                </div>
                <iframe
                  src={googleViewerUrl}
                  className={styles.docFrame}
                  title={file.fileName}
                  onError={() => setIframeError(true)}
                />
              </>
            ) : (
              <FallbackView file={file} onDownload={onDownload} icon="📄" label="PDF" />
            )}
          </div>
        )

      case 'word':
        return (
          <div className={styles.docWrap}>
            <div className={styles.docToolbar}>
              <span className={styles.docBadge}>📝 Word Document</span>
              <div className={styles.docToolbarActions}>
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.openBtn}>
                  ↗ Open in new tab
                </a>
              </div>
            </div>
            <iframe
              src={googleViewerUrl}
              className={styles.docFrame}
              title={file.fileName}
            />
          </div>
        )

      case 'excel':
        return (
          <div className={styles.docWrap}>
            <div className={styles.docToolbar}>
              <span className={styles.docBadge}>📊 Excel Spreadsheet</span>
              <div className={styles.docToolbarActions}>
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.openBtn}>
                  ↗ Open in new tab
                </a>
              </div>
            </div>
            <iframe
              src={googleViewerUrl}
              className={styles.docFrame}
              title={file.fileName}
            />
          </div>
        )

      case 'ppt':
        return (
          <div className={styles.docWrap}>
            <div className={styles.docToolbar}>
              <span className={styles.docBadge}>📊 PowerPoint</span>
              <div className={styles.docToolbarActions}>
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.openBtn}>
                  ↗ Open in new tab
                </a>
              </div>
            </div>
            <iframe
              src={googleViewerUrl}
              className={styles.docFrame}
              title={file.fileName}
            />
          </div>
        )

      case 'text':
        return (
          <div className={styles.docWrap}>
            <div className={styles.docToolbar}>
              <span className={styles.docBadge}>📃 Text File</span>
            </div>
            <iframe
              src={file.fileUrl}
              className={styles.docFrame}
              title={file.fileName}
            />
          </div>
        )

      default:
        return <FallbackView file={file} onDownload={onDownload} icon="📁" label="File" />
    }
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <p className={styles.fileName} title={file.fileName}>{file.fileName}</p>
            <p className={styles.fileMeta}>{formatSize(file.fileSize)} · {file.fileType || 'Unknown type'}</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.downloadBtn} onClick={onDownload}>↓ Download</button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Preview body */}
        <div className={styles.body}>
          {renderPreview()}
        </div>

      </div>
    </div>
  )
}

// Fallback when preview not possible
function FallbackView({ file, onDownload, icon, label }) {
  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackIcon}>{icon}</div>
      <h3 className={styles.fallbackTitle}>{label} Preview Unavailable</h3>
      <p className={styles.fallbackSub}>This file cannot be previewed in the browser.</p>
      <div className={styles.fallbackActions}>
        <button className={styles.fallbackDownload} onClick={onDownload}>↓ Download File</button>
        <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.fallbackOpen}>
          ↗ Open in New Tab
        </a>
      </div>
    </div>
  )
}