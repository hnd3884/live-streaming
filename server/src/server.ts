import app from './app';
import http from 'http'
import socketIO from 'socket.io'

const server = http.createServer(app)
const io = new socketIO.Server(server, {
     cors: {
          origin: "*",
          credentials: true
     }
})

// locate socket ids of broadcasters
let broadcasterList: string[] = []
let watcher_broadcaster = {}

// socket handler
io.sockets.on('connect', socket => {
     socket.on('broadcaster', () => {
          broadcasterList.push(socket.id);
          socket.broadcast.emit('broadcaster', socket.id)
     })

     socket.on("start-watching", (broadcasterId) => {
          socket.to(broadcasterId).emit("start-watching", socket.id);
          watcher_broadcaster[socket.id] = broadcasterId
     });

     socket.on("disconnect", () => {
          let clientId = socket.id

          // check if client is broadcaster, if true then remove broadcaster
          let isBroadcaster = broadcasterList.includes(clientId)
          if (isBroadcaster) {
               broadcasterList = broadcasterList.filter(e => e != clientId)
               return
          }

          let broadcasterId = watcher_broadcaster[clientId]

          socket.to(broadcasterId).emit("disconnectPeer", clientId);
          delete watcher_broadcaster[clientId]
     });

     socket.on("offer", (clientId, localDescription) => {
          socket.to(clientId).emit("offer", socket.id, localDescription);
     });

     socket.on("answer", (id, message) => {
          socket.to(id).emit("answer", socket.id, message);
     });

     socket.on("candidate", (clientId, message) => {
          socket.to(clientId).emit("candidate", socket.id, message);
     });
})

// API route
app.get('/broadcaster/list', (req, res) => {
     res.send(broadcasterList).end()
})

server.listen(5000, () => {
     console.log('App listening in port 5000')
})