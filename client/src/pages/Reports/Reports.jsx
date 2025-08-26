import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function Reports() {
  const [mostBorrowed, setMostBorrowed] = useState([])
  const [trends, setTrends] = useState([])

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const [mRes, tRes] = await Promise.all([api.get('/reports/most-borrowed'), api.get('/reports/trends')])
      setMostBorrowed(mRes.data || [])
      setTrends(tRes.data || [])
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Most Borrowed</h3>
          <ol className="list-decimal pl-5">
            {mostBorrowed.map((m, i) => <li key={i}>{m.title} — {m.count} loans</li>)}
          </ol>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Trends</h3>
          <pre className="text-sm text-gray-600 dark:text-gray-300">{JSON.stringify(trends, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}