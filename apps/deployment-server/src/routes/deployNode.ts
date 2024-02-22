import { Router } from "express";
import { buildImage } from "../controllers/buildImage";
import { deployToAzure } from "../controllers/deploy";

let router: Router = Router();

router.post("/", async (req, res) => {
  let { project_name, github_url, env, port } = req.body;
  //Build directory
  // let build_dir = req.body.build_dir;
  project_name = project_name.toLowerCase();
  if (port) {
    port = parseInt(port);
  }
  const result = await buildImage(project_name, github_url); //Builds docker image for the app
  // if (result == "FAILED") {
  //   res.status(500).json({ message: "Failed to build image" });
  //   return;
  // }
  const url = await deployToAzure(
    project_name,
    `autodeploy2024/${project_name}:latest`,
    env,
    false,
    port
  );
  //Deploys the app to Azure Container Instance
  res.json({
    url: `${url}${port && port != 80 ? `:${port}` : ""}`,
  });
});

export = router;
