import { ObjectId } from "@fastify/mongodb";
import { FastifyPluginCallback, FastifyRequest } from "fastify";
import { ChallengeFile, mineBitcoin, User } from "../utils";

export const testRoutes: FastifyPluginCallback = (fastify, _options, done) => {
  const collection = fastify.mongo.db?.collection<User>("user");

  fastify.get("/user", async (_request, _reply) => {
    if (!collection) {
      return { error: "No collection" };
    }
    const user = await collection?.findOne({ email: "bar@bar.com" });
    return { user };
  });

  fastify.post(
    "/complex",
    {
      preHandler: [
        function (
          req: FastifyRequest<{ Body: { mine: boolean } }>,
          _res,
          done
        ) {
          void req.jwtAuthz(["write:user"], done);
        },
      ],
      schema: {
        body: {
          required: ["mine"],
          properties: {
            mine: { type: "boolean" },
          },
        },
      },
    },
    async (req, res) => {
      const {
        body: { mine },
      } = req;

      if (mine) {
        mineBitcoin();
      }

      const maybeColletion = await collection?.findOne(
        {
          _id: new ObjectId("5bd30e0f1caf6ac3ddddddb9"),
        },
        { projection: { challengeFiles: 1 } }
      );

      if (!maybeColletion) {
        return res.code(404).send({ msg: "User not found" });
      }
      const { challengeFiles } = maybeColletion;

      const updatedChallengeFiles = updateChallengeFiles(challengeFiles);
      const update = {
        challengeFiles: updatedChallengeFiles,
      };

      return collection
        ?.updateOne({ email: "bar@bar.com" }, { $set: update })
        .then(() => {
          void res.code(200).send({ msg: "Successfully updated" });
        })
        .catch((err) => {
          fastify.log.error(err);
          void res.code(500).send({ msg: "Something went wrong" });
        });
    }
  );
  done();
};

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
