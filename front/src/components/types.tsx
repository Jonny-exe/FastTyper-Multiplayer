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

export type { User, Text, Self }
