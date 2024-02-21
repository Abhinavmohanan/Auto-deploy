import { Router } from "express";
import { buildImage } from "../controllers/buildImage";
import { deployToAzure } from "../controllers/deploy";

let router: Router = Router();

router.post("/", async (req, res) => {
  const { project_name, github_url } = req.body;

  await buildImage(project_name, github_url); //Builds docker image for the app

  const url = await deployToAzure(
    project_name,
    `autodeploy2024/${project_name}:latest`,
    [
      {
        name: "PORT",
        value: "80",
      },
      {
        name: "MONGODB_URI",
        secureValue: process.env.MONGODB_URI,
      },
      {
        name: "ACCESS_TOKEN_SECRET",
        secureValue: process.env.ACCESS_TOKEN_SECRET,
      },
      {
        name: "REFRESH_TOKEN_SECRET",
        secureValue: process.env.REFRESH_TOKEN_SECRET,
      },
      {
        name: "FRONT_END_URL",
        value: process.env.FRONT_END_URL,
      },
      {
        name: "COOKIE_DOMAIN",
        value: process.env.COOKIE_DOMAIN,
      },
    ]
  ); //Deploys the app to Azure Container Instance
  res.json({
    message: `Published! URL : ${url}`,
  });
});

export = router;
