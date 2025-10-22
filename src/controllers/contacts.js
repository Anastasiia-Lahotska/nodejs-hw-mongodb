import createError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';


export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            throw createError( 404, 'Contact not found' );
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
};

export const createContactController = async (req, res) => {
        const newContact = await createContact(req.body);
        res.status(201).json({
            status: 201,
            message: 'Contact created successfully!',
      data: newContact,
    });
};

export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const updated = await updateContact(contactId, req.body);
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
    const deleted = await deleteContact(contactId);
    if (!deleted) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
    /*res.status(200).json({
      status: 200,
      message: `Contact ${contactId} deleted successfully!`,
      data: deleted,
    });*/
};