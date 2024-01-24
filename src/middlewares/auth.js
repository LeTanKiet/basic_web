import jwt from 'jsonwebtoken';
import { generateNewAccessToken } from '../utils/common.js';
import { db } from '../models/index.js';
import { ROLE } from '../utils/constants.js';

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

export async function checkAdminPermission(req, res, next) {
  const { userId } = req.context;
  const user = await db.oneOrNone('select * from "users" where id = $1', userId);

  if (user.role === ROLE.admin) return next();
  return res.render('error', {
    layout: 'no-header-footer-layout',
    error: "You don't have permission to reach this page.",
  });
}
