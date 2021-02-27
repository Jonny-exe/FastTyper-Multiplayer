import React, { useCallback, useEffect } from 'react'
import Form from 'react-bootstrap/esm/Form'
import { getNewQuote } from '../requests'

interface Props {
	socket: any,
}

interface User {
	username: string,
	userID: number
}

const Race: React.FC<Props> = ({ socket }) => {
	const [quote, setQuote] = React.useState<string>("")
	const [race, setRace] = React.useState<string>("")
	const [text, setText] = React.useState<string>("")
	const [isFinished, setIsFinished] = React.useState<boolean>(false)
	const [isCorrect, setIsCorrect] = React.useState<boolean>(true)
	const [display, setDisplay] = React.useState<string>("")
	const [users, setUsers] = React.useState<User[]>([])
	const sendSocket = useCallback(() => {
		console.log("HELLO")
		socket.emit("new-operations", race)
	}, [socket, race])


	useEffect(() => {
		socket.on("users", (users: User[]) => {
			setUsers(users)
			debugger
		})
	}, [socket])

	useEffect(() => {
		if (quote == text) {
			setIsFinished(true)
			return
		}
		let correct = false
		debugger
		if (quote.indexOf(text) === 0) {
			correct = true
		}
		setIsCorrect(correct)
	}, [text])

	useEffect(() => {
		socket.on("new-remote-operations", (data: string) => {
			debugger
			setDisplay(data)
		})
	}, [])

	const newQuote = async () => {
		const newQuote = await getNewQuote()
		setQuote(newQuote)
		setIsFinished(false)
	}


	return (
		<div className="race">
			<Form.Group
				onChange={(e: any) => setRace(e.target.value)}
				controlId="exampleForm.ControlTextarea1">
				<Form.Label> <h2>{quote}</h2> </Form.Label>
				<Form.Control
					readOnly={isFinished}
					onChange={(e: any) => setText(e.target.value)}
					as="textarea"
					className={`${isCorrect ? 'correct' : 'incorrect'}`}
					rows={3}
				/>
			</Form.Group>
			{/* <button onClick={sendSocket} > Hello </button> */}
			<button onClick={newQuote} > NEW QUOTE </button>
			{/* <h1> Race: {race} </h1>
			<h1> Display: {display} </h1>
			{users.map(({ userID, username }, index) => (
				<div key={index}>
					<h1> UserID: {userID} </h1>
					<h1> Username: {username} </h1>
				</div>
			))
			} */}
			{
				isFinished ? <h1> GG </h1> : null
			}
		</div >
	)
}
export default Race