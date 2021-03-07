import React, { useState } from "react"

interface Props {
	socket: any
	setAuthorized: (isAuthorized: boolean) => void
	setUsername: (username: string) => void
}

const Login: React.FC<Props> = ({ socket, setAuthorized, setUsername }) => {
	const [name, setName] = useState("")
	const login = () => {
		socket.auth = { username: name }
		socket.connect()
		setAuthorized(true)
		setUsername(name)
	}
	return (
		<div className="login">
			<h1> Welcome to fasttyper</h1>
			<div className="loginWrapper">
				<h2 className="login"> Please insert your username: </h2>
				<form onSubmit={login}>
					<div className="loginInputs">
						<input
							type="text"
							placeholder="Username"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login
