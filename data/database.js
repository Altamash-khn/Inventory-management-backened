const { MongoClient } = require("mongodb");

let database;

const mongodbUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
async function connectToDatabase() {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db("inventory-management");
}

function getDb() {
  if (!database) {
    throw new Error("connection not established");
  }

  return database;
}

module.exports = { connectToDatabase, getDb };
