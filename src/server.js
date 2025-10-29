import 'dotenv/config';
console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import { ensureEnv } from './utils/ensureEnv.js';
/*import { getContactsController, getContactByIdController } from './controllers/contacts.js';*/
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlwares/errorHandler.js';
import { notFoundHandler } from './middlwares/notFoundHandler.js';

export const setupServer = () => {
  ensureEnv();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(pino());

  /*app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController);*/
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler)

  /*app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });*/

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
