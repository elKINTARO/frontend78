import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../../store/InventoryContext'
import { photoUrl } from '../../services/inventoryApi'
import ConfirmModal from './ConfirmModal'
import styles from './InventoryTable.module.css'

export default function InventoryTable() {
  const { items, loading, error, loadInventory, removeItem } = useInventory()
  const navigate = useNavigate()

  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { loadInventory() }, [loadInventory])

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await removeItem(deletingId)
      setDeletingId(null)
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <TableSkeleton />

  if (error) return (
    <div className={styles.stateBox}>
      <span className={styles.stateIcon}>⚠️</span>
      <p className={styles.stateTitle}>Помилка завантаження</p>
      <p className={styles.stateDesc}>{error}</p>
      <button className={`${styles.btn} ${styles.btnAccent}`} onClick={loadInventory}>
        Спробувати знову
      </button>
    </div>
  )

  if (items.length === 0) return (
    <div className={styles.stateBox}>
      <span className={styles.stateIcon}>📭</span>
      <p className={styles.stateTitle}>Список порожній</p>
      <p className={styles.stateDesc}>Додайте першу позицію інвентарю</p>
      <button className={`${styles.btn} ${styles.btnAccent}`} onClick={() => navigate('/admin/inventory/create')}>
        + Додати позицію
      </button>
    </div>
  )

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Назва</th>
              <th>Опис</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td className={styles.photoCell}>
                  <img
                    src={photoUrl(item.id)}
                    alt={item.inventory_name}
                    className={styles.thumb}
                    onError={(e) => { e.target.src = 'https://placehold.co/64x64/1b1f2b/5a6080?text=📦' }}
                  />
                </td>
                <td className={styles.nameCell}>
                  <span className={styles.name}>{item.inventory_name}</span>
                </td>
                <td className={styles.descCell}>
                  <span className={styles.desc}>{item.description || '—'}</span>
                </td>
                <td className={styles.actionsCell}>
                  <button
                    className={`${styles.actionBtn} ${styles.view}`}
                    title="Переглянути"
                    onClick={() => navigate(`/admin/inventory/${item.id}`)}
                  >
                    👁
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.edit}`}
                    title="Редагувати"
                    onClick={() => navigate(`/admin/inventory/${item.id}/edit`)}
                  >
                    ✏️
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.delete}`}
                    title="Видалити"
                    onClick={() => { setDeletingId(item.id); setDeleteError(null) }}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <ConfirmModal
          title="Видалити позицію?"
          message="Цю дію не можна скасувати. Позиція буде назавжди видалена зі складу."
          error={deleteError}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setDeletingId(null); setDeleteError(null) }}
        />
      )}
    </>
  )
}

function TableSkeleton() {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Фото</th><th>Назва</th><th>Опис</th><th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className={styles.row}>
              <td><div className={`${styles.skel} ${styles.skelPhoto}`} /></td>
              <td><div className={`${styles.skel} ${styles.skelText}`} style={{ width: '120px' }} /></td>
              <td><div className={`${styles.skel} ${styles.skelText}`} style={{ width: '220px' }} /></td>
              <td><div className={`${styles.skel} ${styles.skelText}`} style={{ width: '80px' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
