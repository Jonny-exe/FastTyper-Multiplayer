import React, { useCallback, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import { getNewQuote } from '../requests'
import ProgressBar from 'react-bootstrap/esm/ProgressBar'

interface Props {
	socket: any,
	username: string
}

interface User {
	username: string,
	progress: number
}

interface Self {
	username: string,
	progress: number,
	isFinished: boolean,
	isLeader: boolean
}

const Race: React.FC<Props> = ({ socket, username }) => {
	const input: any = useRef(null)

	const [quote, setQuote] = React.useState<string>("")
	const [race, setRace] = React.useState<string>("")
	const [user, setUser] = React.useState<Self>({ username, progress: 0, isFinished: false, isLeader: false })
	const [text, setText] = React.useState<string>("")
	const [isCorrect, setIsCorrect] = React.useState<boolean>(true)
	const [users, setUsers] = React.useState<User[]>([])

	const sendSocket = useCallback(() => {
		socket.emit("new-opeartions")
		console.log("HELLO")
	}, [socket, race])

	const focus = () => {
		input.current.focus()
	}


	useEffect(() => {
		socket.on("new-remote-operation", (users: User[]) => {
			setUsers(users)
			debugger
		})
	}, [socket])

	useEffect(() => {
		if (quote === text) {
			setUser({ ...user, isFinished: true })
			return
		}
		let correct = false
		if (quote.indexOf(text) === 0) {
			correct = true
		}
		setIsCorrect(correct)
	}, [text, quote, user]) // Maybe this is bad only "TEXT"

	useEffect(() => {
		socket.on("new-remote-operations", (data: string) => {
			debugger
		})
	}, [socket])

	const newQuote = async () => {
		setText("")
		const newQuote = await getNewQuote()
		setQuote(newQuote)
		focus()
		setUser({ ...user, isFinished: false })
	}

	const getProgress = React.useMemo(() => {
		return isFinished ? 100 : (100 * (text.split(" ").length - 1)) / (quote.split(" ").length)
	}, [text, quote, isFinished])
	console.log(text.split(" ").length - 1, quote.split(" ").length - 1)
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

			<Button onClick={newQuote} variant="primary"> New quote </Button>
			{
				isFinished ? <h1> GG </h1> : null
			}
			<hr></hr>
			{/* {user} */}
		</div >
	)
}
export default Race