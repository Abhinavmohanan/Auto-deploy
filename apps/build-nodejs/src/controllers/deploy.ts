import { AzureClient } from "azure-setup";

export const deployToAzure = async (project_name: string) => {
  console.log("Deploying to Azure...");

  const containerGroup = await AzureClient.containerGroups.beginCreateOrUpdate(
    "auto-deploy-user-deployed-apps",
    "zenith-backend-user-containers",
    {
      location: "centralindia",
      containers: [
        {
          name: "zenith-backend",
          image: `autodeploy2024/${project_name}:latest`,
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
          environmentVariables: [
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
          ],
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
  console.log(
    await AzureClient.containers.listLogs(
      "auto-deploy-user-deployed-apps",
      "zenith-backend-user-containers",
      "zenith-backend"
    )
  );
  console.log(containerGroup.getResult()?.ipAddress?.fqdn);
  return containerGroup.getResult()?.ipAddress?.fqdn;
};
