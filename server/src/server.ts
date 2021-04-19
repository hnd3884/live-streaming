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
let broadcasterList = {}
let watcher_broadcaster = {}

// socket handler
io.sockets.on('connect', socket => {
     socket.on('broadcaster', (username) => {
          broadcasterList[socket.id] = username
          socket.join(username)
     })

     socket.on("start-watching", (broadcasterId) => {
          socket.to(broadcasterId).emit("start-watching", socket.id);
          watcher_broadcaster[socket.id] = broadcasterId

          let broadcasterName = broadcasterList[broadcasterId]
          socket.join(broadcasterName)
     });

     socket.on("disconnect", () => {
          let clientId = socket.id

          let broadcasterName = broadcasterList[clientId]
          if (broadcasterName) {
               delete broadcasterList[clientId]
               return
          }

          let broadcasterId = watcher_broadcaster[clientId]

          socket.to(broadcasterId).emit("disconnectPeer", clientId);
          delete watcher_broadcaster[clientId]
     });

     socket.on("offer", (clientId, localDescription) => {
          socket.to(clientId).emit("offer", socket.id, localDescription);
     });

     socket.on("chat", (message, watcherName, broadcasterId) => {
          // send message to room
          socket.to(broadcasterList[broadcasterId]).emit("chat", watcherName, message)
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