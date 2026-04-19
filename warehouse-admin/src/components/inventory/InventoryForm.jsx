import { useState } from 'react'
import styles from './InventoryForm.module.css'

export default function InventoryForm({
  initialValues = { inventory_name: '', description: '' },
  onSubmit,
  submitLabel = 'Зберегти',
  loading = false,
  error = null,
}) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})

  const errors = {}
  if (!values.inventory_name.trim()) errors.inventory_name = "Назва обов'язкова"

  const isValid = Object.keys(errors).length === 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ inventory_name: true, description: true })
    if (!isValid) return
    await onSubmit(values)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <div className={styles.apiError}><span>⚠️</span> {error}</div>}

      <div className={styles.field}>
        <label className={styles.label}>
          Назва <span className={styles.required}>*</span>
        </label>
        <input
          className={`${styles.input} ${touched.inventory_name && errors.inventory_name ? styles.inputError : ''}`}
          type="text"
          name="inventory_name"
          placeholder="Введіть назву позиції"
          value={values.inventory_name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          autoComplete="off"
        />
        {touched.inventory_name && errors.inventory_name && (
          <p className={styles.fieldError}>{errors.inventory_name}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Опис</label>
        <textarea
          className={styles.textarea}
          name="description"
          placeholder="Опис позиції (необов'язково)"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          rows={4}
        />
      </div>

      <button
        type="submit"
        className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
        disabled={loading}
      >
        {loading ? <span className={styles.spinner} /> : submitLabel}
      </button>
    </form>
  )
}
