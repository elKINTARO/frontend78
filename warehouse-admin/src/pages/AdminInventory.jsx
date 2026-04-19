import PageHeader from '../components/PageHeader'
import InventoryTable from '../components/inventory/InventoryTable'
import styles from './AdminInventory.module.css'

export default function AdminInventory() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Інвентар складу"
        subtitle="Управління всіма позиціями"
        action={{ label: '+ Додати позицію', to: '/admin/inventory/create' }}
      />
      <InventoryTable />
    </div>
  )
}
