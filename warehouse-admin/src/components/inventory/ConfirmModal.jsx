import styles from './ConfirmModal.module.css'

export default function ConfirmModal({
  title = 'Підтвердження',
  message,
  onConfirm,
  onCancel,
  loading = false,
  error = null,
}) {
  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className={styles.modal}>
        <div className={styles.icon}>🗑️</div>
        <h3 className={styles.title}>{title}</h3>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>⚠️ {error}</p>}

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} disabled={loading}>
            Скасувати
          </button>
          <button className={styles.confirm} onClick={onConfirm} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Видалити'}
          </button>
        </div>
      </div>
    </div>
  )
}
