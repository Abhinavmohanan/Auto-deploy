import { Router } from "express";
import { deployToAzure } from "../controllers/deploy";

let router: Router = Router();

router.post("/", async (req, res) => {
  const { project_name, github_url } = req.body;

  await deployToAzure(
    `${project_name}-web-builder`,
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
    ],
    true
  ); //Build and push to Azure Blob Storage

  res.json({
    message: `Published! URL : https://adwebapps.blob.core.windows.net/${project_name}/index.html`,
  });
});

export = router;
