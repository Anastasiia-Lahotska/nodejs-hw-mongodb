import createError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc" } = req.query;

  const paginationData = await getAllContacts(userId, page, perPage, sortBy, sortOrder);

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: {
      data: paginationData.data,
      page: paginationData.page,
      perPage: paginationData.perPage,
      totalItems: paginationData.totalItems,
      totalPages: paginationData.totalPages,
      hasPreviousPage: paginationData.hasPreviousPage,
      hasNextPage: paginationData.hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const newContact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const updated = await updateContact(contactId, userId, req.body);

  if (!updated) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: updated,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deleted = await deleteContact(contactId, userId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};