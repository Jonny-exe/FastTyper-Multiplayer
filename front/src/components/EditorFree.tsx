import React from "react"
import Form from "react-bootstrap/esm/Form"
import { Text } from "./types"

interface Props {
	text: Text
	myText: string
	setMyText: (newText: string) => void
	isFinished: boolean
	isCorrect: boolean
	input: any
}
const FreeEditor: React.FC<Props> = ({
	text,
	isFinished,
	myText,
	setMyText,
	isCorrect,
	input,
}) => {
	return (
		<Form.Group controlId="exampleForm.ControlmyTextarea1">
			<Form.Label>
				<h2 className="text">{text.quote}</h2>
			</Form.Label>
			<Form.Control
				readOnly={isFinished}
				value={myText}
				onChange={(e: any) => setMyText(e.target.value)}
				as="textarea"
				className={`${isFinished ? "" : isCorrect ? "correct" : "incorrect"}`}
				rows={3}
				ref={input}
			/>
		</Form.Group>
	)
}

export default FreeEditor
