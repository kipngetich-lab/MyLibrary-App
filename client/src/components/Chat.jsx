import React, { useEffect, useState, useContext, useRef } from 'react'
import io from 'socket.io-client'
import { AuthContext } from '../context/AuthContext'

let socket

export default function Chat({ room = 'global' }) {
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const messagesRef = useRef()

  useEffect(() => {
    // connect to socket server (proxy via vite config)
    socket = io('/', { transports: ['websocket'] })
    socket.emit('join', { room, user })
    socket.on('message', msg => {
      setMessages(prev => [...prev, msg])
    })
    socket.emit('getRecent', { room })
    socket.on('recent', ms => {
      setMessages(ms || [])
    })

    return () => {
      if (socket) {
        socket.emit('leave', { room, user })
        socket.off()
        socket.disconnect()
      }
    }
  }, [room, user])

  useEffect(() => {
    // scroll to bottom when messages update
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const send = () => {
    if (!text.trim()) return
    const msg = {
      text: text.trim(),
      user: user ? { id: user._id, name: user.name, role: user.role } : { name: 'Guest' },
      createdAt: new Date().toISOString(),
    }
    socket.emit('message', { room, msg })
    setText('')
  }

  return (
    <div className="border rounded shadow p-3 bg-white dark:bg-gray-800">
      <div className="font-semibold mb-2">Chat</div>
      <div ref={messagesRef} className="h-48 overflow-auto border rounded p-2 mb-2 bg-gray-50 dark:bg-gray-900">
        {messages.map((m, idx) => (
          <div key={idx} className="mb-2">
            <div className="text-sm text-gray-500">{m.user?.name || 'Guest'} <span className="text-xs ml-2 text-gray-400">{new Date(m.createdAt).toLocaleTimeString()}</span></div>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Type a message" />
        <button onClick={send} className="px-3 py-2 bg-indigo-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}