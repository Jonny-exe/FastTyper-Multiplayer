import clientInfoDB from "./env"
const { Client } = require("pg")
const client = new Client(clientInfoDB)

const setup = async () => {
	client
		.connect()
		.then(() => console.log("connected"))
		.catch((err: Error) => console.error("connection error", err.stack))

	client.query("SELECT NOW()")
	client.query(
		"create table if not exists users (username text, progress smallint)"
	)
	client.query("create table if not exists text (lider text, quote text)")
}

const query = async (query: string, params: any[] = []) => {
	try {
		// const { rows } = params.length > 0 ? await client.query(query, params) : await client.query(query)
		const { rows } = await client.query(query, params)
		return rows
	} catch (err) {
		console.error("Error querying") //Happens every time a var is empty ""
	}
}

setup()

export { query }
