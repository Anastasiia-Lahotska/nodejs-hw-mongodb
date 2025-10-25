import express from 'express';
import { registerController, loginController, refreshController, logoutController, sendResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlwares/validateBody.js';
import Joi from 'joi';

const router = express.Router();

const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

router.post('/register', ctrlWrapper(registerController));

router.post('/login', ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

router.post('/send-reset-email', validateBody(emailSchema), ctrlWrapper(sendResetEmailController));

router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;