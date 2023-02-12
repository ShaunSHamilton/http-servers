import express from "express";
import { addUserToRequest } from "./connector";
import { Request } from "./types";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/user", auth0, addUserToRequest, (req: Request, res) => {
  console.debug("user", req.user);
  res.send("Hello User!");
});

app.post("/complex", auth0, (_req, res) => {
  res.send("Hello Complex!");
});

function auth0(
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  console.debug("Auth0");
  next();
}

app.listen(3000, () => {
  console.log("Example app listening at http://localhost:3000");
});
