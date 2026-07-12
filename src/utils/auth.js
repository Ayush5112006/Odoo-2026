export const AUTH_KEY = 'transitops_auth'

export const storeAuth = (authData, remember = false) => {
  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(AUTH_KEY, JSON.stringify(authData))
}

export const getStoredAuth = () => {
  const sessionData = window.sessionStorage.getItem(AUTH_KEY)
  const localData = window.localStorage.getItem(AUTH_KEY)
  return JSON.parse(sessionData || localData || 'null')
}

export const clearAuth = () => {
  window.sessionStorage.removeItem(AUTH_KEY)
  window.localStorage.removeItem(AUTH_KEY)
}

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
