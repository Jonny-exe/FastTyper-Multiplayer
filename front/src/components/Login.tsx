import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

interface Props {
	socket: any,
	setAuthorized: (isAuthorized: boolean) => void
}

const Login: React.FC<Props> = ({ socket, setAuthorized }) => {
	useEffect(() => {
		io.on("connection", socket => {
			const users = []
			for (let [id, socket] of io.of("/").sockets) {
				
			}
		})
	}, [])
	const [name, setName] = useState("")
	const login = () => {
		socket.auth = { username: name };
		socket.connect()
		setAuthorized(true)
	}
	return (
		<div className="login">
			<input type="text" placeholder="Login" value={name} onChange={e => setName(e.target.value)} className="login" />
			<button className="loggin" onClick={login}> Login </button>
		</div>
	)
}

export default Login