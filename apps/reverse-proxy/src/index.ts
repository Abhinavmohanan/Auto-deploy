import express from "express";
import httpProxy from "http-proxy";

require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;
var proxy = httpProxy.createProxyServer();

app.use((req, res) => {
  const host = req.headers.host;
  //Split subdomain from host
  const subdomain = host?.split(".")[0];
  console.log(subdomain);
  return proxy.web(req, res, {
    target: `https://adwebapps.blob.core.windows.net/${subdomain}`,
    changeOrigin: true,
  });
});

proxy.on("proxyReq", (proxyReq, req) => {
  if (req.url === "/") {
    proxyReq.path += "index.html";
  }
  return proxyReq;
});

app.listen(port, () =>
  console.log(`Reverse proxy running on http://localhost:${port}`)
);
