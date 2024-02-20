import { ContainerInstanceManagementClient } from "@azure/arm-containerinstance";
import { DefaultAzureCredential } from "@azure/identity";

const subscriptionId = "2a9baf93-b8e0-4cf1-aa4b-0949821eb082";
const credentials = new DefaultAzureCredential();
export const AzureClient = new ContainerInstanceManagementClient(
  credentials,
  subscriptionId
);
