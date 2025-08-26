import React, { useState, useEffect } from 'react'
import api from '../services/api'
import useDebounce from '../utils/useDebounce'

export default function RealTimeSearch({ onSelect }) {
  const [q, setQ] = useState('')
  const debounced = useDebounce(q, 300)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!debounced) {
      setResults([])
      return
    }

    let mounted = true

    const fetchResults = async () => {
      try {
        const res = await api.get(`/books/search?q=${encodeURIComponent(debounced)}`)
        if (mounted) setResults(res.data || [])
      } catch (err) {
        if (mounted) setResults([])
      }
    }

    fetchResults()

    return () => {
      mounted = false
    }
  }, [debounced])

  return (
    <div className="relative">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        className="w-full p-2 rounded border"
        placeholder="Search by title, author, ISBN..."
      />
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded shadow max-h-64 overflow-auto z-50">
          {results.map(r => (
            <li
              key={r._id}
              onClick={() => {
                onSelect && onSelect(r)
                setQ('')
                setResults([])
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-gray-500">{r.author} — {r.isbn}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}