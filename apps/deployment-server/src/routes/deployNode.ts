import { Router } from "express";
import { buildImage } from "../controllers/buildImage";
import { deployToAzure } from "../controllers/deploy";
import { SessionRequest } from "supertokens-node/framework/express";
let router: Router = Router();

const currentDeployment: string[] = [];

router.post("/", async (req: SessionRequest, res) => {
  let { project_name, github_url, env, port, src_dir } = req.body;

  if (currentDeployment.includes(project_name)) {
    res.status(400).json({ message: "Deployment already in progress" });
    return;
  }
  currentDeployment.push(project_name);
  //Build directory
  // let build_dir = req.body.build_dir;
  project_name = project_name.toLowerCase();
  if (port) {
    port = parseInt(port);
  }
  const result = await buildImage(project_name, github_url, src_dir); //Builds docker image for the app
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
