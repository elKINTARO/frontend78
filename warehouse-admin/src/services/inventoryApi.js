import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({ baseURL: BASE_URL })

// ── Interceptors ──────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Невідома помилка'
    return Promise.reject(new Error(message))
  }
)

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /inventory — all items */
export const fetchInventory = () =>
  api.get('/inventory').then((r) => r.data)

/** GET /inventory/:id — single item */
export const fetchInventoryById = (id) =>
  api.get(`/inventory/${id}`).then((r) => r.data)

/** POST /register — create item (multipart/form-data) */
export const createInventory = (formData) =>
  api.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)

/** PUT /inventory/:id — update text fields (JSON) */
export const updateInventory = (id, payload) =>
  api.put(`/inventory/${id}`, payload).then((r) => r.data)

/** PUT /inventory/:id/photo — update photo (multipart/form-data) */
export const updateInventoryPhoto = (id, formData) =>
  api.put(`/inventory/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)

/** DELETE /inventory/:id */
export const deleteInventory = (id) =>
  api.delete(`/inventory/${id}`).then((r) => r.data)

/** Helper: photo URL for an item */
export const photoUrl = (id) => `${BASE_URL}/inventory/${id}/photo`
