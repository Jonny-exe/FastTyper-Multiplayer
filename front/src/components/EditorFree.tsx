import React from "react"
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
		<div className="editor">
			<h2 className="text">{text.quote}</h2>
			<textarea
				readOnly={isFinished}
				value={myText}
				onChange={(e: any) => setMyText(e.target.value)}
				className={`${isFinished ? "" : isCorrect ? "correct" : "incorrect"}`}
				rows={3}
				ref={input}
			/>
		</div>
	)
}

export default FreeEditor
