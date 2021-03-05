import { User, Text } from "./types"
import { query } from "./db"
import { CORS } from "./env"

const app = require("express")()
const http = require("http").createServer(app)
require("source-map-support").install()

const io = require("socket.io")(http, CORS)

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
  await query(`insert into users (username, progress) values ($1, 0)`, [
    username,
  ])

  const users = await query("select username, progress from users")
  if (users.length === 1) {
    await query(`update text set lider = $1::text, quote = ''`, [username])
    const sendInfo: Text = { lider: username, quote: "" }
    isLider = true
    io.emit("text", sendInfo)
  }

  io.emit("users", users)

  socket.on("update-progress", async ({ username, progress }: User) => {
    query(`update users set progress = $1::bigint where username = $2::text`, [
      progress,
      username,
    ])
    const users = await query("select username, progress from users")
    io.emit("users", users)
  })

  socket.on("update-text", async ({ quote, lider }: Text) => {
    await query(`update text set quote = $1::text where lider = $2::text`, [
      quote,
      lider,
    ])
    io.emit("text", { quote, lider })
  })

  socket.on("disconnect", async () => {
    await query(`delete from users where username = $1::text`, [username])
    console.log(`${username} disconnected`)
    if (isLider == true) {
      let newLider = await query(
        `select username from users where username <> $1::text`,
        [username]
      )
      newLider = newLider.length > 0 ? newLider[0].username : ""
      await query(`update text set lider = $1::text`, [newLider])
      io.emit("text", { lider: newLider, quote: "" })
    }
    const newUsers = await query(`select username, progress from users`)
    io.emit("users", newUsers)
  })
})

http.listen(4000, () => {
  console.log("listening on *:4000")
})
