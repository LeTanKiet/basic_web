import { db } from '../models/index.js';

class AdminController {
  async renderAdminDashboard(req, res) {
    const totalEarningsByMonthResult = await db.any(`
    SELECT 
    EXTRACT(MONTH FROM "completedAt") as month,
    SUM(amount) as total_earnings
  FROM 
    "transactions"
  WHERE 
    "completedAt" >= NOW() - INTERVAL '1 year'
  GROUP BY 
    month
  ORDER BY 
    month
    `);

    // Create an array with earnings for each month
    const totalEarningsByMonth = Array.from({ length: 12 }, (_, index) => {
      const monthData = totalEarningsByMonthResult.find((data) => data.month === index + 1);
      return monthData ? Number(monthData.total_earnings) : 0;
    });

    res.json({
      totalEarningsByMonth,
    });
  }

  async index(req, res) {
    const { userId } = req.context;
    const user = await db.oneOrNone('select * from "users" where id = $1', userId);

    const admin = user.role;
    const totalUsersResult = await db.one('SELECT COUNT(*) FROM "users"');
    const totalUsers = totalUsersResult.count;

    const totalProductsResult = await db.one('SELECT COUNT(*) FROM "products"');
    const totalProducts = totalProductsResult.count;

    const totalEarningsResult = await db.one('SELECT SUM(amount) FROM "transactions"');
    const totalEarnings = totalEarningsResult.sum;

    const deliveredOrdersResult = await db.one('SELECT COUNT(*) FROM "orders" WHERE status = $1', ['"COMPLETED"']);
    const deliveredOrders = deliveredOrdersResult.count;

    const recentOrdersResult = await db.any(
      'SELECT o.*, u.name as user_name FROM "orders" o JOIN "users" u ON o.user_id = u.id ORDER BY o.id DESC LIMIT 5',
    );
    const recentOrders = recentOrdersResult.map((order) => ({
      ...order,
      user_name: order.user_name,
    }));

    // Fetch data to draw the totalEarnings chart over the last 12 months
    const totalEarningsByMonthResult = await db.any(`
    SELECT 
    EXTRACT(MONTH FROM "completedAt") as month,
    SUM(amount) as total_earnings
  FROM 
    "transactions"
  WHERE 
    "completedAt" >= NOW() - INTERVAL '1 year'
  GROUP BY 
    month
  ORDER BY 
    month
    `);

    // Create an array with earnings for each month
    const totalEarningsByMonth = Array.from({ length: 12 }, (_, index) => {
      const monthData = totalEarningsByMonthResult.find((data) => data.month === index + 1);
      return monthData ? Number(monthData.total_earnings) : 0;
    });

    return res.render('admin_dashboard', {
      user,
      admin,
      totalUsers,
      totalProducts,
      totalEarnings,
      deliveredOrders,
      recentOrders,
      totalEarningsByMonth: JSON.stringify(totalEarningsByMonth),
    });
  }
}

export default new AdminController();
