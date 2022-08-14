import { io } from 'socket.io-client'

export const getSocketConnection = (namespace = '') => {
  return io(`${process.env.SOCKETIO_URI}/${namespace}`, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    auth: {
      secret: process.env.SOCKETIO_SECRET,
    },
  })
}
