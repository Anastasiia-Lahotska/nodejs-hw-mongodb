/*import { readContacts } from "../utils/readContacts.js";
/*import { writeContacts } from "../utils/writeContacts.js";
import { createFakeContact} from "../utils/createFakeContact.js";*//*

export const getAllContacts = async () => {
    return await readContacts();
};

console.log(await getAllContacts());*/
import 'dotenv/config';
import { initMongoConnection } from '../db/initMongoConnection.js';
import { getAllContacts } from '../services/contacts.js';

const run = async () => {
  await initMongoConnection();

  const contacts = await getAllContacts();
  console.log(contacts);

  process.exit(); // щоб скрипт завершився після виводу
};

run();