import React from "react"

interface Props {
	progress: number
}

const ProgressBar: React.FC<Props> = ({ progress }) => {
	return (
		<div className="progressWrapper">
			<div className="progress" style={{ width: `${progress}%` }}></div>
		</div>
	)
}

export default ProgressBar
