import { useState } from 'react';
import { Plus, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseItem } from '../../data/mockData';
import { formatRs, formatDate } from '../../lib/utils';

function CreatePODialog({ onClose }: { onClose: () => void }) {
  const { auth, suppliers, products, addPurchase } = useApp();
  const shopSuppliers = suppliers.filter(s => s.shop_id === auth.shop?.id);
  const shopProducts = products.filter(p => p.shop_id === auth.shop?.id);
  const [supplierId, setSupplierId] = useState(shopSuppliers[0]?.id || '');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selProduct, setSelProduct] = useState(shopProducts[0]?.id || '');
  const [selQty, setSelQty] = useState(1);
  const [selCost, setSelCost] = useState(0);

  function addItem() {
    const product = shopProducts.find(p => p.id === selProduct);
    if (!product) return;
    setItems(prev => {
      const exist = prev.find(i => i.product_id === selProduct);
      if (exist) return prev.map(i => i.product_id === selProduct ? { ...i, qty: i.qty + selQty } : i);
      return [...prev, { product_id: product.id, product_name: product.name, qty: selQty, unit_cost: selCost || product.cost_price }];
    });
  }

  const totalCost = items.reduce((s, i) => s + i.qty * i.unit_cost, 0);

  function handleSave() {
    const supplier = shopSuppliers.find(s => s.id === supplierId);
    addPurchase({
      shop_id: auth.shop!.id,
      supplier_id: supplierId,
      supplier_name: supplier?.name || '',
      items,
      total_cost: totalCost,
      created_at: new Date().toISOString(),
      created_by: auth.user?.name || '',
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create Purchase Order</h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Supplier</label>
            <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
              {shopSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <p className="text-slate-300 text-sm font-medium mb-2">Add Products</p>
            <div className="flex gap-2">
              <select value={selProduct} onChange={e => setSelProduct(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                {shopProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" value={selQty} onChange={e => setSelQty(Number(e.target.value))} min={1} className="w-20 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-indigo-500" placeholder="Qty" />
              <input type="number" value={selCost || ''} onChange={e => setSelCost(Number(e.target.value))} className="w-28 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Cost Rs." />
              <button onClick={addItem} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"><Plus size={14} /></button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-2 text-slate-400 text-xs">Product</th>
                    <th className="text-right px-4 py-2 text-slate-400 text-xs">Qty</th>
                    <th className="text-right px-4 py-2 text-slate-400 text-xs">Unit Cost</th>
                    <th className="text-right px-4 py-2 text-slate-400 text-xs">Total</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.product_id} className="border-b border-slate-700/50">
                      <td className="px-4 py-2 text-white text-sm">{item.product_name}</td>
                      <td className="px-4 py-2 text-slate-300 text-sm text-right">{item.qty}</td>
                      <td className="px-4 py-2 text-slate-300 text-sm text-right font-mono">{formatRs(item.unit_cost)}</td>
                      <td className="px-4 py-2 text-indigo-300 text-sm text-right font-mono font-semibold">{formatRs(item.qty * item.unit_cost)}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => setItems(prev => prev.filter(i => i.product_id !== item.product_id))} className="text-slate-600 hover:text-rose-400 transition-colors"><X size={13} /></button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right text-slate-300 font-semibold text-sm">Total Cost:</td>
                    <td className="px-4 py-2 text-emerald-400 font-bold font-mono text-sm text-right">{formatRs(totalCost)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={items.length === 0} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors">
            Receive Stock & Save PO
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Purchases() {
  const { auth, purchases, suppliers } = useApp();
  const shopPurchases = purchases.filter(p => p.shop_id === auth.shop?.id);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="text-slate-400 text-sm mt-1">Supplier orders and stock receiving</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} /> Create Purchase Order
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['PO #', 'Supplier', 'Items', 'Total Cost', 'By', 'Date'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shopPurchases.map(po => (
              <tr key={po.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5 text-indigo-400 text-sm font-mono font-medium">{po.id.toUpperCase()}</td>
                <td className="px-4 py-3.5 text-white text-sm">{po.supplier_name}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{po.items.length} items</td>
                <td className="px-4 py-3.5 text-emerald-400 text-sm font-mono font-semibold">{formatRs(po.total_cost)}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{po.created_by}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{formatDate(po.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shopPurchases.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
            <p>No purchase orders yet</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Suppliers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.filter(s => s.shop_id === auth.shop?.id).map(sup => (
            <div key={sup.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-white font-medium">{sup.name}</p>
              <p className="text-slate-400 text-sm mt-1">{sup.phone}</p>
              <p className="text-slate-500 text-xs mt-0.5">{sup.city}</p>
            </div>
          ))}
        </div>
      </div>

      {showCreate && <CreatePODialog onClose={() => setShowCreate(false)} />}
    </div>
  );
}
