import { useApp } from '../../context/AppContext';
import { formatRs } from '../../lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart } from 'lucide-react';

const DAILY_DATA = [
  { date: 'Sep 2', revenue: 38500, expenses: 5200 },
  { date: 'Sep 3', revenue: 52100, expenses: 3800 },
  { date: 'Sep 4', revenue: 41800, expenses: 4500 },
  { date: 'Sep 5', revenue: 68200, expenses: 2100 },
  { date: 'Sep 6', revenue: 75400, expenses: 6800 },
  { date: 'Sep 7', revenue: 91200, expenses: 4200 },
  { date: 'Sep 8', revenue: 58600, expenses: 3900 },
];

const TOP_PRODUCTS_DATA = [
  { name: 'Nestle Pure Life', sold: 84, revenue: 5880 },
  { name: 'Olpers Milk 1L', sold: 67, revenue: 11055 },
  { name: 'Lays Classic', sold: 52, revenue: 5200 },
  { name: 'Lipton Tea', sold: 38, revenue: 18620 },
  { name: 'Sunridge Rice', sold: 24, revenue: 32400 },
];

export default function Reports() {
  const { auth, sales, expenses, products } = useApp();
  const shopSales = sales.filter(s => s.shop_id === auth.shop?.id);
  const shopExpenses = expenses.filter(e => e.shop_id === auth.shop?.id);
  const shopProducts = products.filter(p => p.shop_id === auth.shop?.id);

  const grossRevenue = shopSales.reduce((s, sale) => s + sale.total, 0);
  const cogs = shopProducts.reduce((s, p) => s + p.cost_price * (100 - p.stock_quantity), 0);
  const totalExpenses = shopExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossRevenue - Math.max(0, cogs) - totalExpenses;
  const stockValuation = shopProducts.reduce((s, p) => s + p.cost_price * p.stock_quantity, 0);

  const summaryCards = [
    { label: 'Gross Revenue', value: formatRs(grossRevenue), icon: TrendingUp, color: 'emerald', bg: 'bg-emerald-900/20 border-emerald-800/30' },
    { label: 'Total Expenses', value: formatRs(totalExpenses), icon: TrendingDown, color: 'rose', bg: 'bg-rose-900/20 border-rose-800/30' },
    { label: 'Net Profit', value: formatRs(Math.max(0, netProfit)), icon: DollarSign, color: netProfit >= 0 ? 'emerald' : 'rose', bg: netProfit >= 0 ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-rose-900/20 border-rose-800/30' },
    { label: 'Stock Valuation', value: formatRs(stockValuation), icon: Package, color: 'indigo', bg: 'bg-indigo-900/20 border-indigo-800/30' },
    { label: 'Total Transactions', value: shopSales.length, icon: ShoppingCart, color: 'slate', bg: 'bg-slate-800/50 border-slate-700' },
  ];

  const COLOR_MAP: Record<string, string> = {
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    indigo: 'text-indigo-400',
    slate: 'text-slate-300',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Business performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`border rounded-xl p-5 ${bg}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs mb-2">{label}</p>
                <p className={`text-xl font-bold font-mono ${COLOR_MAP[color]}`}>{value}</p>
              </div>
              <Icon size={18} className={COLOR_MAP[color]} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Daily Sales Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={DAILY_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                formatter={(v: any, name: any) => [formatRs(Number(v)), name === 'revenue' ? 'Revenue' : 'Expenses']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Top 5 Best-Selling Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={TOP_PRODUCTS_DATA} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                formatter={(v: any, name: any) => [name === 'sold' ? `${v} units` : formatRs(Number(v)), name === 'sold' ? 'Units Sold' : 'Revenue']}
              />
              <Bar dataKey="sold" fill="#4F46E5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Expense Breakdown</h3>
        <div className="space-y-3">
          {shopExpenses.map(exp => {
            const pct = totalExpenses > 0 ? (exp.amount / totalExpenses) * 100 : 0;
            return (
              <div key={exp.id} className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">{exp.category}</span>
                </div>
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-slate-400 text-sm font-mono w-28 text-right">{formatRs(exp.amount)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
