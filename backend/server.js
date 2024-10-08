import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const app = express();
const port = process.env.PORT || 3000;
const dbName = process.env.DB_DATABASE;
const exists = await checkDatabaseExists(dbName);

if (!exists) {
    await createDatabase(dbName);
}

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: dbName,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get("/api/getAllTransactions", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM transactions");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            error: "An error occurred while fetching transactions",
        });
    }
});

app.post("/api/addTransaction", async (req, res) => {
    try {
        const { amount, text } = req.body;

        if (!amount || !text) {
            return res
                .status(400)
                .json({ error: "Amount and description are required" });
        }
        const result = await pool.query(
            "INSERT INTO transactions (amount, text) VALUES ($1, $2) RETURNING *",
            [amount, text],
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.delete("/api/transaction", async (req, res) => {
    try {
        await pool.query("DELETE FROM transactions WHERE id = $1", [
            req.body.id,
        ]);
        res.status(201).json("Transaction deleted Successfully!");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.delete("/api/all", async (req, res) => {
    try {
        await pool.query("DELETE FROM transactions");
        res.status(201).json("All transactions deleted Successfully!");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(port, () => {
    console.log("Port is running on ", port);
});

function createClient(dbName = "postgres") {
    return new pg.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: dbName,
    });
}

async function checkDatabaseExists(dbName) {
    const client = createClient();

    try {
        await client.connect();

        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName],
        );

        if (res.rowCount > 0) {
            console.log(`Database "${dbName}" already exists.`);
            await client.end();
            const secondClient = createClient(dbName);
            await secondClient.connect();
            await checkTableExists(secondClient);
            return true;
        } else {
            console.log(`Database "${dbName}" does not exist.`);
            await client.end();
            return false;
        }
    } catch (error) {
        console.error("Error checking database existence:", error);
        return false;
    }
}

async function createDatabase(dbName) {
    const client = createClient();
    try {
        await client.connect();
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`Database "${dbName}" created successfully.`);
        await checkDatabaseExists(dbName);
    } catch (error) {
        console.error("Error creating database:", error);
    }
}

async function checkTableExists(client) {
    try {
        await client.query(
            `CREATE TABLE IF NOT EXISTS transactions(id SERIAL PRIMARY KEY, text TEXT, amount VARCHAR(10))`,
        );
        console.log(
            'Table "transactions" created successfully (if it did not already exist).',
        );
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        await client.end();
    }
}
