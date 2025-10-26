import { Router } from 'express';
import { getContactsController, getContactByIdController, createContactController, updateContactController, deleteContactController
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlwares/validateBody.js';
import { isValidId } from '../middlwares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import authenticate from '../middlwares/authenticate.js';
import { upload } from '../middlwares/upload.js';

const router = Router();

router.use(authenticate);
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
/*router.put('/:contactId', ctrlWrapper(updateContactController));*/
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;