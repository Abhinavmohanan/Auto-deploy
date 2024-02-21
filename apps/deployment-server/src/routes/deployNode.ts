import { Router } from "express";
import { buildImage } from "../controllers/buildImage";
import { deployToAzure } from "../controllers/deploy";

let router: Router = Router();

router.post("/", async (req, res) => {
  let { project_name, github_url, env, port } = req.body;
  project_name = project_name.toLowerCase();
  if (port) {
    port = parseInt(port);
  }

  await buildImage(project_name, github_url); //Builds docker image for the app
  const url = await deployToAzure(
    project_name,
    `autodeploy2024/${project_name}:latest`,
    env,
    false,
    port
  );
  //Deploys the app to Azure Container Instance
  res.json({
    message: `Published! URL : ${url}${port ? `:${port}` : ""}`,
  });
});

export = router;
