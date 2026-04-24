import { useState, useEffect } from 'react'
import { fetchInventory } from '../services/inventoryApi'
import { useFavorites } from '../hooks/useFavorites'
import InventoryGallery from '../components/gallery/InventoryGallery'
import InventoryQuickView from '../components/gallery/InventoryQuickView'
import styles from './Gallery.module.css'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetchInventory()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Галерея інвентарю</h1>
      <InventoryGallery
        items={items}
        loading={loading}
        error={error}
        onItemClick={setSelectedItem}
      />
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
