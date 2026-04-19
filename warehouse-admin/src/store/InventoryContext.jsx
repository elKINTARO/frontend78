import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchInventory, deleteInventory as apiDelete } from '../services/inventoryApi'

// ── State shape ───────────────────────────────────────────────────────────────
const initialState = {
  items: [],
  loading: false,
  error: null,
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) }
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const loadInventory = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await fetchInventory()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message })
    }
  }, [])

  const removeItem = useCallback(async (id) => {
    await apiDelete(id)
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  return (
    <InventoryContext.Provider value={{ ...state, loadInventory, removeItem }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider')
  return ctx
}
