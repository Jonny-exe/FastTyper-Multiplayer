import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';



interface Props {
	socket: any,
	setAuthorized: (isAuthorized: boolean) => void
}

const Login: React.FC<Props> = ({ socket, setAuthorized }) => {
	const [name, setName] = useState("")
	const login = () => {
		socket.auth = { username: name };
		socket.connect()
		setAuthorized(true)
	}
	return (
		<div className="login">
			<p>
				<h1> Please insert your username: </h1>
			</p>
			<InputGroup className="mb-3">
				<FormControl
					placeholder="Username"
					aria-label="Username"
					aria-describedby="basic-addon2"
					value={name}
					onChange={(e: any) => setName(e.target.value)}
				/>
				<InputGroup.Append>
					<Button
						onClick={login}
						variant="outline-secondary"
					> Login </Button>
				</InputGroup.Append>
			</InputGroup>
		</div>
	)
}

export default Login