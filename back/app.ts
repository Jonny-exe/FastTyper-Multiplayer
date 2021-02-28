import { updateLanguageServiceSourceFile } from 'typescript';
import { User, Text } from './types'
import { query } from './db'

const app = require("express")()
const http = require("http").createServer(app)
require('source-map-support').install();

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
  console.log(`${username} connected`)
  query(`insert into users (username, progress) values ('${username}', 0)`)

  const users = await query("select username, progress from users")
  if (users.length === 0) {
    await query("remove from text")
    await query(`insert into text (text, lider) values ('',  '${username}')`)
    io.emit("text", { lider: username, quote: "" })
  }

  io.emit("users", users)

  socket.on("update-progress", async ({ username, progress }: User) => {
    query(`update users set progress = ${progress} where username = ${username}`)
    const users = await query("select username, progress from users")
    io.emit("users", users)
  })

  socket.on("update-text", async ({ quote, lider }: Text) => {
    query(`update users set quote = ${quote} where lider = ${lider}`)
    io.emit("text", {quote, lider})
  })
});




http.listen(4000, () => {
  console.log("listening on *:4000")
})
