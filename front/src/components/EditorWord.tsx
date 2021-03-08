import React from "react"
import { Text } from "./types"

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
	const getWordRange = React.useMemo(() => {
		if (text.quote.length === 0 || isFinished) return [0, 0]
		const splitedFullText = myFullText.split(" ")
		const splitedQuote = text.quote.split(" ")
		let count: number = 0
		let index = 0
		for (let i = 0; i < splitedFullText.length - 1; i++) {
			index++
			count += splitedFullText[i].length + 1
		}
		debugger
		const finishCount: number = count + splitedQuote[index].length
		return [count, finishCount]
	}, [myFullText, text.quote, isFinished])

	const [startCursor, finishCursor] = getWordRange

	return (
		<>
			<div className="editor">
				<div className="text">
					<h2 className="text">
						{
							<>
								{text.quote.substring(0, startCursor)}
								<span className="word" style={isFinished ? { display: "none" } : {}}>
									{text.quote.substring(startCursor, finishCursor)}
								</span>
								{text.quote.substring(finishCursor, text.quote.length)}
							</>
						}
					</h2>
				</div>
				<textarea
					readOnly={isFinished}
					value={myText}
					onChange={(e) => setMyText(e.target.value)}
					className={`editorWord ${
						isFinished ? "" : isCorrect ? "correct" : "incorrect"
					}`}
					rows={1}
					ref={input}
				/>
			</div>
		</>
	)
}

export default WordEditor
