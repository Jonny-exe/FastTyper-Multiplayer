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

io.use((socket: { handshake: { auth: { username: any } }; username: any }, next: (arg: null | Error) => void) => {
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error("invalid username"))
  }
  socket.username = username
  next(null)
})

io.on("connection", (socket: any) => {
  console.log("connection has been made")
  socket.on("new-operations", (data: string) => {
    console.log(data)
    io.emit("new-remote-operations", data)
  })
})
http.listen(4000, () => {
  console.log("listening on *:4000")
})
