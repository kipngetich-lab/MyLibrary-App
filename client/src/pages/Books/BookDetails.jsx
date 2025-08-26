import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useParams, Link } from 'react-router-dom'

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    api.get(`/books/${id}`).then(res => setBook(res.data)).catch(err => console.error(err))
  }, [id])

  if (!book) return <div>Loading...</div>

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <div className="text-sm text-gray-500">{book.author} — {book.isbn}</div>
        </div>
        <div className="text-sm">
          <Link to={`/books/edit/${book._id}`} className="text-indigo-600">Edit</Link>
        </div>
      </div>

      <div className="mt-4">
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>Location:</strong> {book.location}</p>
        <p><strong>Copies:</strong> {book.copies} ({book.copiesAvailable} available)</p>
        <p className="mt-2">{book.description}</p>
      </div>
    </div>
  )
}