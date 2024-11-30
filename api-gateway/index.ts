import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import config from "./src/utils/config";
import rateLimit from "./src/middleware/rateLimit";
import timeout from "./src/middleware/timeout";
import authorizeToken from "./src/middleware/authorizeToken";
import userRouter from "./src/route/user";
import cookieParser from "cookie-parser";
import http from "node:http";
import authorizeSocketToken from "./src/middleware/authorizeSocketToken";

// Create an instance of Express app
const app = express();
const server = http.createServer(app);


// Middleware setup
app.use(cors()); // Enable CORS
// app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information
app.use(cookieParser());
app.use(express.json());

// Define rate limit constants
const { services } = config; // Max requests per minute


// Set up proxy middleware for each microservice
services.forEach(({ route, target, authorize }) => {
  // Proxy options
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
    logger: console,
    ws: true,
  };

  // Define routes
  app.use('/api/user', userRouter)

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
  console.log(`[api-gateway] Service is running on port ${PORT}`);
});