import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../services/api'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Signup() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser }       = useAuth()
  const navigate            = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await signup({ name: form.name, email: form.email, password: form.password })
      loginUser(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>CloudVault</span>
        </div>
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Your personal cloud storage</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="John Doe" value={form.name} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" name="password" required placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Confirm Password</label>
            <input type="password" name="confirm" required placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating…' : 'Create Account →'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
