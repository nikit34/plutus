import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const analyticsRouter = Router();

// Dashboard overview — totals + today stats + activity feed
analyticsRouter.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totals, today, yesterday, activity, earnings7m, activeProducts] = await Promise.all([
      query(
        `SELECT
           COALESCE(SUM(amount_cents - platform_fee_cents),0)::bigint AS earnings_cents,
           COUNT(*)::int AS sales_count
         FROM purchases WHERE seller_id=$1 AND status='paid'`,
        [userId]
      ),
      query(
        `SELECT
           COALESCE(SUM(pu.amount_cents - pu.platform_fee_cents),0)::bigint AS earnings_cents,
           COUNT(*)::int AS sales_count
         FROM purchases pu
         WHERE pu.seller_id=$1 AND pu.status='paid' AND pu.paid_at >= (now() - INTERVAL '24 hours')`,
        [userId]
      ),
      query(
        `SELECT
           COALESCE(SUM(pu.amount_cents - pu.platform_fee_cents),0)::bigint AS earnings_cents,
           COUNT(*)::int AS sales_count
         FROM purchases pu
         WHERE pu.seller_id=$1 AND pu.status='paid'
           AND pu.paid_at >= (now() - INTERVAL '48 hours')
           AND pu.paid_at <  (now() - INTERVAL '24 hours')`,
        [userId]
      ),
      query(
        `SELECT pu.id, pu.amount_cents, pu.paid_at, p.id AS product_id, p.title AS product_title
         FROM purchases pu JOIN products p ON p.id = pu.product_id
         WHERE pu.seller_id=$1 AND pu.status='paid'
         ORDER BY pu.paid_at DESC LIMIT 10`,
        [userId]
      ),
      query(
        `SELECT date_trunc('month', paid_at)::date AS month,
                COALESCE(SUM(amount_cents - platform_fee_cents),0)::bigint AS earnings_cents
         FROM purchases
         WHERE seller_id=$1 AND status='paid' AND paid_at >= (now() - INTERVAL '7 months')
         GROUP BY 1 ORDER BY 1`,
        [userId]
      ),
      query("SELECT COUNT(*)::int AS n FROM products WHERE user_id=$1 AND status='active'", [userId]),
    ]);

    // Today views
    const viewsToday = await query(
      `SELECT COUNT(*)::int AS n FROM events WHERE user_id=$1 AND type='view' AND created_at >= (now() - INTERVAL '24 hours')`,
      [userId]
    );
    const viewsYesterday = await query(
      `SELECT COUNT(*)::int AS n FROM events WHERE user_id=$1 AND type='view' AND created_at >= (now() - INTERVAL '48 hours') AND created_at < (now() - INTERVAL '24 hours')`,
      [userId]
    );

    const pct = (cur, prev) => {
      if (!prev) return cur > 0 ? 100 : 0;
      return Math.round(((cur - prev) / prev) * 1000) / 10;
    };

    res.json({
      totalEarnings: Number(totals.rows[0].earnings_cents) / 100,
      totalSales: totals.rows[0].sales_count,
      activeProducts: activeProducts.rows[0].n,
      today: {
        earnings: Number(today.rows[0].earnings_cents) / 100,
        sales: today.rows[0].sales_count,
        views: viewsToday.rows[0].n,
        earningsChange: pct(Number(today.rows[0].earnings_cents), Number(yesterday.rows[0].earnings_cents)),
        salesChange: pct(today.rows[0].sales_count, yesterday.rows[0].sales_count),
        viewsChange: pct(viewsToday.rows[0].n, viewsYesterday.rows[0].n),
      },
      activity: activity.rows.map((r) => ({
        id: String(r.id),
        type: 'sale',
        productId: String(r.product_id),
        productTitle: r.product_title,
        amount: r.amount_cents / 100,
        time: r.paid_at,
      })),
      earningsHistory: earnings7m.rows.map((r) => ({
        month: new Date(r.month).toLocaleString('en-US', { month: 'short' }),
        amount: Number(r.earnings_cents) / 100,
      })),
    });
  } catch (err) { next(err); }
});

analyticsRouter.get('/products', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.id, p.title, p.status, p.theme, p.price_cents,
              COALESCE(pur.sales, 0) AS sales,
              COALESCE(pur.revenue_cents, 0) AS revenue_cents,
              COALESCE(ev.views, 0) AS views,
              COALESCE(ev_prev.views, 0) AS views_prev
       FROM products p
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS sales, SUM(amount_cents - platform_fee_cents)::bigint AS revenue_cents FROM purchases WHERE status='paid' GROUP BY product_id) pur ON pur.product_id = p.id
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS views FROM events WHERE type='view' AND created_at >= now() - INTERVAL '30 days' GROUP BY product_id) ev ON ev.product_id = p.id
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS views FROM events WHERE type='view' AND created_at >= now() - INTERVAL '60 days' AND created_at < now() - INTERVAL '30 days' GROUP BY product_id) ev_prev ON ev_prev.product_id = p.id
       WHERE p.user_id=$1`,
      [req.user.id]
    );
    res.json({
      products: rows.map((r) => ({
        id: String(r.id),
        title: r.title,
        status: r.status,
        theme: r.theme,
        price: r.price_cents / 100,
        sales: r.sales,
        revenue: Number(r.revenue_cents) / 100,
        views: r.views,
        conversionRate: r.views > 0 ? Math.round((r.sales / r.views) * 1000) / 10 : 0,
        trend: r.views_prev > 0 ? Math.round(((r.views - r.views_prev) / r.views_prev) * 1000) / 10 : 0,
      })),
    });
  } catch (err) { next(err); }
});
