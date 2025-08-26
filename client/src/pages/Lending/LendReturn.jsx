import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function LendReturn() {
  const [transactions, setTransactions] = useState([])
  const [members, setMembers] = useState([])
  const [books, setBooks] = useState([])
  const [payload, setPayload] = useState({ memberId: '', bookId: '', dueDate: '' })

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const [tRes, mRes, bRes] = await Promise.all([api.get('/lend'), api.get('/users?role=member'), api.get('/books')])
      setTransactions(tRes.data || [])
      setMembers(mRes.data || [])
      setBooks(bRes.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const issue = async () => {
    if (!payload.memberId || !payload.bookId || !payload.dueDate) return alert('Fill all fields')
    try {
      await api.post('/lend/issue', payload)
      alert('Book issued')
      fetch()
      setPayload({ memberId: '', bookId: '', dueDate: '' })
    } catch (err) {
      alert('Failed to issue')
    }
  }

  const returnBook = async (id) => {
    if (!window.confirm('Return this book?')) return
    try {
      await api.post(`/lend/return/${id}`)
      fetch()
    } catch (err) {
      alert('Failed to return')
    }
  }

  const renew = async (id) => {
    try {
      await api.post(`/lend/renew/${id}`)
      fetch()
    } catch (err) {
      alert('Failed to renew')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Issue Book</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select value={payload.memberId} onChange={e => setPayload(p => ({...p, memberId: e.target.value}))} className="p-2 border rounded">
            <option value="">Select Member</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
          </select>
          <select value={payload.bookId} onChange={e => setPayload(p => ({...p, bookId: e.target.value}))} className="p-2 border rounded">
            <option value="">Select Book</option>
            {books.map(b => <option key={b._id} value={b._id}>{b.title} ({b.copiesAvailable} available)</option>)}
          </select>
          <input type="date" value={payload.dueDate} onChange={e => setPayload(p => ({...p, dueDate: e.target.value}))} className="p-2 border rounded" />
        </div>
        <div className="mt-2">
          <button onClick={issue} className="px-3 py-1 bg-indigo-600 text-white rounded">Issue</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Active Loans</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left">Member</th>
              <th className="p-2 text-left">Book</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id} className="border-t">
                <td className="p-2">{t.member?.name}</td>
                <td className="p-2">{t.book?.title}</td>
                <td className="p-2">{new Date(t.dueDate).toLocaleDateString()}</td>
                <td className="p-2">{t.overdue ? 'Overdue' : 'On time'}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => returnBook(t._id)} className="text-green-600">Return</button>
                  <button onClick={() => renew(t._id)} className="text-indigo-600">Renew</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}