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

const generateHexString = (length: number) => {
     var ret = "";
     while (ret.length < length) {
          ret += Math.random().toString(16).substring(2);
     }
     return ret.substring(0, length);
}

// locate socket ids of broadcasters
let broadcasterList = []
let broadcasterNameList = {}
let privates_key = {}
let watcher_broadcaster = {}

// socket handler
io.sockets.on('connect', socket => {
     socket.on('broadcaster', (username, mode) => {
          broadcasterList.push({
               id: socket.id,
               name: username,
               mode: mode
          })
          broadcasterNameList[socket.id] = username
          socket.join(username)
          if (mode == 'private') {
               privates_key[socket.id] = generateHexString(10)
               socket.emit('password', privates_key[socket.id])
          }
     })

     socket.on("start-watching", (broadcasterId) => {
          socket.to(broadcasterId).emit("start-watching", socket.id);
          watcher_broadcaster[socket.id] = broadcasterId

          // let broadcasterName = broadcasterList[broadcasterId]
          let broadcasterName = broadcasterNameList[broadcasterId]
          socket.join(broadcasterName)
     });

     socket.on("disconnect", () => {
          let clientId = socket.id

          broadcasterList.forEach((item, index) => {
               if (item.id == clientId) {
                    if (item.mode == 'private')
                         delete privates_key[clientId]
                    delete broadcasterNameList[clientId]
                    broadcasterList.splice(index, 1)
                    return
               }
          })

          let broadcasterId = watcher_broadcaster[clientId]

          socket.to(broadcasterId).emit("disconnectPeer", clientId);
          delete watcher_broadcaster[clientId]
     });

     socket.on("offer", (clientId, localDescription) => {
          socket.to(clientId).emit("offer", socket.id, localDescription);
     });

     socket.on("chat", (message, watcherName, broadcasterId) => {
          // send message to room
          socket.to(broadcasterNameList[broadcasterId]).emit("chat", watcherName, message)
     });

     socket.on("answer", (id, message) => {
          socket.to(id).emit("answer", socket.id, message);
     });

     socket.on("candidate", (clientId, message) => {
          socket.to(clientId).emit("candidate", socket.id, message);
     });
})

// API get broadcaster-list
app.get('/broadcaster/list', (req, res) => {
     res.send(broadcasterList.map(item => { return { 'name': item.name, 'mode': item.mode } })).end()
})

// API room
app.post('/room/', (req, res) => {
     let broadcasterName = req.body.user
     for (let i = 0; i < broadcasterList.length; i++) {
          if (broadcasterList[i].name === broadcasterName) {
               if (broadcasterList[i].mode === 'public') {
                    res.send(broadcasterList[i].id).end();
               }
               else {
                    let password = req.body.password
                    if (password == privates_key[broadcasterList[i].id]) {
                         res.send(broadcasterList[i].id).end();
                    }
                    else {
                         res.send({ error: 'wrong password' }).end();
                    }
               }
               break;
          }
     }
})

server.listen(5000, () => {
     console.log('App listening in port 5000')
})