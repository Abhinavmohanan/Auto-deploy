import cors from "cors";
import express from "express";
import deployNodeRoute from "./routes/deployNode";
import deployViteRoute from "./routes/deployVite";

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/publishNode", deployNodeRoute);

app.use("/publishVite", deployViteRoute);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
