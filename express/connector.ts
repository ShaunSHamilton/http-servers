import { MongoClient } from "mongodb";

const URL = process.env.MONGO_URI || "mongodb://localhost:27017";

const client = new MongoClient(URL);
try {
  await client.connect();
} catch (e) {
  console.error(e);
} finally {
  console.log("Closing database connection...");
  await client.close();
}
const db = client.db("freecodecamp");
export const collection = db.collection("user");
