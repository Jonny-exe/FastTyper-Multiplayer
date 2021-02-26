const app = require("express")()
const http = require("http").createServer(app)
// server-side
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
})

io.on("connection", (socket: any) => {
  console.log("connection has been made")
  socket.on("new-operations", (data: string) => {
    io.emit("new-remote-operations", data)
  })
})
http.listen(4000, () => {
  console.log("listening on *:4000")
})
