import { NextFunction, Response } from "express";
import { MongoClient } from "mongodb";
import { Request } from "./types";

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
const collection = db.collection("user");

export async function addUserToRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await collection.findOne({ _id: req.body.email });
  if (user) {
    req.user = user;
  }
  next();
}
