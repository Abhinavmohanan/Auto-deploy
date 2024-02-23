import axios from "axios";
import { getNewLines, printLines } from "../utils/logger";
import { publishLogs } from "../utils/redis";
require("dotenv").config();

const JENKINS_URL = process.env.JENKINS_URL || "";
const JENKINS_USERNAME = process.env.JENKINS_USERNAME || "";
const JENKINS_PASSWORD = process.env.JENKINS_PASSWORD || "";

export const buildImage = async (
  project_name: string,
  github_url: string,
  src_dir: string = "./"
) => {
  const formdata = new FormData();
  await publishLogs(project_name, ["Building Image"]);
  formdata.append("project_name", project_name);
  formdata.append("github_url", github_url);

  if (src_dir) {
    formdata.append("src_dir", src_dir);
  }
  try {
    const response = await axios.post(
      JENKINS_URL + "/buildWithParameters",
      formdata,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
        auth: {
          username: JENKINS_USERNAME,
          password: JENKINS_PASSWORD,
        },
      }
    );
    const buildQueueUrl = response.headers.location;
    console.log("Getting BuildId ...");

    var response2 = await axios.get(buildQueueUrl + "api/json", {
      auth: {
        username: JENKINS_USERNAME,
        password: JENKINS_PASSWORD,
      },
    });

    var whyCheck = response2.data.why;
    var buildId = null;
    while (whyCheck != null && buildId == null) {
      console.log("Waiting for build to start..");
      console.log(whyCheck);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response2 = await axios.get(buildQueueUrl + "api/json", {
        auth: {
          username: JENKINS_USERNAME,
          password: JENKINS_PASSWORD,
        },
      });
      whyCheck = response2.data.why;
      buildId = response2.data?.executable?.number;
    }

    console.log("Build started..");
    console.log("Build id " + buildId);
    console.log(response2.data);
  } catch (e) {
    console.log("Error in building image..");
    console.log(e);
  }
  var inProgress = true;
  let oldString = "";
  let newline: string[] = [];
  while (inProgress == true) {
    const response = await axios.post(
      JENKINS_URL + `/${buildId}/api/json`,
      {},
      {
        auth: {
          username: JENKINS_USERNAME,
          password: JENKINS_PASSWORD,
        },
      }
    );
    inProgress = response.data.inProgress;
    const logs = await axios.post(
      JENKINS_URL + `/${buildId}/consoleText`,
      {},
      {
        auth: {
          username: JENKINS_USERNAME,
          password: JENKINS_PASSWORD,
        },
      }
    );
    newline = getNewLines(oldString, logs.data);
    await publishLogs(project_name, newline);
    printLines(newline);
    oldString = logs.data;
    //Delay
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  console.log("Pushed to dockerhub..");
};
