import jwt from 'jsonwebtoken';
import { generateNewAccessToken } from '../utils/common.js';

export function authentication(req, res, next) {
  const accessToken = req.cookies['access_token'];
  const refreshToken = req.cookies['refresh_token'];

  if (!accessToken) return res.render('home', { user: null });

  try {
    const decoded = jwt.verify(accessToken, process.env.AT_SECRET);
    req.context = { userId: decoded.id };

    return next();
  } catch (error) {
    const { accessToken: newAccessToken, userId } = generateNewAccessToken(refreshToken);
    res.cookie('access_token', newAccessToken);
    req.context = { userId };

    if (newAccessToken) {
      return next();
    } else {
      return res.render('home', { user: null });
    }
  }
}
