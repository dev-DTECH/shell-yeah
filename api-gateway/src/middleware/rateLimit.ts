import express, { Request, Response, NextFunction } from "express";
import config from "../utils/config";

const requestCounts: Record<string, number> = {};

setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; // Reset request count for each IP address
  });
}, 1000);

export default function rateLimit(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip; // Get client IP address
    if (!ip) {
      res.status(400).json({
        code: 400,
        status: "Error",
        message: "Invalid request.",
        data: null,
      });
      return;
    }
  
    // Update request count for the current IP
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;
  
    // Check if request count exceeds the rate limit
    if (requestCounts[ip] > config.rateLimit) {
      // Respond with a 429 Too Many Requests status code
      res.status(429).json({
        code: 429,
        status: "Error",
        message: "Rate limit exceeded.",
        data: null,
      });
      return;
    }
  
    next(); // Continue to the next middleware
  }