import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role })
      setUsers(u => u.map(x => x._id === id ? { ...x, role } : x))
    } catch (err) {
      alert('Failed')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">User Management</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        {loading ? <div>Loading...</div> : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={e => changeRole(u._id, e.target.value)} className="p-1 border rounded">
                      <option value="member">member</option>
                      <option value="librarian">librarian</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}