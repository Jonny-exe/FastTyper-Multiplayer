import React, { useEffect, useRef, useState, useMemo } from "react"
import Button from "react-bootstrap/esm/Button"
import { getNewQuote } from "../requests"
import ProgressBar from "react-bootstrap/esm/ProgressBar"
import WordEditor from "./WordEditor"
import FreeEditor from "./FreeEditor"
import { Self, Text, User } from "./types"
import Form from "react-bootstrap/esm/Form"

interface Props {
	socket: any
	username: string
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
	const [editorType, setEditorType] = useState<string>("word")

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
		let correct: boolean = false
		switch (editorType) {
			case "word":
				const writtenText = myFullText + myWord
				if (text.quote === writtenText) {
					setMyFullText((myFullText) => myFullText + myWord)
					setIsFinished(true)
					return
				}
				if (
					myWord[myWord.length - 1] === " " &&
					text.quote.indexOf(writtenText) === 0
				) {
					setMyFullText((myFullText) => myFullText + myWord)
					setMyWord("")
				}
				correct = text.quote.indexOf(writtenText) === 0
				setIsCorrect(correct)
				break

			case "free":
				debugger
				if (text.quote === myFullText) {
					setIsFinished(true)
					return
				}
				correct = text.quote.indexOf(myFullText) === 0
				console.log(correct)
				break
		}
		setIsCorrect(correct)
	}, [myWord, myFullText]) // Maybe this is bad only "TEXT"

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
				: (100 * (myFullText.split(" ").length - 1)) / text.quote.split(" ").length
		)
		setUser({ ...user, progress })
	}, [myFullText, text.quote, isFinished])

	return (
		<div className="race">
			{editorType === "word" ? (
				<WordEditor
					input={input}
					isCorrect={isCorrect}
					isFinished={isFinished}
					myFullText={myFullText}
					myWord={myWord}
					setMyWord={setMyWord}
					text={text}
				/>
			) : (
				<FreeEditor
					input={input}
					text={text}
					myFullText={myFullText}
					isCorrect={isCorrect}
					isFinished={isFinished}
					setMyFullText={setMyFullText}
				/>
			)}
			<ProgressBar className="bar" now={user.progress} />
			<Button
				disabled={!user.isLider || !haveUsersFinished}
				onClick={newQuote}
				variant="primary"
			>
				New quote
			</Button>
			{isFinished ? <h1> GG </h1> : null}
			<Form.Group controlId="exampleForm.SelectCustom">
				<Form.Label>Select input type</Form.Label>
				<Form.Control
					onChange={(e) => setEditorType(e.target.value)}
					value={editorType}
					as="select"
					custom
				>
					<option value="word">Word</option>
					<option value="free">Full</option>
				</Form.Control>
			</Form.Group>
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
