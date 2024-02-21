import { AzureClient } from "azure-setup";

type EnvironmentVariables = {
  name: string;
  value?: string;
  secureValue?: string;
}[];

export const deployToAzure = async (
  project_name: string,
  image_url: string,
  env: EnvironmentVariables,
  web: boolean = false
) => {
  console.log("Deploying to Azure...");

  const containerGroup = await AzureClient.containerGroups.beginCreateOrUpdate(
    "auto-deploy-user-deployed-apps",
    `${project_name}-user-containers`,
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
              port: 80,
            },
          ],
          environmentVariables: env,
        },
      ],
      ipAddress: {
        ports: [
          {
            port: 80,
          },
        ],
        type: "Public",
        dnsNameLabel: "zenith-backend",
      },
      osType: "Linux",
      restartPolicy: "OnFailure",
    }
  );
  await containerGroup.pollUntilDone();

  while (!containerGroup.isStopped()) {
    console.log(
      await AzureClient.containers.listLogs(
        "auto-deploy-user-deployed-apps",
        `${project_name}-user-containers`,
        `${project_name}`
      )
    );
  }

  if (web) {
    return;
  }

  console.log(containerGroup.getResult()?.ipAddress?.fqdn);
  return containerGroup.getResult()?.ipAddress?.fqdn;
};
