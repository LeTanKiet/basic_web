import jwt from 'jsonwebtoken';
import { BASE_APP_URL } from './constants.js';

export const createToken = (user) => {
  const formattedUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(formattedUser, process.env.AT_SECRET, {
    expiresIn: process.env.AT_EXPIRES_TIME,
  });

  const refreshToken = jwt.sign(formattedUser, process.env.RT_SECRET, {
    expiresIn: process.env.RT_EXPIRES_TIME,
  });

  return { accessToken, refreshToken };
};

export const setCookies = (res, tokens) => {
  res.cookie('access_token', tokens.accessToken);
  res.cookie('refresh_token', tokens.refreshToken);
};

export const clearCookies = (res) => {
  res.cookie('access_token', '');
  res.cookie('refresh_token', '');
};

export function generateNewAccessToken(refreshToken) {
  try {
    const refreshTokenDecoded = jwt.verify(refreshToken, process.env.RT_SECRET);

    const { accessToken } = createToken(refreshTokenDecoded);

    return { accessToken, userId: refreshTokenDecoded.id };
  } catch (error) {
    console.error('error: ', error);
    return '';
  }
}

export const getFileUrl = (filename) => {
  return `${BASE_APP_URL}/uploads/${filename}`;
};
