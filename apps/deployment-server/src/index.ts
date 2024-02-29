import cors from "cors";
import express from "express";
import deployNodeRoute from "./routes/deployNode";
import deployViteRoute from "./routes/deployVite";
import supertokens from "supertokens-node";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import { ensureSuperTokensInit } from "./utils/auth";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import UserRoles from "supertokens-node/recipe/userroles";

ensureSuperTokensInit();

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(middleware());

app.use(
  "/publishNode",
  verifySession({
    checkDatabase: true,
    overrideGlobalClaimValidators: async (globalValidators) => [
      ...globalValidators,
      UserRoles.UserRoleClaim.validators.includes("test_user"),
      UserRoles.PermissionClaim.validators.includes("access"),
    ],
  }),
  deployNodeRoute
);

app.use(
  "/publishVite",
  verifySession({
    checkDatabase: true,
    overrideGlobalClaimValidators: async (globalValidators) => [
      ...globalValidators,
      UserRoles.UserRoleClaim.validators.includes("test_user"),
      UserRoles.PermissionClaim.validators.includes("access"),
    ],
  }),
  deployViteRoute
);

app.use(errorHandler());

app.listen(port, () =>
  console.log(`Deployment server running on http://localhost:${port}`)
);
