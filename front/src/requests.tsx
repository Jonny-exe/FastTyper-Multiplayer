import axios from "axios"

export const getNewQuote = async () => {
  const res = await axios.get("https://api.quotable.io/random")
  return res.data.content
}
