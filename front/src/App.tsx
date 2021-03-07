import React, { useState } from "react"
import "./App.css"
import { io } from "socket.io-client"
import Login from "./components/Login"
import Race from "./components/Race"
import SOCKET_URL, { CREDENTIALS } from "./env"

const socket = io(SOCKET_URL, CREDENTIALS)

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
