import { photoUrl } from '../../services/inventoryApi'
import { useFavorites } from '../../hooks/useFavorites'
import styles from './InventoryCard.module.css'

export default function InventoryCard({ item, onClick }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(item.id)

  const handleFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(item.id)
  }

  return (
    <article className={styles.card} onClick={() => onClick(item)}>
      <div className={styles.imageWrap}>
        <img
          src={photoUrl(item.id)}
          alt={item.inventory_name}
          className={styles.image}
          onError={(e) => { e.currentTarget.src = '' }}
        />
        <button
          className={`${styles.favBtn} ${favorite ? styles.favActive : ''}`}
          onClick={handleFavorite}
          aria-label={favorite ? 'Видалити з улюблених' : 'Додати в улюблені'}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{item.inventory_name}</p>
      </div>
    </article>
  )
}
