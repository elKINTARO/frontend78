import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import InventoryForm from '../components/inventory/InventoryForm'
import PhotoUploadForm from '../components/inventory/PhotoUploadForm'
import {
  fetchInventoryById,
  updateInventory,
  updateInventoryPhoto,
} from '../services/inventoryApi'
import styles from './FormPage.module.css'
import editStyles from './AdminInventoryEdit.module.css'

export default function AdminInventoryEdit() {
  const { id } = useParams()

  // Item state
  const [item, setItem] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  // Text update state
  const [textLoading, setTextLoading] = useState(false)
  const [textError, setTextError] = useState(null)
  const [textSuccess, setTextSuccess] = useState(false)

  // Photo update state
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState(null)
  const [photoSuccess, setPhotoSuccess] = useState(false)

  useEffect(() => {
    const load = async () => {
      setFetchLoading(true)
      setFetchError(null)
      try {
        const data = await fetchInventoryById(id)
        setItem(data)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setFetchLoading(false)
      }
    }
    load()
  }, [id])

  const handleTextSubmit = async (values) => {
    setTextLoading(true)
    setTextError(null)
    setTextSuccess(false)
    try {
      await updateInventory(id, values)
      setTextSuccess(true)
      setTimeout(() => setTextSuccess(false), 3000)
    } catch (err) {
      setTextError(err.message)
    } finally {
      setTextLoading(false)
    }
  }

  const handlePhotoSubmit = async (formData) => {
    setPhotoLoading(true)
    setPhotoError(null)
    setPhotoSuccess(false)
    try {
      await updateInventoryPhoto(id, formData)
      setPhotoSuccess(true)
      setTimeout(() => setPhotoSuccess(false), 3000)
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setPhotoLoading(false)
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────
  if (fetchLoading) return (
    <div className={styles.page}>
      <PageHeader title="Редагування" backTo="/admin/inventory" />
      <div className={editStyles.skeletonCard}>
        {[200, 140, 100].map((w, i) => (
          <div key={i} className={editStyles.skelLine} style={{ width: w }} />
        ))}
      </div>
    </div>
  )

  if (fetchError) return (
    <div className={styles.page}>
      <PageHeader title="Редагування" backTo="/admin/inventory" />
      <div className={editStyles.errorBox}>
        <span>⚠️</span> {fetchError}
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Редагування: ${item.inventory_name}`}
        subtitle={`ID: ${id}`}
        backTo={`/admin/inventory/${id}`}
      />

      <div className={styles.card}>
        <div className={styles.cardBody}>

          {/* ── Section 1: Text fields ── */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>📝 Текстові дані</p>
            {textSuccess && (
              <div className={styles.toast}>✅ Дані успішно оновлено!</div>
            )}
            <InventoryForm
              initialValues={{
                inventory_name: item.inventory_name || '',
                description: item.description || '',
              }}
              onSubmit={handleTextSubmit}
              submitLabel="Оновити дані"
              loading={textLoading}
              error={textError}
            />
          </div>

          <div className={styles.divider} />

          {/* ── Section 2: Photo ── */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>🖼 Фотографія</p>
            {photoSuccess && (
              <div className={styles.toast}>✅ Фото успішно оновлено!</div>
            )}
            <PhotoUploadForm
              onSubmit={handlePhotoSubmit}
              loading={photoLoading}
              error={photoError}
              label="Завантажити нове фото"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
