import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get('/books')
      setBooks(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this book?')) return
    try {
      await api.delete(`/books/${id}`)
      setBooks(b => b.filter(x => x._id !== id))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const filtered = books.filter(b => {
    if (!q) return true
    const s = q.toLowerCase()
    return (b.title + ' ' + (b.author || '') + ' ' + (b.isbn || '') + ' ' + (b.category || '')).toLowerCase().includes(s)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Books</h2>
        <div className="flex items-center space-x-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search client-side..." className="p-2 border rounded" />
          <Link to="/books/new" className="px-3 py-1 bg-indigo-600 text-white rounded">Add Book</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        {loading ? <div>Loading...</div> : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Author</th>
                <th className="p-2">ISBN</th>
                <th className="p-2">Category</th>
                <th className="p-2">Copies</th>
                <th className="p-2">Location</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id} className="border-t">
                  <td className="p-2"><Link to={`/books/${b._id}`} className="font-medium">{b.title}</Link></td>
                  <td className="p-2">{b.author}</td>
                  <td className="p-2">{b.isbn}</td>
                  <td className="p-2">{b.category}</td>
                  <td className="p-2">{b.copies || 0} ({(b.copiesAvailable != null) ? b.copiesAvailable : '—'} available)</td>
                  <td className="p-2">{b.location || '—'}</td>
                  <td className="p-2 space-x-2">
                    <Link to={`/books/edit/${b._id}`} className="text-indigo-600">Edit</Link>
                    <button onClick={() => remove(b._id)} className="text-red-600">Delete</button>
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