import bcrypt from 'bcrypt';
import { registerUser, loginService, refreshService, logoutService } from '../services/auth.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 400, message: 'Email and password are required' });
  }

  const { accessToken, refreshToken } = await loginService(email, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ status: 401, message: 'Refresh token missing' });
  }

  const { accessToken, newRefreshToken } = await refreshService(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutController = async (req, res, next) => {
  try {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ status: 401, message: 'Refresh token missing' });
  }

  await logoutService(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(204).send();
  } catch (error) {
    next(error)
}
};

// eslint-disable-next-line no-unused-vars
export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found!');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Hello, ${user.name || 'User'}!</p>
        <p>Click the link below to reset your password (valid for 5 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {}
    });
  } catch (err) {
    console.error('Error while sending reset email:', err);

    if (err.status) return next(err);
    next(createHttpError(500, 'Failed to send the email, please try again later.'));
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};