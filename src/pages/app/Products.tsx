import { useState, useRef } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Tag, Printer, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../data/mockData';
import { formatRs, generateSKU } from '../../lib/utils';

const UNITS = ['Pcs', 'Kg', 'Ltr', 'Pack', 'Box', 'Dozen', 'Gram'];

function ProductDrawer({ product, onClose, onSave }: { product?: Product; onClose: () => void; onSave: (p: any) => void }) {
  const { auth, categories } = useApp();
  const shopCats = categories.filter(c => c.shop_id === auth.shop?.id);
  const [form, setForm] = useState<Partial<Product>>(product || {
    shop_id: auth.shop?.id, name: '', sku: generateSKU(), barcode: '',
    category_id: shopCats[0]?.id || '', brand: '', unit: 'Pcs',
    cost_price: 0, selling_price: 0, stock_quantity: 0, min_stock_alert: 10, status: 'active'
  });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md flex flex-col animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{product ? 'Edit Product' : 'Add Product'}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Product Name *</label>
            <input value={form.name || ''} onChange={e => set('name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">SKU</label>
              <div className="flex gap-2">
                <input value={form.sku || ''} onChange={e => set('sku', e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
                <button onClick={() => set('sku', generateSKU())} className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"><RefreshCw size={14} /></button>
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Barcode</label>
              <input value={form.barcode || ''} onChange={e => set('barcode', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Category</label>
              <select value={form.category_id || ''} onChange={e => set('category_id', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                {shopCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Unit</label>
              <select value={form.unit || 'Pcs'} onChange={e => set('unit', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Brand</label>
            <input value={form.brand || ''} onChange={e => set('brand', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Cost Price (Rs.)</label>
              <input type="number" value={form.cost_price || ''} onChange={e => set('cost_price', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Selling Price (Rs.)</label>
              <input type="number" value={form.selling_price || ''} onChange={e => set('selling_price', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Stock Qty</label>
              <input type="number" value={form.stock_quantity ?? ''} onChange={e => set('stock_quantity', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Min Alert Level</label>
              <input type="number" value={form.min_stock_alert ?? ''} onChange={e => set('min_stock_alert', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-700 text-slate-400 rounded-lg text-sm hover:text-white transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors">
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BarcodePrintModal({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    if (!printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Barcode Labels</title><style>
      body{font-family:monospace;margin:0;padding:16px;background:white;}
      .label{display:inline-block;border:1px solid #000;padding:8px;margin:4px;width:180px;text-align:center;vertical-align:top;}
      .barcode{font-size:24px;letter-spacing:4px;font-weight:bold;margin:4px 0;}
      .name{font-size:10px;margin-bottom:2px;font-weight:bold;}
      .price{font-size:14px;font-weight:bold;}
    </style></head><body>${printRef.current.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl animate-fadeIn">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Barcode Label Generator</h2>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            <Printer size={15} /> Print Labels
          </button>
        </div>
        <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">{p.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 text-sm font-mono">{formatRs(p.selling_price)}</span>
                <input
                  type="number" min={1} max={20}
                  value={qty[p.id] || 1}
                  onChange={e => setQty(q => ({ ...q, [p.id]: Number(e.target.value) }))}
                  className="w-16 bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-500 text-xs">labels</span>
              </div>
            </div>
          ))}
        </div>
        <div ref={printRef} className="hidden">
          {products.map(p =>
            Array.from({ length: qty[p.id] || 1 }).map((_, i) => (
              <div key={`${p.id}-${i}`} className="label">
                <div className="name">{p.name}</div>
                <div className="barcode">||||| ||||| |||||</div>
                <div style={{ fontSize: 9 }}>{p.barcode || p.sku}</div>
                <div className="price">Rs. {p.selling_price}</div>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { auth, products, categories, addProduct, updateProduct, deleteProduct } = useApp();
  const shopProducts = products.filter(p => p.shop_id === auth.shop?.id);
  const shopCats = categories.filter(c => c.shop_id === auth.shop?.id);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showDrawer, setShowDrawer] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [showBarcodes, setShowBarcodes] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = shopProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search) || p.barcode.includes(search);
    const matchCat = catFilter === 'all' || p.category_id === catFilter;
    return matchSearch && matchCat;
  });

  function toggleSelect(id: string) {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  }

  const selectedProducts = shopProducts.filter(p => selectedIds.includes(p.id));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{shopProducts.length} products in catalog</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setShowBarcodes(true)}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Printer size={15} />
              Print {selectedIds.length} Labels
            </button>
          )}
          <button
            onClick={() => { setEditProduct(undefined); setShowDrawer(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, SKU, barcode..."
            className="bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 w-64"
          />
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          <button onClick={() => setCatFilter('all')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${catFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>All</button>
          {shopCats.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${catFilter === c.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>{c.name}</button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 w-8"></th>
              {['Product', 'SKU / Barcode', 'Category', 'Unit', 'Cost', 'Price', 'Stock', 'Alert', 'Status', ''].map(h => (
                <th key={h} className="text-left px-3 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const lowStock = p.stock_quantity <= p.min_stock_alert;
              return (
                <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-indigo-600 w-4 h-4" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Tag size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-slate-500 text-xs">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-slate-300 text-xs font-mono">{p.sku}</p>
                    <p className="text-slate-600 text-xs font-mono">{p.barcode}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-sm">{categories.find(c => c.id === p.category_id)?.name || '—'}</td>
                  <td className="px-3 py-3 text-slate-400 text-sm">{p.unit}</td>
                  <td className="px-3 py-3 text-slate-400 text-sm font-mono">{formatRs(p.cost_price)}</td>
                  <td className="px-3 py-3 text-indigo-300 text-sm font-mono font-semibold">{formatRs(p.selling_price)}</td>
                  <td className="px-3 py-3">
                    <span className={`text-sm font-mono font-semibold ${lowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {p.stock_quantity} {p.unit}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-500 text-sm">{p.min_stock_alert}</td>
                  <td className="px-3 py-3">
                    {lowStock ? (
                      <span className="flex items-center gap-1 text-amber-400 text-xs">
                        <AlertTriangle size={12} /> Low
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-xs">OK</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditProduct(p); setShowDrawer(true); }} className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors"><Edit size={13} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No products found</div>
        )}
      </div>

      {showDrawer && (
        <ProductDrawer
          product={editProduct}
          onClose={() => setShowDrawer(false)}
          onSave={data => editProduct ? updateProduct({ ...editProduct, ...data }) : addProduct(data)}
        />
      )}
      {showBarcodes && selectedProducts.length > 0 && (
        <BarcodePrintModal products={selectedProducts} onClose={() => setShowBarcodes(false)} />
      )}
    </div>
  );
}
