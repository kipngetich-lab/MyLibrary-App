import React, { useContext, useState } from 'react'
import { useHistory, Redirect, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const { login, user } = useContext(AuthContext)
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  if (user) return <Redirect to="/dashboard" />

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({ email, password, rememberMe })
      history.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Login</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Remember me</span>
          </label>
          <Link
            to="/register"
            className="text-sm text-indigo-600 hover:underline"
          >
            Register
          </Link>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}