import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function Opac() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      api.get(`/opac/search?q=${encodeURIComponent(query)}`).then(res => setResults(res.data || [])).catch(() => setResults([]))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Public Catalog (OPAC)</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, author, subject..." className="w-full p-2 border rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {results.map(r => (
          <div key={r._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gray-500">{r.author}</div>
              </div>
              <div className="text-sm">{r.copiesAvailable} available</div>
            </div>
            <div className="mt-2">
              <Link to={`/books/${r._id}`} className="text-indigo-600">View details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}