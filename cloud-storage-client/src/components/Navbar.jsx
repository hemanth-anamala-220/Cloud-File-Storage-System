import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar({ onUpload, onSearch, searchQuery }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>CloudVault</span>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.search}
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.uploadBtn} onClick={onUpload}>
          <span>+</span> Upload
        </button>
        <div className={styles.avatar} title={user?.name}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
          ⏻
        </button>
      </div>
    </header>
  )
}
