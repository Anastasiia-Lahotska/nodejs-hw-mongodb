import Contact from '../models/contact.js';

/*export const getAllContacts = async () => {
  const contacts = await Contact.find(); 
  return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};

export const getAllContacts = async () => {
  return await Contact.find();
};*/

export const getAllContacts = async (page = 1, perPage = 10, sortBy = "name", sortOrder = "asc") => {
  const pageNum = Math.max(1, Number(page) || 1);
  const perPageNum = Math.max(1, Number(perPage) || 10);

  const skip = (pageNum - 1) * perPageNum;
  const totalItems = await Contact.countDocuments();
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / perPageNum);

  const sortDirection = sortOrder === "desc" ? -1 : 1;

  const contacts = await Contact.find()
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

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (contactId, data) => {
  return await Contact.findByIdAndUpdate(contactId, data, { new: true });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
