import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { InventoryProvider } from './store/InventoryContext'
import AdminInventory from './pages/AdminInventory'
import AdminInventoryCreate from './pages/AdminInventoryCreate'
import AdminInventoryEdit from './pages/AdminInventoryEdit'
import AdminInventoryDetails from './pages/AdminInventoryDetails'
import Layout from './components/Layout'

export default function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/admin/inventory" replace />} />
            <Route path="admin/inventory" element={<AdminInventory />} />
            <Route path="admin/inventory/create" element={<AdminInventoryCreate />} />
            <Route path="admin/inventory/:id/edit" element={<AdminInventoryEdit />} />
            <Route path="admin/inventory/:id" element={<AdminInventoryDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </InventoryProvider>
  )
}
