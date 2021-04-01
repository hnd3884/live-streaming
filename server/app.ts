import express from 'express';
import http from 'http'
import socketIO from 'socket.io'
import cors from 'cors'

const app = express();
app.use(cors())
const server = http.createServer(app)
const io = new socketIO.Server(server, {
     cors: {
          origin: "*",
          credentials: true
     }
})

// locate socket ids of broadcasters
let broadcasterList: string[] = []

// socket handler
io.sockets.on('connect', socket => {
     socket.on('broadcaster', () => {
          broadcasterList.push(socket.id);
          socket.broadcast.emit('broadcaster', socket.id)
     })
     
     socket.on("start-watching", (broadcasterId) => {
          socket.to(broadcasterId).emit("start-watching", socket.id);
     });
     socket.on("disconnect", broadcaster => {
          socket.to(broadcaster).emit("disconnectPeer", socket.id);
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