// serve /dist with express
import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from '@shell-yeah/common';

const app = express();
const port = 3000;

// Middlewares
app.use(pinoHttp({ logger }));


app.use(express.static('dist'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});