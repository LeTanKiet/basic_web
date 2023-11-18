import pgPromise from 'pg-promise';
const pgp = pgPromise();

import { connectStr } from '../configs/connectStr.js';

export const db = pgp(connectStr);
