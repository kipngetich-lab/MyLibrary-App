const { Server } = require('socket.io')

/**
 * Simple in-memory storage for recent messages per room.
 * For production, persist to DB.
 */
const recentMessages = {}

module.exports = function attachSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', function (socket) {
    console.log('socket connected', socket.id)

    socket.on('join', function (payload) {
      var room = payload && payload.room
      var user = payload && payload.user
      socket.join(room)
      socket.room = room
      var username = (user && user.name) ? user.name : 'Guest'
      console.log(username + ' joined ' + room)
      // send recent messages
      var recent = recentMessages[room] || []
      socket.emit('recent', recent)
    })

    socket.on('leave', function (payload) {
      var room = payload && payload.room
      var user = payload && payload.user
      socket.leave(room)
      var username = (user && user.name) ? user.name : 'Guest'
      console.log(username + ' left ' + room)
    })

    socket.on('getRecent', function (payload) {
      var room = payload && payload.room
      socket.emit('recent', recentMessages[room] || [])
    })

    socket.on('message', function (data) {
      var room = data && data.room
      var msg = data && data.msg
      if (!room) return
      // store message (keep last 200)
      if (!recentMessages[room]) recentMessages[room] = []
      recentMessages[room].push(msg)
      if (recentMessages[room].length > 200) recentMessages[room].shift()
      // broadcast to room
      io.to(room).emit('message', msg)
    })

    socket.on('disconnect', function () {
      console.log('socket disconnected', socket.id)
    })
  })

  return io
}