import { useState } from 'react';
import { Search, Receipt, RotateCcw, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../data/mockData';
import { formatRs, formatDateTime } from '../../lib/utils';

const PM_ICON: Record<string, string> = { cash: '💵', card: '💳', digital_qr: '📲' };
const PM_LABEL: Record<string, string> = { cash: 'Cash', card: 'Card', digital_qr: 'Digital QR' };

function ReturnModal({ sale, onClose, onReturn }: { sale: Sale; onClose: () => void; onReturn: (items: { product_id: string; qty: number }[]) => void }) {
  const [returnQtys, setReturnQtys] = useState<Record<string, number>>({});

  const returnableItems = sale.items.filter(i => i.qty - i.returned_qty > 0);

  function handleReturn() {
    const returns = Object.entries(returnQtys)
      .filter(([, qty]) => qty > 0)
      .map(([product_id, qty]) => ({ product_id, qty }));
    onReturn(returns);
    onClose();
  }

  const refundAmount = returnableItems.reduce((s, item) => {
    const rQty = returnQtys[item.product_id] || 0;
    return s + rQty * item.unit_price;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Process Return — {sale.invoice_id}</h2>
          <p className="text-slate-400 text-sm mt-1">Select items and quantities to return</p>
        </div>
        <div className="p-6 space-y-3">
          {returnableItems.map(item => {
            const maxReturn = item.qty - item.returned_qty;
            return (
              <div key={item.product_id} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.product_name}</p>
                  <p className="text-slate-500 text-xs">Max returnable: {maxReturn} × {formatRs(item.unit_price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={maxReturn}
                    value={returnQtys[item.product_id] || ''}
                    onChange={e => setReturnQtys(q => ({ ...q, [item.product_id]: Math.min(Number(e.target.value), maxReturn) }))}
                    placeholder="0"
                    className="w-20 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-500 text-xs">qty</span>
                </div>
              </div>
            );
          })}
          {refundAmount > 0 && (
            <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-xl p-4 mt-4">
              <div className="flex justify-between">
                <span className="text-emerald-300 font-medium text-sm">Refund Amount</span>
                <span className="text-emerald-300 font-bold font-mono text-lg">{formatRs(refundAmount)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={handleReturn} disabled={refundAmount === 0} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors">
            Process Return
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sales() {
  const { auth, sales, processReturn } = useApp();
  const shopSales = sales.filter(s => s.shop_id === auth.shop?.id);
  const [search, setSearch] = useState('');
  const [returnSale, setReturnSale] = useState<Sale | null>(null);

  const filtered = shopSales.filter(s =>
    s.invoice_id.toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    s.cashier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Sales History</h1>
        <p className="text-slate-400 text-sm mt-1">{shopSales.length} transactions</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search invoice, customer, cashier..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Invoice', 'Customer', 'Items', 'Total', 'Payment', 'Cashier', 'Date', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sale => (
              <tr key={sale.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5 text-indigo-400 font-mono text-sm font-medium">{sale.invoice_id}</td>
                <td className="px-4 py-3.5 text-slate-300 text-sm">{sale.customer_name || '—'}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{sale.items.length}</td>
                <td className="px-4 py-3.5 text-emerald-400 font-mono text-sm font-semibold">{formatRs(sale.total)}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">
                  <span className="flex items-center gap-1">
                    {PM_ICON[sale.payment_method]} {PM_LABEL[sale.payment_method]}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{sale.cashier_name}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs">{formatDateTime(sale.created_at)}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    sale.status === 'completed' ? 'bg-emerald-900/40 text-emerald-400' :
                    sale.status === 'returned' ? 'bg-rose-900/40 text-rose-400' :
                    'bg-amber-900/40 text-amber-400'
                  }`}>
                    {sale.status === 'partial_return' ? 'Partial Return' : sale.status === 'returned' ? 'Returned' : 'Completed'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {sale.status !== 'returned' && (
                    <button
                      onClick={() => setReturnSale(sale)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-900/20 rounded-lg text-xs transition-colors"
                    >
                      <RotateCcw size={12} /> Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Receipt size={32} className="mx-auto mb-3 opacity-30" />
            <p>No sales found</p>
          </div>
        )}
      </div>

      {returnSale && (
        <ReturnModal
          sale={returnSale}
          onClose={() => setReturnSale(null)}
          onReturn={(items) => processReturn(returnSale.id, items)}
        />
      )}
    </div>
  );
}
