import { AzureClient } from "azure-setup";
import { getNewLines, printLines } from "../utils/logger";
import { get } from "axios";
import { publishLogs } from "../utils/redis";

type EnvironmentVariables = {
  name: string;
  value?: string;
  secureValue?: string;
}[];

export const deployToAzure = async (
  project_name: string,
  image_url: string,
  env?: EnvironmentVariables,
  web: boolean = false,
  port?: number,
  build_path?: string
) => {
  console.log("Deploying to Azure...");
  publishLogs(project_name, ["Deploying to Azure..."]);
  try {
    const containerGroup =
      await AzureClient.containerGroups.beginCreateOrUpdate(
        "auto-deploy-user-deployed-apps",
        `${project_name}-uc`, //user container
        {
          location: "centralindia",
          containers: [
            {
              name: `${project_name}-web-builder`,
              image: image_url,
              resources: {
                requests: {
                  cpu: 1,
                  memoryInGB: 1,
                },
              },
              ports: [
                {
                  port: port || 80,
                },
              ],
              environmentVariables: env,
            },
          ],
          ipAddress: {
            ports: [
              {
                port: port || 80,
              },
            ],
            type: "Public",
            dnsNameLabel: project_name + "-server",
          },
          osType: "Linux",
          restartPolicy: "OnFailure",
        }
      );

    console.log("Container Group created");

    await containerGroup.pollUntilDone();
    let oldString = "";
    //Get logs from container till terminated
    let container = await AzureClient.containerGroups.get(
      "auto-deploy-user-deployed-apps",
      `${project_name}-uc`
    );
    let newline: string[] = [];
    while (
      container.containers[0]?.instanceView?.currentState?.state !==
      (web ? "Terminated" : "Running")
    ) {
      container = await AzureClient.containerGroups.get(
        "auto-deploy-user-deployed-apps",
        `${project_name}-uc`
      );
      console.log(container.containers[0]?.instanceView?.currentState?.state);
      //logs
      const logs = await AzureClient.containers.listLogs(
        "auto-deploy-user-deployed-apps",
        `${project_name}-uc`,
        `${project_name}-web-builder`
      );
      newline = getNewLines(oldString, logs.content ?? "");
      await publishLogs(project_name, newline);
      printLines(newline);
      oldString = logs.content ?? "";
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    //No ip if building web app
    if (web) {
      await AzureClient.containerGroups.beginDeleteAndWait(
        "auto-deploy-user-deployed-apps",
        `${project_name}-uc`
      );
      publishLogs(project_name, [
        `Deployed to ${project_name}-web.auto-deploy.tech`,
      ]);

      return;
    }

    const url = containerGroup.getResult()?.ipAddress?.fqdn;

    console.log(url);
    publishLogs(project_name, [
      `Deployed to ${project_name}-server.auto-deploy.tech`,
    ]);
    return url;
  } catch (e: any) {
    console.log(e);
    publishLogs(project_name, ["Failed to deploy to Azure", e.message]);
  }
};
