import { useNavigate } from 'react-router-dom'
import styles from './PageHeader.module.css'

export default function PageHeader({ title, subtitle, backTo, action }) {
  const navigate = useNavigate()

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {backTo && (
          <button className={styles.backBtn} onClick={() => navigate(backTo)}>
            ← Назад
          </button>
        )}
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      {action && (
        <button
          className={styles.actionBtn}
          onClick={action.onClick || (() => navigate(action.to))}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
