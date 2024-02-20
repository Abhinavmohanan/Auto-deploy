import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import { deployToAzure } from "./controllers/deploy";
import { buildImage } from "./controllers/buildImage";

require("dotenv").config();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/publish", async (req: Request, res: Response) => {
  const { project_name, github_url } = req.body;

  await buildImage(project_name, github_url);

  const url = await deployToAzure(project_name);
  res.json({
    message: `Published! URL : ${url}`,
  });
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
