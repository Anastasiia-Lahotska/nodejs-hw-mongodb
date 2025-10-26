import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlwares/errorHandler.js';
import { notFoundHandler } from './middlwares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pino());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const swaggerPath = path.resolve(__dirname, '../docs/openapi.yaml');
  const swaggerDocument = YAML.load(swaggerPath);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler)

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });

  return app;
};
