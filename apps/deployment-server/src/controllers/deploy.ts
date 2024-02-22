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
  port?: number
) => {
  console.log("Deploying to Azure...");
  publishLogs(project_name, ["Deploying to Azure..."]);

  const containerGroup = await AzureClient.containerGroups.beginCreateOrUpdate(
    "auto-deploy-user-deployed-apps",
    `${project_name}-uc`, //user container
    {
      location: "centralindia",
      containers: [
        {
          name: project_name,
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
        dnsNameLabel: project_name + "-deployment",
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
      project_name
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

    return;
  }

  const url = containerGroup.getResult()?.ipAddress?.fqdn;

  console.log(url);
  publishLogs(project_name, [
    `Deployed to ${url}${port && port != 80 ? `:${port}` : ""}`,
  ]);
  return url;
};
