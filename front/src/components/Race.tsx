import React, { useEffect, useRef, useState, useMemo } from "react"
import Form from "react-bootstrap/esm/Form"
import Button from "react-bootstrap/esm/Button"
import { getNewQuote } from "../requests"
import ProgressBar from "react-bootstrap/esm/ProgressBar"

interface Props {
	socket: any
	username: string
}

interface User {
	username: string
	progress: number
}

interface Text {
	quote: string
	lider: string
}

interface Self {
	username: string
	progress: number
	isLider: boolean
}

const Race: React.FC<Props> = ({ socket, username }) => {
	const input: any = useRef(null)

	const [user, setUser] = useState<Self>({
		username,
		progress: 0,
		isLider: false,
	})
	const [text, setText] = useState<Text>({ quote: "", lider: "" })
	const [myFullText, setMyFullText] = useState<string>("")
	const [myWord, setMyWord] = useState<string>("")
	const [isCorrect, setIsCorrect] = useState<boolean>(true)
	const [isFinished, setIsFinished] = useState<boolean>(false)
	const [users, setUsers] = useState<User[]>([])

	const focus = () => {
		input.current.focus()
	}

	useEffect(() => {
		socket.on("text", (text: Text) => {
			setText(text)
			let { lider, quote } = text
			if (lider === user.username) {
				setUser({ ...user, isLider: true })
			} else if (quote !== "") {
				setIsFinished(false)
			}
			setMyFullText("")
		})
	}, [socket])

	useEffect(() => {
		socket.on("users", (users: User[]) => {
			setUsers(users)
		})
	}, [socket])

	useEffect(() => {
		//TODO: make this cleaner
		if (text.quote === myFullText + myWord) {
			setMyFullText((myFullText) => myFullText + myWord)
			setIsFinished(true)
			return
		}

		if (
			myWord[myWord.length - 1] === " " &&
			text.quote.indexOf(myFullText + myWord) === 0
		) {
			setMyFullText((myFullText) => myFullText + myWord)
			setMyWord("")
		}

		let correct = text.quote.indexOf(myFullText + myWord) === 0
		setIsCorrect(correct)
	}, [myWord]) // Maybe this is bad only "TEXT"

	useEffect(() => {
		socket.emit("update-progress", { progress: user.progress, username })
	}, [user.progress, socket, username])

	useEffect(() => {
		socket.emit("update-text", text)
	}, [text.quote, socket])

	const newQuote = async () => {
		//TODO: make a timer for when you stanrt and you finish
		setMyFullText("")
		setMyWord("")
		const newQuote = await getNewQuote()
		setText({ ...text, quote: newQuote })
		focus()
		setIsFinished(false)
	}

	const haveUsersFinished = useMemo(() => {
		let finished: boolean = true
		if (text.quote === "") return true
		users.every(({ progress }: User) => {
			if (progress !== 100) {
				finished = false
				return false
			}
			return true
		})
		return finished
	}, [users, text.quote])

	useEffect(() => {
		const progress = Math.floor(
			isFinished
				? 100
				: (100 * (myFullText.split(" ").length - 1)) /
						text.quote.split(" ").length
		)
		setUser({ ...user, progress })
	}, [myFullText, text.quote, isFinished])

	return (
		<div className="race">
			<Form.Group controlId="exampleForm.ControlmyTextarea1">
				<Form.Label>
					<h2>
						{text.quote.substring(0, myFullText.length)}
						<span className="word">|</span>
						{text.quote.substring(myFullText.length, text.quote.length)}
					</h2>
				</Form.Label>
				<Form.Control
					readOnly={isFinished}
					value={myWord}
					onChange={(e: any) => setMyWord(e.target.value)}
					as="textarea"
					size="lg"
					className={`${isFinished ? "" : isCorrect ? "correct" : "incorrect"}`}
					rows={1}
					ref={input}
				/>
			</Form.Group>

			<ProgressBar className="bar" now={user.progress} />
			<Button
				disabled={!user.isLider || !haveUsersFinished}
				onClick={newQuote}
				variant="primary"
			>
				New quote
			</Button>
			{isFinished ? <h1> GG </h1> : null}
			<hr></hr>
			{users.map(({ username: name, progress }: User, index: number) =>
				username === name ? null : (
					<div key={index}>
						<h2> Username: {name} </h2>
						<ProgressBar className="bar" now={progress} />
					</div>
				)
			)}
		</div>
	)
}
export default Race
