import React from "react"
import Form from "react-bootstrap/esm/Form"
import { Text, User } from "./types"

interface Props {
	myFullText: string
	text: Text
	input: any
	isFinished: boolean
	isCorrect: boolean
	myText: string
	setMyText: (newWord: string) => void
}

const WordEditor: React.FC<Props> = ({
	myFullText,
	text,
	input,
	isFinished,
	isCorrect,
	myText,
	setMyText,
}) => {
	return (
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
				value={myText}
				onChange={(e) => setMyText(e.target.value)}
				as="textarea"
				size="lg"
				className={`${isFinished ? "" : isCorrect ? "correct" : "incorrect"}`}
				rows={1}
				ref={input}
			/>
		</Form.Group>
	)
}

export default WordEditor
