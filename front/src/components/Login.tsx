import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import FormControl from "react-bootstrap/FormControl"
import InputGroup from "react-bootstrap/InputGroup"

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
			<h1> Please insert your username: </h1>
			<form onSubmit={login}>
				<InputGroup className="mb-3">
					<FormControl
						placeholder="Username"
						aria-label="Username"
						aria-describedby="basic-addon2"
						value={name}
						onChange={(e: any) => setName(e.target.value)}
					/>
					<InputGroup.Append>
						<Button variant="outline-secondary" type="submit">
							Login
						</Button>
					</InputGroup.Append>
				</InputGroup>
			</form>
		</div>
	)
}

export default Login
