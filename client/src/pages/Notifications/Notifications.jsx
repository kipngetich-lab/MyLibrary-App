import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function Notifications() {
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    api.get('/notifications').then(res => setNotifs(res.data || [])).catch(() => setNotifs([]))
  }, [])

  const sendEmail = async (n) => {
    try {
      await api.post('/notifications/send', { id: n._id })
      alert('Notification sent')
    } catch (err) {
      alert('Failed')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        {notifs.length === 0 ? <div>No notifications</div> : (
          <ul>
            {notifs.map(n => (
              <li key={n._id} className="border-b py-2 flex justify-between">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-gray-500">{n.body}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => sendEmail(n)} className="px-2 py-1 bg-indigo-600 text-white rounded">Send Email</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}