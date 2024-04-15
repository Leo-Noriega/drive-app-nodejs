const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOSTNAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
let dbConnection;

async function connect() {
	if (dbConnection) return dbConnection;
	await client.connect();
	dbConnection = client.db(process.env.DBNAME);
	console.log('Connected to MongoDB');
	return dbConnection;
}

module.exports = {connect};

