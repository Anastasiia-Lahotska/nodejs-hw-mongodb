import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import { UPLOAD_DIR } from './constants/contacts.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlwares/errorHandler.js';
import { notFoundHandler } from './middlwares/notFoundHandler.js';

const swaggerDocument = JSON.parse(fs.readFileSync('./docs/swagger.json', 'utf8'));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(pino());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

 const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📘 Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });

  return app;
};
