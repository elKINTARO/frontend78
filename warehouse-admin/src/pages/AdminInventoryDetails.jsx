import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchInventoryById, photoUrl } from '../services/inventoryApi'
import PageHeader from '../components/PageHeader'
import styles from './AdminInventoryDetails.module.css'

export default function AdminInventoryDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchInventoryById(id)
        setItem(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className={styles.page}>
      <PageHeader title="Деталі позиції" backTo="/admin/inventory" />
      <div className={styles.card}>
        <div className={styles.skelImg} />
        <div className={styles.cardBody}>
          {[220, 160, 300, 260].map((w, i) => (
            <div key={i} className={styles.skelLine} style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className={styles.page}>
      <PageHeader title="Деталі позиції" backTo="/admin/inventory" />
      <div className={styles.errorBox}><span>⚠️</span> {error}</div>
    </div>
  )

  return (
    <div className={styles.page}>
      <PageHeader
        title={item.inventory_name}
        subtitle={`ID: ${id}`}
        backTo="/admin/inventory"
        action={{ label: '✏️ Редагувати', to: `/admin/inventory/${id}/edit` }}
      />

      <div className={styles.card}>
        {/* Photo */}
        <div className={styles.imageWrap}>
          {imgError
            ? (
              <div className={styles.imageFallback}>
                <span>📦</span>
                <p>Фото недоступне</p>
              </div>
            )
            : (
              <img
                src={photoUrl(id)}
                alt={item.inventory_name}
                className={styles.image}
                onError={() => setImgError(true)}
              />
            )
          }
        </div>

        {/* Info */}
        <div className={styles.cardBody}>
          <div className={styles.metaRow}>
            <span className={styles.badge}>#{id}</span>
          </div>

          <h2 className={styles.name}>{item.inventory_name}</h2>

          <div className={styles.divider} />

          <div className={styles.descSection}>
            <p className={styles.descLabel}>Опис</p>
            <p className={styles.desc}>
              {item.description || <span className={styles.noDesc}>Опис не вказано</span>}
            </p>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/admin/inventory/${id}/edit`)}
            >
              ✏️ Редагувати
            </button>
            <button
              className={styles.backBtn}
              onClick={() => navigate('/admin/inventory')}
            >
              ← До списку
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
