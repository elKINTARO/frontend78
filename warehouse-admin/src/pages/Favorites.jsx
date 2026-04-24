import { useState, useEffect } from 'react'
import { fetchInventory } from '../services/inventoryApi'
import { useFavorites } from '../hooks/useFavorites'
import InventoryGallery from '../components/gallery/InventoryGallery'
import InventoryQuickView from '../components/gallery/InventoryQuickView'
import styles from './Gallery.module.css'

export default function Favorites() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetchInventory()
      .then(setAllItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const favoriteItems = allItems.filter((item) => favorites.includes(item.id))

  const emptyState = !loading && !error && favoriteItems.length === 0

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Улюблені</h1>

      {emptyState ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>❤️</span>
          <p className={styles.emptyTitle}>Ви ще нічого не додали</p>
          <p className={styles.emptyText}>
            Натисніть ♡ на будь-якому товарі в Галереї, щоб зберегти його тут
          </p>
        </div>
      ) : (
        <InventoryGallery
          items={favoriteItems}
          loading={loading}
          error={error}
          onItemClick={setSelectedItem}
        />
      )}

      {selectedItem && (
        <InventoryQuickView
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}
