import { getStoredAuth } from '../utils/auth.js'

const baseURL = import.meta.env.VITE_API_URL || '/api'


const request = async (path, options = {}) => {
  const auth = getStoredAuth()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`
  }

  const response = await fetch(`${baseURL}${path}`, {
    ...options,
    headers,
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'Request failed')
    error.response = { data, status: response.status }
    throw error
  }

  return { data }
}

const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
}

export default api
