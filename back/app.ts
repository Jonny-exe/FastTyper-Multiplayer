const app = require("express")()
const http = require("http").createServer(app)
// server-side
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
})

io.use((socket: any, next: any) => {
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error("invalid username"))
  }
  socket.username = username
  next()
})

interface User {
  username: string,
  userID: number
}

io.on("connection", (socket: any) => {
  socket.on("disconnect", () => {
    io.emit("users", getUsers())
    console.log("Disconnect")
  })

  socket.on("new-operations", (data: string) => {
    console.log("Data: ", data)
    io.emit("new-remote-operations", data)
  })

  console.log("Connection", socket.username)
  const getUsers = () => {
    const users: User[] = [];
    const sockets = io.of("/").sockets
    sockets.forEach((socket: any) => {
      users.push({
        username: socket.username,
        userID: socket.id
      })
    })
    return users
  }
  io.emit("users", getUsers());
});


// notify existing users

http.listen(4000, () => {
  console.log("listening on *:4000")
})
