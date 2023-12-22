import jwt from 'jsonwebtoken';

export const createToken = (user) => {
  const formattedUser = {
    id: user.id,
    username: user.username,
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
