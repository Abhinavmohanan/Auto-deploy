const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { promisify } = util;
const readdir = promisify(fs.readdir);

const { BlobServiceClient } = require("@azure/storage-blob");

require("dotenv").config();

const mime = require('mime-types');

async function upload(localFilePath, containerClient) {
    // Create a blob
    const blobName = localFilePath.split("dist/")[1]; //Get filename from the path
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const buffer = fs.readFileSync(localFilePath); // Read the file content


    try {
        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: {
                blobContentType: mime.lookup(localFilePath) || "application/octet-stream"
            },
            onProgress: (ev) => console.log(ev)
        });
        console.log("Successfully uploaded file:", blockBlobClient.name);
    } catch (err) {
        console.log(err);
    }
}

const init = async () => {
    const projectId = process.env.PROJECT_ID;
    console.log(`Building the web app  : ${projectId}....`);
    const projectPath = path.join(__dirname, `project`);

    const p = exec(`cd ${projectPath} && npm install && npm run build`);

    p.stdout.on('data', (data) => {
        console.log(data);
    });

    p.stderr.on('data', (data) => {
        console.error(data);
    });

    p.on('close', async () => {
        console.log("Build successful");

        //Initiate the blob service
        const STORAGE_CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING || "";
        const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);


        // Create a container
        const containerName = `${projectId}-web`;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        try {
            await containerClient.create({
                access: "blob",
            });
        } catch (err) {
            console.log(
                `Creating a container failed, requestId - ${err.request.requestId}, statusCode - ${err.statusCode}, errorCode - ${err.details.errorCode}`
            );
        }


        const buildPath = path.join(projectPath, `dist`);
        const files = await readdir(buildPath, { recursive: true });
        files.forEach(async (file) => {
            //Exclude directory files
            if (fs.lstatSync(path.join(buildPath, file)).isDirectory()) return;

            const filePath = path.join(buildPath, file);
            await upload(filePath, containerClient);
        });

        console.log("Upload complete");
    });
}


init();