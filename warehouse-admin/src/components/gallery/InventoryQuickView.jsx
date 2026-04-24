import { useEffect } from 'react'
import { photoUrl } from '../../services/inventoryApi'
import styles from './InventoryQuickView.module.css'

export default function InventoryQuickView({ item, onClose, isFavorite, onToggleFavorite }) {
  const favorite = isFavorite(item.id)

  // Закриття по Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Блокуємо скрол body поки модалка відкрита
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрити">✕</button>

        <div className={styles.imageWrap}>
          <img
            src={photoUrl(item.id)}
            alt={item.inventory_name}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{item.inventory_name}</h2>

          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}

          <div className={styles.meta}>
            {item.quantity !== undefined && (
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Кількість</span>
                <span className={styles.metaValue}>{item.quantity}</span>
              </span>
            )}
            {item.category && (
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Категорія</span>
                <span className={styles.metaValue}>{item.category}</span>
              </span>
            )}
          </div>

          <button
            className={`${styles.favBtn} ${favorite ? styles.favActive : ''}`}
            onClick={() => onToggleFavorite(item.id)}
          >
            {favorite ? '♥ Видалити з улюблених' : '♡ Додати в улюблені'}
          </button>
        </div>
      </div>
    </div>
  )
}
