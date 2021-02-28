import React, { useState } from "react"
import "./App.css"
import { io } from "socket.io-client"
import Login from "./components/Login"
import Race from "./components/Race"

const socket = io("http://localhost:4000", {
  withCredentials: true,
  autoConnect: false,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
})

const App = () => {
  const [isAuthorized, setAuthorized] = useState(false)
  const [username, setUsername] = React.useState<string>("")
  return (
    <div className="App">
      {isAuthorized ? (
        <Race socket={socket} username={username} />
      ) : (
        <Login
          socket={socket}
          setUsername={setUsername}
          setAuthorized={setAuthorized}
        />
      )}
    </div>
  )
}

export default App
