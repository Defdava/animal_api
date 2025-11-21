import serverless from "serverless-http";
import { app } from "api-hewan/server.js";

export default serverless(app);
