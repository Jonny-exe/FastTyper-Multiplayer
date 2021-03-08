import React, { useEffect, useRef, useState, useMemo } from "react"
import { getNewQuote } from "../requests"
import WordEditor from "./EditorWord"
import FreeEditor from "./EditorFree"
import { Self, Text, User } from "./types"
import ProgressBar from "./ProgressBar"

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
	const [myText, setMyText] = useState<string>("")
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
		let correct: boolean = false
		switch (editorType) {
			case "word":
				const writtenText = myFullText + myText
				if (text.quote === writtenText) {
					setMyFullText((myFullText) => myFullText + myText)
					setIsFinished(true)
					return
				}
				if (
					myText[myText.length - 1] === " " &&
					text.quote.indexOf(writtenText) === 0
				) {
					setMyFullText((myFullText) => myFullText + myText)
					setMyText("")
				}
				correct = text.quote.indexOf(writtenText) === 0
				break

			case "free":
				if (text.quote === myText) {
					setIsFinished(true)
					return
				}
				setMyFullText(myText)
				correct = text.quote.indexOf(myText) === 0
				break
		}
		setIsCorrect(correct)
	}, [myText]) // Maybe this is bad only "TEXT"

	useEffect(() => {
		socket.emit("update-progress", { progress: user.progress, username })
	}, [user.progress, socket, username])

	useEffect(() => {
		socket.emit("update-text", text)
	}, [text.quote, socket])

	const newQuote = async () => {
		//TODO: make a timer for when you stanrt and you finish
		setMyFullText("")
		setMyText("")
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
					myText={myText}
					setMyText={setMyText}
					text={text}
				/>
			) : (
				<FreeEditor
					input={input}
					text={text}
					myText={myText}
					isCorrect={isCorrect}
					isFinished={isFinished}
					setMyText={setMyText}
				/>
			)}
			<ProgressBar progress={user.progress} />
			<button
				className={`${!user.isLider || !haveUsersFinished ? "disabled" : ""}`}
				onClick={newQuote}
			>
				New quote
			</button>
			{isFinished && text.quote !== "" ? (
				<div className="congratulations">
					<h1 className="congratulations"> GG </h1>
				</div>
			) : null}
			<div>
				<h3>Select input type</h3>
				{/* <select onChange={(e) => setEditorType(e.target.value)} value={editorType}>
					<option value="word">Word</option>
					<option value="free">Full</option>
				</select> */}
				<button
					onClick={() => setEditorType(editorType === "word" ? "free" : "word")}
				>
					{" "}
					{editorType}{" "}
				</button>
			</div>
			<hr></hr>
			{users.map(({ username: name, progress }: User, index: number) =>
				username === name ? null : (
					<div key={index}>
						<h2> Username: {name} </h2>
						<ProgressBar progress={progress} />
					</div>
				)
			)}
		</div>
	)
}
export default Race
