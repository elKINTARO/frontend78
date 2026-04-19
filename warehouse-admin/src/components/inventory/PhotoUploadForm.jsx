import { useState, useRef } from 'react'
import styles from './PhotoUploadForm.module.css'

export default function PhotoUploadForm({
  onSubmit,
  loading = false,
  error = null,
  label = 'Завантажити фото',
}) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleChange = (e) => handleFile(e.target.files[0])
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    const fd = new FormData()
    fd.append('photo', file)
    await onSubmit(fd)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.sectionLabel}>{label}</p>

      {error && <div className={styles.apiError}><span>⚠️</span> {error}</div>}

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {preview
          ? <img src={preview} className={styles.preview} alt="preview" />
          : (
            <div className={styles.placeholder}>
              <span className={styles.uploadIcon}>🖼</span>
              <p>Перетягніть зображення або <span className={styles.link}>оберіть файл</span></p>
              <p className={styles.hint}>PNG, JPG, WEBP · до 10 МБ</p>
            </div>
          )
        }
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleChange}
      />

      {file && (
        <p className={styles.fileName}>📎 {file.name}</p>
      )}

      <button
        type="submit"
        className={`${styles.btn} ${(!file || loading) ? styles.disabled : ''}`}
        disabled={!file || loading}
      >
        {loading ? <span className={styles.spinner} /> : 'Завантажити'}
      </button>
    </form>
  )
}
