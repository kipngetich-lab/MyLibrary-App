import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function Acquisitions() {
  const [acqs, setAcqs] = useState([])
  const [payload, setPayload] = useState({ title: '', author: '', isbn: '', qty: 1 })

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const res = await api.get('/acquisitions')
      setAcqs(res.data || [])
    } catch (err) {}
  }

  const request = async () => {
    try {
      await api.post('/acquisitions', payload)
      fetch()
      setPayload({ title: '', author: '', isbn: '', qty: 1 })
      alert('Requested')
    } catch (err) {
      alert('Failed to request')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Acquisition Requests</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input placeholder="Title" value={payload.title} onChange={e => setPayload(p => ({...p, title: e.target.value}))} className="p-2 border rounded" />
          <input placeholder="Author" value={payload.author} onChange={e => setPayload(p => ({...p, author: e.target.value}))} className="p-2 border rounded" />
          <input placeholder="ISBN" value={payload.isbn} onChange={e => setPayload(p => ({...p, isbn: e.target.value}))} className="p-2 border rounded" />
          <input type="number" min="1" value={payload.qty} onChange={e => setPayload(p => ({...p, qty: Number(e.target.value)}))} className="p-2 border rounded" />
        </div>
        <div className="mt-2">
          <button onClick={request} className="px-3 py-1 bg-indigo-600 text-white rounded">Request Acquisition</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Pending Requests</h3>
        <ul>
          {acqs.map(a => (
            <li key={a._id} className="border-b py-2">
              <div className="font-medium">{a.title} ({a.qty})</div>
              <div className="text-sm text-gray-500">{a.author} — {a.isbn}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}