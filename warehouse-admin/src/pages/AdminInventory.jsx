import PageHeader from '../components/PageHeader'
import InventoryTable from '../components/inventory/InventoryTable'
import { useInventory } from '../store/InventoryContext'
import styles from './AdminInventory.module.css'

export default function AdminInventory() {
  const { items } = useInventory()

  return (
    <div className={styles.page}>
      <PageHeader
        title="Інвентар складу"
        subtitle="Управління всіма позиціями"
        action={{ label: '+ Додати позицію', to: '/admin/inventory/create' }}
      />

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{items.length}</div>
          <div className={styles.statLabel}>Позицій на складі</div>
        </div>
      </div>

      <InventoryTable />
    </div>
  )
}
