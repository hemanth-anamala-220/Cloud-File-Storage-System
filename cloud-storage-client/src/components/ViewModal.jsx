import { useState, useEffect, useRef } from 'react'
import styles from './ViewModal.module.css'

function getFileCategory(type, name) {
  const t = (type || '').toLowerCase()
  const n = (name || '').toLowerCase()
  if (t.includes('image')) return 'image'
  if (t.includes('video')) return 'video'
  if (t.includes('audio')) return 'audio'
  if (t.includes('pdf') || n.endsWith('.pdf')) return 'pdf'
  if (t.includes('text') || n.endsWith('.txt') || n.endsWith('.csv')) return 'text'
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

// ── PDF Viewer using PDF.js CDN ──────────────────────────
function PdfViewer({ url }) {
  const canvasRef  = useRef(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [pageNum, setPageNum]   = useState(1)
  const [totalPages, setTotal]  = useState(0)
  const [scale, setScale]       = useState(1.4)
  const pdfRef = useRef(null)

  // Load PDF.js from CDN dynamically
  useEffect(() => {
    let cancelled = false

    const loadPdf = async () => {
      try {
        // Inject PDF.js script if not already loaded
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        }

        const pdf = await window.pdfjsLib.getDocument(url).promise
        if (cancelled) return
        pdfRef.current = pdf
        setTotal(pdf.numPages)
        setLoading(false)
      } catch (e) {
        console.error('PDF load error:', e)
        if (!cancelled) setError(true)
      }
    }

    loadPdf()
    return () => { cancelled = true }
  }, [url])

  // Render current page
  useEffect(() => {
    if (!pdfRef.current || loading) return
    const renderPage = async () => {
      const page    = await pdfRef.current.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      const canvas  = canvasRef.current
      if (!canvas) return
      canvas.height = viewport.height
      canvas.width  = viewport.width
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    }
    renderPage()
  }, [pageNum, scale, loading])

  if (error) return (
    <div className={styles.fallback}>
      <div className={styles.fallbackIcon}>📄</div>
      <h3>Cannot Preview PDF</h3>
      <p>The file could not be rendered. Try opening in a new tab.</p>
      <a href={url} target="_blank" rel="noreferrer" className={styles.dlBtn}>↗ Open PDF</a>
    </div>
  )

  if (loading) return (
    <div className={styles.centerMsg}>
      <div className={styles.spinner}/>
      <p>Rendering PDF…</p>
    </div>
  )

  return (
    <div className={styles.pdfViewer}>
      {/* PDF Controls */}
      <div className={styles.pdfControls}>
        <button className={styles.ctrlBtn} onClick={() => setPageNum(p => Math.max(1, p - 1))} disabled={pageNum <= 1}>‹ Prev</button>
        <span className={styles.pageInfo}>Page {pageNum} of {totalPages}</span>
        <button className={styles.ctrlBtn} onClick={() => setPageNum(p => Math.min(totalPages, p + 1))} disabled={pageNum >= totalPages}>Next ›</button>
        <div className={styles.divider}/>
        <button className={styles.ctrlBtn} onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>− Zoom</button>
        <span className={styles.pageInfo}>{Math.round(scale * 100)}%</span>
        <button className={styles.ctrlBtn} onClick={() => setScale(s => Math.min(3, s + 0.2))}>+ Zoom</button>
      </div>
      {/* PDF Canvas */}
      <div className={styles.pdfCanvas}>
        <canvas ref={canvasRef} className={styles.canvas}/>
      </div>
    </div>
  )
}

// ── Text Viewer ──────────────────────────────────────────
function TextViewer({ url }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(url).then(r => r.text()).then(t => { setContent(t); setLoading(false) })
      .catch(() => { setContent('Could not load content.'); setLoading(false) })
  }, [url])
  return (
    <div className={styles.textViewer}>
      {loading
        ? <div className={styles.centerMsg}><div className={styles.spinner}/></div>
        : <pre className={styles.textContent}>{content}</pre>}
    </div>
  )
}

// ── Google Docs for DOCX/XLSX/PPTX ──────────────────────
function GoogleDocViewer({ url }) {
  const [loading, setLoading] = useState(true)
  const src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
  return (
    <div className={styles.frameContainer}>
      {loading && (
        <div className={styles.centerMsg}>
          <div className={styles.spinner}/>
          <p>Loading document…</p>
        </div>
      )}
      <iframe
        src={src}
        className={styles.fullFrame}
        style={{ opacity: loading ? 0 : 1 }}
        onLoad={() => setLoading(false)}
        title="doc-viewer"
      />
    </div>
  )
}

// ── Main Modal ───────────────────────────────────────────
export default function ViewModal({ file, onClose, onDownload }) {
  const category = getFileCategory(file.fileType, file.fileName)

  const renderPreview = () => {
    switch (category) {
      case 'image':
        return (
          <div className={styles.imgWrap}>
            <img src={file.fileUrl} alt={file.fileName} className={styles.image} />
          </div>
        )
      case 'video':
        return (
          <div className={styles.imgWrap} style={{ background: '#000' }}>
            <video controls autoPlay className={styles.video} src={file.fileUrl} />
          </div>
        )
      case 'audio':
        return (
          <div className={styles.audioWrap}>
            <div className={styles.audioIcon}>🎵</div>
            <p className={styles.audioName}>{file.fileName}</p>
            <audio controls autoPlay className={styles.audio} src={file.fileUrl} />
          </div>
        )
      case 'pdf':
        return <PdfViewer url={file.fileUrl} />
      case 'word':
      case 'excel':
      case 'ppt':
        return <GoogleDocViewer url={file.fileUrl} />
      case 'text':
        return <TextViewer url={file.fileUrl} />
      default:
        return (
          <div className={styles.fallback}>
            <div className={styles.fallbackIcon}>📁</div>
            <h3>No Preview Available</h3>
            <p>This file type cannot be previewed in the browser.</p>
            <div className={styles.fallbackBtns}>
              <button className={styles.dlBtn} onClick={onDownload}>↓ Download</button>
              <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.openTabBtn}>↗ Open in New Tab</a>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <p className={styles.fileName} title={file.fileName}>{file.fileName}</p>
            <p className={styles.fileMeta}>{formatSize(file.fileSize)} · {file.fileType || 'Unknown'}</p>
          </div>
          <div className={styles.headerActions}>
            <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.newTabBtn}>↗ New Tab</a>
            <button className={styles.downloadBtn} onClick={onDownload}>↓ Download</button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>
        <div className={styles.body}>
          {renderPreview()}
        </div>
      </div>
    </div>
  )
}