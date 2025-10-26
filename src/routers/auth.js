import express from 'express';
import { registerController, loginController, refreshController, logoutController, sendResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlwares/validateBody.js';
import { emailSchema, resetPasswordSchema } from '../validation/auth.js';

const router = express.Router();;

router.post('/register', ctrlWrapper(registerController));

router.post('/login', ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

router.post('/send-reset-email', validateBody(emailSchema), ctrlWrapper(sendResetEmailController));

// eslint-disable-next-line no-undef
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;