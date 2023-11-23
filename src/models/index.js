import pgPromise from 'pg-promise';
const pgp = pgPromise();

import { connectStr } from '../configs/connectStr.js';

const db = pgp(connectStr);

export { db };
