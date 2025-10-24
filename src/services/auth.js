import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';
import Session from '../db/models/Session.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashedPassword });
  newUser.password = undefined;

  return newUser;
};


export const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Invalid email or password');

  await Session.deleteOne({ user: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  await Session.create({ user: user._id, refreshToken });

  return { accessToken, refreshToken };
};


export const refreshService = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const session = await Session.findOne({ user: payload.userId, refreshToken });
    if (!session) throw createHttpError(401, 'Invalid refresh token');

    await Session.deleteOne({ user: payload.userId });

    const newAccessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: payload.userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    await Session.create({ user: payload.userId, refreshToken: newRefreshToken });

    return { accessToken: newAccessToken, newRefreshToken };
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }
};

export const logoutService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  await Session.deleteOne({ _id: session._id });
};

