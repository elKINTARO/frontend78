import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import InventoryForm from '../components/inventory/InventoryForm'
import { createInventory } from '../services/inventoryApi'
import styles from './FormPage.module.css'

export default function AdminInventoryCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoDrag, setPhotoDrag] = useState(false)

  const handlePhotoChange = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('inventory_name', values.inventory_name)
      fd.append('description', values.description)
      if (photoFile) fd.append('photo', photoFile)
      await createInventory(fd)
      navigate('/admin/inventory')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Нова позиція"
        subtitle="Заповніть дані для додавання до складу"
        backTo="/admin/inventory"
      />

      <div className={styles.card}>
        <div className={styles.cardBody}>
          {/* Photo section */}
          <div className={styles.photoSection}>
            <p className={styles.fieldLabel}>Фото <span className={styles.optional}>(необов'язково)</span></p>
            <div
              className={`${styles.dropzone} ${photoDrag ? styles.drag : ''}`}
              onClick={() => document.getElementById('create-photo-input').click()}
              onDragOver={(e) => { e.preventDefault(); setPhotoDrag(true) }}
              onDragLeave={() => setPhotoDrag(false)}
              onDrop={(e) => { e.preventDefault(); setPhotoDrag(false); handlePhotoChange(e.dataTransfer.files[0]) }}
            >
              {photoPreview
                ? <img src={photoPreview} className={styles.photoPreview} alt="preview" />
                : (
                  <div className={styles.dropPlaceholder}>
                    <span className={styles.dropIcon}>🖼</span>
                    <p>Перетягніть або <span className={styles.link}>оберіть файл</span></p>
                    <p className={styles.hint}>PNG, JPG, WEBP · до 10 МБ</p>
                  </div>
                )
              }
            </div>
            <input
              id="create-photo-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handlePhotoChange(e.target.files[0])}
            />
            {photoFile && <p className={styles.fileName}>📎 {photoFile.name}</p>}
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Text fields */}
          <InventoryForm
            onSubmit={handleSubmit}
            submitLabel="Створити позицію"
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
