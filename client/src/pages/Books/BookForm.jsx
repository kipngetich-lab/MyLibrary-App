import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useHistory, useParams } from 'react-router-dom'

export default function BookForm() {
  const { id } = useParams()
  const edit = Boolean(id)
  const history = useHistory()
  const [book, setBook] = useState({
    title: '', author: '', isbn: '', category: '', copies: 1, location: '', branches: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (edit) {
      api.get(`/books/${id}`).then(res => setBook(res.data)).catch(err => console.error(err))
    }
  }, [edit, id])

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (edit) {
        await api.put(`/books/${id}`, book)
      } else {
        await api.post('/books', book)
      }
      history.push('/books')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{edit ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={save} className="space-y-3">
        <input required placeholder="Title" value={book.title} onChange={e => setBook({...book, title: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input placeholder="Author" value={book.author} onChange={e => setBook({...book, author: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input placeholder="ISBN" value={book.isbn} onChange={e => setBook({...book, isbn: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input placeholder="Category" value={book.category} onChange={e => setBook({...book, category: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input type="number" min="0" placeholder="Copies" value={book.copies} onChange={e => setBook({...book, copies: Number(e.target.value)})} className="w-full p-2 border rounded dark:bg-gray-700" />
        <input placeholder="Location (shelf)" value={book.location} onChange={e => setBook({...book, location: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" />
        <div className="flex items-center space-x-2">
          <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => history.goBack()} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}