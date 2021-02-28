import { Text, User } from './types'
import clientInfoDB, { clientInfo } from './env'
const { Client } = require('pg')
const pgtools = require("pgtools");
const client = new Client(clientInfoDB)


const setup = async () => {
    client
        .connect()
        .then(() => console.log('connected'))
        .catch((err: Error) => console.error('connection error', err.stack))

    client.query("SELECT NOW()")
}

const query = async (query: string) => {
    const { rows } = await client.query(query)
    return rows
}

setup()

export { query }