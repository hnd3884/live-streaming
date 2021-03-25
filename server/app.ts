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

let i = 0
let broadcaster: string
io.sockets.on('connect', socket => {
     socket.on('broadcaster', () => {
          broadcaster = socket.id;
          socket.broadcast.emit('broadcaster')
     })
     socket.on("watcher", () => {
          socket.to(broadcaster).emit("watcher", socket.id);
     });
     socket.on("disconnect", () => {
          socket.to(broadcaster).emit("disconnectPeer", socket.id);
     });
     socket.on("offer", (id, message) => {
          socket.to(id).emit("offer", socket.id, message);
     });
     socket.on("answer", (id, message) => {
          socket.to(id).emit("answer", socket.id, message);
     });
     socket.on("candidate", (id, message) => {
          socket.to(id).emit("candidate", socket.id, message);
     });
})

server.listen(5000, () => {
     console.log('App listening in port 5000')
})