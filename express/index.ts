import express from "express";
import { ObjectId } from "mongodb";
import { collection } from "./connector";
import { Request } from "./types";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/user", checkScopes, addUserToRequest, (req: Request, res) => {
  console.debug("user", req.user);
  res.send("Hello User!");
});

app.post("/complex", checkScopes, addUserToRequest, (req: Request, res) => {
  const {
    body: { mine },
  } = req;

  if (mine) {
    mineBitcoin();
  }

  const { challengeFiles } = req.user;

  const updatedChallengeFiles = updateChallengeFiles(challengeFiles);
  const update = {
    challengeFiles: updatedChallengeFiles,
  };

  return collection
    ?.updateOne({ email: "bar@bar.com" }, { $set: update })
    .then(() => {
      void res.status(200).send({ msg: "Successfully updated" });
    })
    .catch((err) => {
      console.error(err);
      void res.status(500).send({ msg: "Something went wrong" });
    });
});

interface UserObject {
  scope: string;
}

function checkScopes(
  req: Request,
  _res: express.Response,
  next: express.NextFunction
) {
  if (req.scopes?.length === 0) {
    throw new Error("Scopes cannot be empty");
  }
  const user = req.user as UserObject;
  if (!user) {
    throw new Error("request.user does not exist");
  }
  if (typeof user.scope !== "string") {
    throw new Error("request.user.scope must be a string");
  }

  const userScopes = user.scope.split(" ");
  const allowed = req.scopes?.some((scope) => {
    return userScopes.indexOf(scope) !== -1;
  });
  next();
}

async function addUserToRequest(
  req: Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.scopes?.includes("write:user")) {
    return res.status(401).send({ msg: "Unauthorized" });
  }

  const user = await collection.findOne({
    _id: new ObjectId("5bd30e0f1caf6ac3ddddddb9"),
  });
  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(404).send({ msg: "User not found" });
  }
}

app.listen(3000, () => {
  console.log("Example app listening at http://localhost:3000");
});

function mineBitcoin() {
  // A computationally expensive operation (summing the first 10_000 primes)
  let sum = 0;
  for (let i = 2; i < 10_000; i++) {
    if (isPrime(i)) {
      sum += i;
    }
  }

  return sum;
}
function isPrime(n: number) {
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

interface User {
  _id: ObjectId;
  email: string;
  challengeFiles: ChallengeFile[];
}

interface ChallengeFile {
  id: string;
  solution?: string;
  challengeType?: number;
  completedDate: number;
  files?: any[];
}

function updateChallengeFiles(challengeFiles: ChallengeFile[]) {
  // Desired schema:
  // { id: string, files: { name: string, content: string }[], completedDate: number }
  return challengeFiles.map((challengeFile) => {
    if (challengeFile.solution) {
      return {
        id: challengeFile.id,
        files: [
          {
            name: "index.js",
            content: challengeFile.solution,
          },
        ],
        completedDate: challengeFile.completedDate || Date.now(),
      };
    }
    return {
      id: challengeFile.id,
      files: challengeFile.files?.map((file) => {
        return {
          name: file.name || file.ext,
          content: file.content,
        };
      }),
      completedDate: challengeFile.completedDate || Date.now(),
    };
  });
}
