import { Router } from "express";
import { deployToAzure } from "../controllers/deploy";
import { SessionRequest } from "supertokens-node/framework/express";
let router: Router = Router();

const currentDeployment: string[] = [];

router.post("/", async (req: SessionRequest, res) => {
  let { project_name, github_url, env } = req.body;
  project_name = project_name.toLowerCase();

  if (currentDeployment.includes(project_name)) {
    res.status(400).json({ message: "Deployment already in progress" });
    return;
  }

  currentDeployment.push(project_name);

  await deployToAzure(
    project_name,
    `autodeploy2024/web-builder:latest`,
    [
      {
        name: "STORAGE_CONNECTION_STRING",
        secureValue: process.env.STORAGE_CONNECTION_STRING,
      },
      {
        name: "PROJECT_ID",
        value: project_name,
      },
      {
        name: "GITHUB_REPO_URL",
        value: github_url,
      },
      ...env,
    ],
    true
  ); //Build and push to Azure Blob Storage

  res.json({
    message: `Published! URL : https://adwebapps.blob.core.windows.net/${project_name}/index.html`,
  });
});

export = router;
