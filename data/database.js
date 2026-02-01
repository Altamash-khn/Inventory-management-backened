const { MongoClient } = require("mongodb");

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("inventory-management");
}

function getDb() {
  if (!database) {
    throw new Error("connection not established");
  }

  return database;
}

module.exports = { connectToDatabase, getDb };
