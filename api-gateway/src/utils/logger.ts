import pino from "pino";

const transport = pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: `${__dirname}/app.log` },
      },
      {
        target: 'pino-pretty',
        options: {
            colorize: true, // Add colors to log output
        },
      },
    ],
  });

const logger = pino(
    transport
    // pino.destination("./logs/api-gateway.log")
);

export default logger;