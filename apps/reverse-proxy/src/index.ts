import express from "express";
import httpProxy from "http-proxy";

require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;
var proxy = httpProxy.createProxyServer();

app.use("/:subdomain/:type", (req, res) => {
  const subdomain = req.params.subdomain;
  const appType = req.params.type;
  //check if the app type is web
  if (appType === "web") {
    //if it is web, then serve the static files
    return proxy.web(req, res, {
      target: `https://adwebapps.blob.core.windows.net/${subdomain}-${appType}`,
      changeOrigin: true,
    });
  } else if (appType === "server") {
    return proxy.web(req, res, {
      target: `http://${subdomain}-${appType}.centralindia.azurecontainer.io`,
      changeOrigin: true,
    });
  }
  console.log(subdomain);
});

proxy.on("proxyReq", (proxyReq, req) => {
  //Check subdomain ends with -web
  const host = req.headers.host;
  //Split subdomain from host
  const subdomain = host?.split(".")[0];

  //split by - to get the app name
  const appName = subdomain?.split("-");
  //get last element of the array
  const appType = appName?.[appName.length - 1];

  if (req.url === "/" && appType === "web") {
    proxyReq.path += "index.html";
  }
  return proxyReq;
});

app.listen(port, () =>
  console.log(`Reverse proxy running on http://localhost:${port}`)
);
