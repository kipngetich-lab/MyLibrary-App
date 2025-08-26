import React, { createContext, useEffect, useState } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (credentials) => {
    // API should return { user, token }
    const res = await api.post('/auth/login', credentials)
    const { user: u, token: t } = res.data
    setUser(u)
    setToken(t)
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    return u
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}