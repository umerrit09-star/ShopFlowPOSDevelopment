import { TrendingUp, ShoppingCart, Package, DollarSign, AlertTriangle, Users, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRs, formatDateTime } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
  { day: 'Mon', sales: 45200 }, { day: 'Tue', sales: 62100 }, { day: 'Wed', sales: 38500 },
  { day: 'Thu', sales: 71800 }, { day: 'Fri', sales: 88900 }, { day: 'Sat', sales: 95400 },
  { day: 'Sun', sales: 54200 },
];

export default function Dashboard() {
  const { auth, products, sales, customers, expenses } = useApp();
  const shopSales = sales.filter(s => s.shop_id === auth.shop?.id);
  const shopProducts = products.filter(p => p.shop_id === auth.shop?.id);
  const shopExpenses = expenses.filter(e => e.shop_id === auth.shop?.id);

  const todayRevenue = shopSales.reduce((s, sale) => s + sale.total, 0);
  const totalExpenses = shopExpenses.reduce((s, e) => s + e.amount, 0);
  const lowStockCount = shopProducts.filter(p => p.stock_quantity <= p.min_stock_alert).length;

  const stats = [
    { label: "Today's Revenue", value: formatRs(todayRevenue), icon: TrendingUp, color: 'emerald', delta: '+12.4%' },
    { label: 'Total Sales', value: shopSales.length, icon: ShoppingCart, color: 'indigo', delta: '+3 today' },
    { label: 'Total Expenses', value: formatRs(totalExpenses), icon: DollarSign, color: 'amber', delta: 'This month' },
    { label: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, color: 'rose', delta: 'Need restock' },
    { label: 'Products', value: shopProducts.length, icon: Package, color: 'slate', delta: 'In catalog' },
    { label: 'Customers', value: customers.filter(c => c.shop_id === auth.shop?.id).length, icon: Users, color: 'purple', delta: 'Registered' },
  ];

  const COLOR_MAP: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-900/30',
    indigo: 'text-indigo-400 bg-indigo-900/30',
    amber: 'text-amber-400 bg-amber-900/30',
    rose: 'text-rose-400 bg-rose-900/30',
    slate: 'text-slate-300 bg-slate-800/50',
    purple: 'text-purple-400 bg-purple-900/30',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {auth.user?.name.split(' ')[0]}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{auth.shop?.name} — {new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, delta }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">{label}</p>
                <p className="text-2xl font-bold text-white font-mono">{value}</p>
                <p className="text-slate-500 text-xs mt-1">{delta}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${COLOR_MAP[color]}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Weekly Sales Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                formatter={(v: any) => [formatRs(Number(v)), 'Sales']}
              />
              <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {shopSales.slice(0, 5).map(sale => (
              <div key={sale.id} className="flex items-start justify-between py-2 border-b border-slate-800/50 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{sale.invoice_id}</p>
                  <p className="text-slate-500 text-xs">{sale.cashier_name}</p>
                  <p className="text-slate-600 text-xs">{formatDateTime(sale.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-sm font-semibold font-mono">{formatRs(sale.total)}</p>
                  <span className="text-xs text-slate-500 capitalize">{sale.payment_method}</span>
                </div>
              </div>
            ))}
            {shopSales.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No sales yet today</p>}
          </div>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-amber-300 font-semibold text-sm">{lowStockCount} Items Low on Stock</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {shopProducts.filter(p => p.stock_quantity <= p.min_stock_alert).map(p => (
              <div key={p.id} className="bg-amber-900/20 rounded-lg p-3">
                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                <p className="text-amber-400 text-xs mt-1">{p.stock_quantity} {p.unit} left (alert: {p.min_stock_alert})</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
