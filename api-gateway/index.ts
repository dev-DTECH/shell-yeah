import { config as dotEnvConfig } from "dotenv";
dotEnvConfig()

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import config from "./src/utils/config";
import rateLimit from "./src/middleware/rateLimit";
import timeout from "./src/middleware/timeout";
import authorizeToken from "./src/middleware/authorizeToken";
import userRouter from "./src/route/user";
import cookieParser from "cookie-parser";
import http from "node:http";
import configRouter from "./src/route/config";
import logger from "./src/utils/logger";
import pinoHttp from "pino-http";
console.log = logger.info.bind(logger);
// Create an instance of Express app
const app = express();
const server = http.createServer(app);


// Middleware setup
app.use(cors()); // Enable CORS
app.use(pinoHttp({ logger }));
app.disable("x-powered-by"); // Hide Express server information
app.use(cookieParser());
app.use(express.json());

const { services } = config; // Max requests per minute

// Set up proxy middleware for each microservice
logger.info("Mapping services to routes...");
services.forEach(({ route, target, authorize }) => {
  logger.info(`\t${route} => ${target}`);
  // Proxy options
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
    logger,
    ws: true,
    logLevel: 'debug',
  };

  // Define routes
  app.use('/api/user', userRouter)
  app.use('/api/config', configRouter)

  // Apply rate limiting and timeout middleware before proxying
  app.use(
    rateLimit,
    timeout
  )

  if (authorize){

    app.use(route,
      authorizeToken,
      createProxyMiddleware(proxyOptions));
    }
  else
    app.use(route,
      createProxyMiddleware(proxyOptions));
});



// Define port for Express server
const PORT = process.env.PORT || config.port;

// Start Express server
server.listen(PORT, () => {
  console.log(`Service is running on port ${PORT}`);
});