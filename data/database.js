const { MongoClient } = require("mongodb");

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  database = client.db("inventory-management");
}

function getDb() {
  if (!database) {
    throw new Error("connection not established");
  }

  return database;
}

module.exports = { connectToDatabase, getDb };
