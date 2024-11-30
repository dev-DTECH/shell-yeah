import express, { Request, Response, NextFunction } from "express";
import config from "../utils/config";

export default function timeout(req: Request, res: Response, next: NextFunction) {
  
    // Set timeout for each request (example: 10 seconds)
    req.setTimeout(config.timeout, () => {
      // Handle timeout error
      res.status(504).json({
        code: 504,
        status: "Error",
        message: "Gateway timeout.",
        data: null,
      });
      // req.abort(); // Abort the request
    });
  
    next(); // Continue to the next middleware
  }