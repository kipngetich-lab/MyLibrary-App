import React, { useEffect, useState, useContext } from 'react'
import api from '../../services/api'
import { AuthContext } from '../../context/AuthContext'

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [books, setBooks] = useState([])
  const [selected, setSelected] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const [rRes, bRes] = await Promise.all([api.get('/reservations'), api.get('/books')])
      setReservations(rRes.data || [])
      setBooks(bRes.data || [])
    } catch (err) { console.error(err) }
  }

  const reserve = async () => {
    if (!selected) return
    try {
      await api.post('/reservations', { bookId: selected, userId: user._id })
      alert('Reserved')
      fetch()
      setSelected('')
    } catch (err) {
      alert('Failed to reserve')
    }
  }

  const cancel = async (id) => {
    try {
      await api.delete(`/reservations/${id}`)
      fetch()
    } catch (err) { alert('Failed') }
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Reserve a Book</h3>
        <div className="flex space-x-2">
          <select value={selected} onChange={e => setSelected(e.target.value)} className="p-2 border rounded">
            <option value="">Select Book</option>
            {books.map(b => <option key={b._id} value={b._id}>{b.title} ({b.copiesAvailable} available)</option>)}
          </select>
          <button onClick={reserve} className="px-3 py-1 bg-indigo-600 text-white rounded">Reserve</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Reservations</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Book</th>
              <th className="p-2">User</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.book?.title}</td>
                <td className="p-2">{r.user?.name}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">
                  <button onClick={() => cancel(r._id)} className="text-red-600">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}