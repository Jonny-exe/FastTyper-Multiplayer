import React, { useCallback, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import { getNewQuote } from '../requests'
import ProgressBar from 'react-bootstrap/esm/ProgressBar'

interface Props {
	socket: any,
}

interface User {
	username: string,
	userID: number
}

const Race: React.FC<Props> = ({ socket }) => {
	const input: any = useRef(null)

	const [quote, setQuote] = React.useState<string>("")
	const [race, setRace] = React.useState<string>("")
	const [text, setText] = React.useState<string>("")
	const [isFinished, setIsFinished] = React.useState<boolean>(false)
	const [isCorrect, setIsCorrect] = React.useState<boolean>(true)
	const [display, setDisplay] = React.useState<string>("")
	const [users, setUsers] = React.useState<User[]>([])

	const sendSocket = useCallback(() => {
		console.log("HELLO")
	}, [socket, race])

	const focus = () => {
		input.current.focus()
	}


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
		setText("")
		const newQuote = await getNewQuote()
		setQuote(newQuote)
		focus()
		setIsFinished(false)
	}

	const getProgress = React.useMemo(() => {
		return isFinished ? 100 : (100 * (text.split(" ").length - 1)) / (quote.split(" ").length)
	}, [text, quote, isFinished])
	console.log(text.split(" ").length - 1,quote.split(" ").length - 1)
	console.log((100 * (text.split(" ").length - 1)) / (quote.split(" ").length))

	return (
		<div className="race">
			<Form.Group
				onChange={(e: any) => setRace(e.target.value)}
				controlId="exampleForm.ControlTextarea1">
				<Form.Label> <h2>{quote}</h2> </Form.Label>
				<Form.Control
					readOnly={isFinished}
					value={text}
					onChange={(e: any) => setText(e.target.value)}
					as="textarea"
					className={`${isFinished ? "" : isCorrect ? 'correct' : 'incorrect'}`}
					rows={3}
					ref={input}
				/>
			</Form.Group>

			<ProgressBar animated className="bar" now={getProgress} />

			{/* <button onClick={sendSocket} > Hello </button> */}
			<Button onClick={newQuote} variant="primary"> New quote </Button>
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
			<hr></hr>
			{/* {user} */}
		</div >
	)
}
export default Race