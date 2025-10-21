import Contact from '../models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find(); 
  return contacts;
};