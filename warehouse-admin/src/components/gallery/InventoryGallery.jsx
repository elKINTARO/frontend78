import InventoryCard from './InventoryCard'
import styles from './InventoryGallery.module.css'

function SkeletonCard() {
  return <div className={styles.skeleton} />
}

export default function InventoryGallery({ items, loading, error, onItemClick }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.state}>
        <span className={styles.stateIcon}>⚠️</span>
        <p className={styles.stateTitle}>Помилка завантаження</p>
        <p className={styles.stateText}>{error}</p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className={styles.state}>
        <span className={styles.stateIcon}>📦</span>
        <p className={styles.stateTitle}>Нічого не знайдено</p>
        <p className={styles.stateText}>Список інвентарю порожній</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  )
}
