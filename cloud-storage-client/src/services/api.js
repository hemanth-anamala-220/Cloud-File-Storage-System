import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth ───────────────────────────────────────────────
export const signup = (data) => api.post('/auth/signup', data)
export const login  = (data) => api.post('/auth/login', data)
export const getProfile = () => api.get('/auth/profile')

// ─── Files ──────────────────────────────────────────────
export const uploadFile   = (formData) => api.post('/files/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const getFiles     = (params) => api.get('/files', { params })
export const deleteFile   = (id) => api.delete(`/files/${id}`)
export const downloadFile = (id) => api.get(`/files/download/${id}`, { responseType: 'blob' })

// ─── Folders ─────────────────────────────────────────────
export const getFolders    = () => api.get('/folders')
export const createFolder  = (data) => api.post('/folders', data)
export const deleteFolder  = (id) => api.delete(`/folders/${id}`)

export default api
