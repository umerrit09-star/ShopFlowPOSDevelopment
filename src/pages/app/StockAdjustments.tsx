import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdjustmentReason } from '../../data/mockData';
import { formatDateTime } from '../../lib/utils';

const REASON_LABELS: Record<AdjustmentReason, string> = {
  damaged: 'Damaged',
  expired: 'Expired',
  inventory_count: 'Inventory Count',
  other: 'Other',
};

const REASON_COLORS: Record<AdjustmentReason, string> = {
  damaged: 'text-rose-400 bg-rose-900/30',
  expired: 'text-amber-400 bg-amber-900/30',
  inventory_count: 'text-indigo-400 bg-indigo-900/30',
  other: 'text-slate-400 bg-slate-800',
};

function AdjDialog({ onClose, onSave }: { onClose: () => void; onSave: (d: any) => void }) {
  const { auth, products } = useApp();
  const shopProducts = products.filter(p => p.shop_id === auth.shop?.id);
  const [form, setForm] = useState({ product_id: shopProducts[0]?.id || '', adjustment_qty: 0, reason: 'damaged' as AdjustmentReason, notes: '' });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Record Stock Adjustment</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Product</label>
            <select value={form.product_id} onChange={e => set('product_id', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
              {shopProducts.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Adjustment Qty</label>
              <input type="number" value={form.adjustment_qty} onChange={e => set('adjustment_qty', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="-6 or +10" />
              <p className="text-slate-500 text-xs mt-1">Use negative for removals</p>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Reason</label>
              <select value={form.reason} onChange={e => set('reason', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                {(Object.keys(REASON_LABELS) as AdjustmentReason[]).map(r => <option key={r} value={r}>{REASON_LABELS[r]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" placeholder="Describe the adjustment..." />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors">Save Adjustment</button>
        </div>
      </div>
    </div>
  );
}

export default function StockAdjustments() {
  const { auth, adjustments, products, addAdjustment } = useApp();
  const shopAdj = adjustments.filter(a => a.shop_id === auth.shop?.id);
  const [showDialog, setShowDialog] = useState(false);

  function handleSave(data: any) {
    const product = products.find(p => p.id === data.product_id);
    addAdjustment({
      ...data,
      shop_id: auth.shop!.id,
      product_name: product?.name || '',
      created_by: auth.user?.name || '',
      created_at: new Date().toISOString(),
    });
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock Adjustments</h1>
          <p className="text-slate-400 text-sm mt-1">Manual inventory corrections and audit log</p>
        </div>
        <button onClick={() => setShowDialog(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} /> Record Adjustment
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Product', 'Qty Change', 'Reason', 'Notes', 'By', 'Date'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shopAdj.map(adj => (
              <tr key={adj.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5 text-white text-sm font-medium">{adj.product_name}</td>
                <td className="px-4 py-3.5">
                  <span className={`font-bold font-mono text-sm ${adj.adjustment_qty > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {adj.adjustment_qty > 0 ? `+${adj.adjustment_qty}` : adj.adjustment_qty}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${REASON_COLORS[adj.reason]}`}>
                    {REASON_LABELS[adj.reason]}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-sm max-w-xs truncate">{adj.notes}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{adj.created_by}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{formatDateTime(adj.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shopAdj.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <ClipboardList size={32} className="mx-auto mb-3 opacity-30" />
            <p>No adjustments recorded</p>
          </div>
        )}
      </div>

      {showDialog && <AdjDialog onClose={() => setShowDialog(false)} onSave={handleSave} />}
    </div>
  );
}
