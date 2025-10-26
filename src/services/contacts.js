import { Contact } from '../db/models/Contact.js';

export const getAllContacts = async (userId, page = 1, perPage = 10, sortBy = "name", sortOrder = "asc") => {
  const pageNum = Math.max(1, Number(page) || 1);
  const perPageNum = Math.max(1, Number(perPage) || 10);

  const skip = (pageNum - 1) * perPageNum;
  const totalItems = await Contact.countDocuments({ userId });
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / perPageNum);

  const sortDirection = sortOrder === "desc" ? -1 : 1;

  const contacts = await Contact.find({ userId })
    .skip(skip)
    .limit(perPageNum)
    .sort({ [sortBy]: sortDirection })
    .select("-__v")
    .lean();

  return {
    data: contacts,
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    hasPreviousPage: pageNum > 1,
    hasNextPage: pageNum < totalPages,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (contactId, userId, data) => {
  const updated = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true }
  );
  return updated;
};

export const deleteContact = async (contactId, userId) => {
  const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });
  return deleted;
};