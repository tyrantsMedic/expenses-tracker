import express from 'express'
import bodyParser from 'body-parser'
import pg from 'pg'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
const app = express()
const port = process.env.PORT || 3000
const dbName = 'expenses_tracker'
const tableName = 'transactions'
const exists = await checkDatabaseExists(dbName)

if (!exists) {
  await createDatabase(dbName)
}

const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  password: 'lhu@5934',
  port: 5432,
  database: dbName
})

await client.connect()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.set(port, process.env.PORT || 3000)
console.log(process.env.PORT)

app.get('/api/getAllTransactions', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM transactions')
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'An error occurred while fetching transactions' })
  }
})

app.post('/api/addTransaction', async (req, res) => {
  try {
    const { amount, text } = req.body

    if (!amount || !text) {
      return res.status(400).json({ error: 'Amount and description are required' })
    }
    const result = await client.query(
      'INSERT INTO transactions (amount, text) VALUES ($1, $2) RETURNING *',
      [amount, text]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.delete('/api/transaction', async (req, res) => {
  try {
    await client.query('DELETE FROM transactions WHERE id = $1', [req.body.id])
    res.status(201).json('Transaction deleted Successfully!')
  } catch (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.delete('/api/all', async (req, res) => {
  try {
    await client.query('DELETE FROM transactions')
    res.status(201).json('All transactions deleted Successfully!')
  } catch (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.listen(port, () => {
  console.log('Port is running on ', port)
})

function createClient(dbName = 'postgres') {
  return new pg.Client({
    user: 'postgres',
    host: 'localhost',
    password: 'lhu@5934',
    port: 5432,
    database: dbName
  })
}

async function checkDatabaseExists(dbName) {
  const client = createClient()

  try {
    await client.connect()

    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])

    if (res.rowCount > 0) {
      console.log(`Database "${dbName}" already exists.`)
      await client.end()
      const secondClient = createClient(dbName)
      await secondClient.connect()
      await checkTableExists(tableName, secondClient)
      return true
    } else {
      console.log(`Database "${dbName}" does not exist.`)
      await client.end()
      return false
    }
  } catch (error) {
    console.error('Error checking database existence:', error)
    return false
  }
}

async function createDatabase(dbName) {
  const client = createClient()
  try {
    await client.connect()
    await client.query(`CREATE DATABASE ${dbName}`)
    console.log(`Database "${dbName}" created successfully.`)
    await checkTableExists(tableName, client)
  } catch (error) {
    console.error('Error creating database:', error)
  }
}

async function checkTableExists(tableName, client) {
  try {
    const res = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [tableName]
    )

    if (res.rowCount > 0) {
      console.log(`Table "${tableName}" exists.`)
      return true
    } else {
      console.log(`Table "${tableName}" does not exist.`)
      createTransactionTable(client)
      return false
    }
  } catch (error) {
    console.error('Error checking table existence:', error)
    return false
  }
}

async function createTransactionTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS transactions(id SERIAL PRIMARY KEY, text TEXT, amount VARCHAR(10))`
    )
    console.log('Table "transactions" created successfully (if it did not already exist).')
  } catch (error) {
    console.error('Error creating table:', error)
  } finally {
    await client.end()
  }
}
