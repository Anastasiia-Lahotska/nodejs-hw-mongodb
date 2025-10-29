import { registerUser, loginService, refreshService, logoutService } from '../services/auth.js';

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