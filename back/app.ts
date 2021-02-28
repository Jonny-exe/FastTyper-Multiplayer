import { updateLanguageServiceSourceFile } from "typescript"
import { User, Text } from "./types"
import { query } from "./db"

const app = require("express")()
const http = require("http").createServer(app)
require("source-map-support").install()

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

io.on("connection", async (socket: any) => {
  const username = socket.username
  let isLider: boolean
  console.log(`${username} connected`)
  await query(
    `insert into users (username, progress) values ('${username}', 0)`
  )

  const users = await query("select username, progress from users")
  if (users.length === 1) {
    await query(`update text set lider = '${username}', quote = ''`)
    const sendInfo: Text = { lider: username, quote: "" }
    isLider = true
    io.emit("text", sendInfo)
  }

  io.emit("users", users)

  socket.on("update-progress", async ({ username, progress }: User) => {
    query(
      `update users set progress = ${progress} where username = '${username}'`
    )
    console.log(progress)
    const users = await query("select username, progress from users")
    io.emit("users", users)
  })

  socket.on("update-text", async ({ quote, lider }: Text) => {
    query(`update text set quote = ${quote} where lider = ${lider}`)
    io.emit("text", { quote, lider })
  })

  socket.on("disconnect", async () => {
    await query(`delete from users where username = '${username}'`)
    console.log(`${username} disconnected`)
    if (isLider == true) {
      const newLider = await query(
        `select username from users where username != '${username}'`
      )
      await query(`update text set lider = '${newLider}'`)
      io.emit("text", { lider: newLider, quote: "" })
    }
    const newUsers = await query(`select username, progress from users`)
    io.emit("users", newUsers)
  })
})

http.listen(4000, () => {
  console.log("listening on *:4000")
})
