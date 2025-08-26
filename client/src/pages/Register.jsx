import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const { register } = useContext(AuthContext)
  const history = useHistory()
  const [payload, setPayload] = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(payload)
      history.push('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Register</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
      <form onSubmit={handle} className="space-y-3">
        <input required placeholder="Name" value={payload.name} onChange={e => setPayload(p => ({...p, name: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input required placeholder="Email" value={payload.email} onChange={e => setPayload(p => ({...p, email: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input required type="password" placeholder="Password" value={payload.password} onChange={e => setPayload(p => ({...p, password: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700" />
        <select value={payload.role} onChange={e => setPayload(p => ({...p, role: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700">
          <option value="member" className="text-gray-700 dark:text-gray-200">Member</option>
          <option value="librarian" className="text-gray-700 dark:text-gray-200">Librarian</option>
          <option value="admin" className="text-gray-700 dark:text-gray-200">Admin</option>
        </select>
        <div>
          <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Registering...' : 'Register'}</button>
        </div>
      </form>
    </div>
  )
}