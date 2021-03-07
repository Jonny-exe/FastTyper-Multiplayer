import axios from "axios"

export const getNewQuote = async () => {
	let result: string
	try {
		const res = await axios.get("https://api.quotable.io/random")
		result = res.data.content
	} catch (err) {
		console.error("Error getting new quote: ", err)
		result = "The quick brown fox jumps over the lazy dog"
	}
	return result
}
