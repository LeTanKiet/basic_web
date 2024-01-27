import { db } from '../models/index.js';

class transactionController {
  async getTransactionsByStatusAndType(req, res) {
    const { status, type } = req.query;
    let query = 'SELECT * FROM transactions';
    let conditions = [];
    let params = [];

    if (status) {
      conditions.push('status = $1');
      params.push(status);
    }

    if (type) {
      conditions.push('type = $' + (params.length + 1));
      params.push(type);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
      const transactions = await db.any(query, params);
      console.log('transactions:', transactions);

      return res.json({ success: true, transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ success: false, error: 'Error fetching transactions' });
    }
  }
}

export default new transactionController();
