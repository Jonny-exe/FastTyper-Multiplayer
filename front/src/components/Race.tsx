import React, { useEffect, useState } from 'react'

interface Props {
	socket: any,
}

const Race: React.FC<Props> = ({ socket }) => {
	const [race, setRace] = useState("")
	const sendSocket = () => {
		socket.emit("new-operations", race)
	}

	useEffect(() => {
		socket.on("new-remote-operations", (text: string) => {
			setRace(text)
		})
	})

	useEffect(() => {
		const interval = setInterval(sendSocket, 5000)
		return () => clearInterval(interval)
	})

	return (
		<div className="race">
			<input type="text" onChange={e => setRace(e.target.value)} />
			<button onClick={sendSocket}> Hello </button>
			<h1> Race: {race} </h1>
		</div>
	)
}
export default Race