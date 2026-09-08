import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, Minus, X, CreditCard, Banknote, QrCode, Printer, ShoppingCart, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Sale } from '../../data/mockData';
import { formatRs, generateInvoiceId } from '../../lib/utils';

interface CartItem {
  product: Product;
  qty: number;
  discount: number;
}

const CASH_PRESETS = [100, 500, 1000, 2000, 5000];

function ReceiptModal({ sale, shop, cashierName, onClose }: { sale: Omit<Sale, 'id'>; shop: any; cashierName: string; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  const feedbackUrl = `https://shopflow.app/feedback/${shop?.slug}?inv=${sale.invoice_id}`;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl w-80 max-h-screen overflow-y-auto animate-fadeIn">
        <div ref={printRef} className="p-6 font-mono text-black text-xs print-only" id="receipt">
          <div className="text-center mb-4">
            <p className="font-bold text-base">{shop?.name || 'ShopFlow POS'}</p>
            <p className="text-gray-600 text-xs">{shop?.address}</p>
            <p className="text-gray-600 text-xs">{shop?.phone}</p>
            {shop?.receipt_header && <p className="mt-1 text-xs italic">{shop.receipt_header}</p>}
            <div className="border-t border-dashed border-gray-400 my-3" />
            <p className="font-bold">{sale.invoice_id}</p>
            <p className="text-gray-500">{new Date().toLocaleString('en-PK')}</p>
            <p className="text-gray-500">Cashier: {cashierName}</p>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2" />
          {sale.items.map((item, i) => (
            <div key={i} className="mb-1">
              <p className="font-medium">{item.product_name}</p>
              <div className="flex justify-between text-gray-600">
                <span>{item.qty} x Rs. {item.unit_price}</span>
                <span>Rs. {(item.qty * item.unit_price - item.discount).toLocaleString()}</span>
              </div>
            </div>
          ))}
          <div className="border-t border-dashed border-gray-400 my-2" />
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. {sale.subtotal.toLocaleString()}</span></div>
          {sale.tax > 0 && <div className="flex justify-between"><span>Tax</span><span>Rs. {sale.tax.toLocaleString()}</span></div>}
          <div className="flex justify-between font-bold text-sm border-t border-dashed border-gray-400 mt-1 pt-1">
            <span>TOTAL</span><span>Rs. {sale.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-1">
            <span>Payment</span><span className="capitalize">{sale.payment_method}</span>
          </div>
          {sale.cash_tendered && <div className="flex justify-between text-gray-600"><span>Cash</span><span>Rs. {sale.cash_tendered.toLocaleString()}</span></div>}
          {sale.change_due != null && sale.change_due > 0 && <div className="flex justify-between text-gray-600"><span>Change</span><span>Rs. {sale.change_due.toLocaleString()}</span></div>}
          {shop?.receipt_footer && <p className="text-center mt-3 text-xs italic text-gray-500">{shop.receipt_footer}</p>}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">Feedback QR</p>
            <div className="inline-block border border-gray-300 p-2 rounded mt-1">
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-400">QR</div>
            </div>
            <p className="text-xs text-gray-400 mt-1 break-all">{feedbackUrl}</p>
          </div>
        </div>

        <div className="p-4 no-print">
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <Check size={22} className="text-emerald-600" />
            </div>
            <p className="font-bold text-slate-800">{sale.invoice_id}</p>
            <p className="text-slate-500 text-sm">Sale completed</p>
          </div>
          <div className="text-sm space-y-1 mb-4">
            {sale.items.map((item, i) => (
              <div key={i} className="flex justify-between text-slate-700">
                <span>{item.product_name} × {item.qty}</span>
                <span>Rs. {(item.qty * item.unit_price - item.discount).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t pt-1 mt-1 text-slate-800">
              <span>Total</span><span>Rs. {sale.total.toLocaleString()}</span>
            </div>
            {sale.change_due != null && sale.change_due > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Change Due</span><span>Rs. {sale.change_due.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Printer size={14} /> Print Receipt
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors">
              New Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ total, onClose, onComplete }: { total: number; onClose: () => void; onComplete: (method: string, tendered?: number) => void }) {
  const [method, setMethod] = useState<'cash' | 'card' | 'digital_qr'>('cash');
  const [tendered, setTendered] = useState(total);

  const change = method === 'cash' ? Math.max(0, tendered - total) : 0;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white text-center">Checkout</h2>
          <p className="text-center text-slate-400 text-sm mt-1">Total: <span className="text-white font-bold text-lg font-mono">{formatRs(total)}</span></p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(['cash', 'card', 'digital_qr'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                  method === m ? 'border-indigo-500 bg-indigo-900/30' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                {m === 'cash' ? <Banknote size={22} className={method === m ? 'text-indigo-400' : 'text-slate-500'} /> :
                 m === 'card' ? <CreditCard size={22} className={method === m ? 'text-indigo-400' : 'text-slate-500'} /> :
                 <QrCode size={22} className={method === m ? 'text-indigo-400' : 'text-slate-500'} />}
                <span className={`text-xs font-medium ${method === m ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {m === 'cash' ? 'Cash' : m === 'card' ? 'Card' : 'Digital QR'}
                </span>
              </button>
            ))}
          </div>

          {method === 'cash' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Cash Tendered (Rs.)</label>
                <input
                  type="number"
                  value={tendered}
                  onChange={e => setTendered(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-lg font-bold font-mono text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {CASH_PRESETS.map(p => (
                  <button key={p} onClick={() => setTendered(p)} className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors">
                    {p >= 1000 ? `${p/1000}k` : p}
                  </button>
                ))}
              </div>
              {tendered >= total && (
                <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-xl p-4 text-center">
                  <p className="text-emerald-400 text-sm">Change Due</p>
                  <p className="text-emerald-300 text-3xl font-bold font-mono mt-1">{formatRs(change)}</p>
                </div>
              )}
            </div>
          )}

          {method === 'digital_qr' && (
            <div className="text-center py-4">
              <div className="w-32 h-32 bg-slate-800 border border-slate-700 rounded-xl mx-auto flex items-center justify-center">
                <QrCode size={64} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm mt-3">Scan to pay {formatRs(total)}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-700 text-slate-400 rounded-xl text-sm font-medium hover:text-white transition-colors">Cancel</button>
          <button
            onClick={() => onComplete(method, method === 'cash' ? tendered : undefined)}
            disabled={method === 'cash' && tendered < total}
            className="flex-2 flex-grow-[2] py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-sm font-bold transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function POS() {
  const { auth, products, categories, addSale } = useApp();
  const shopProducts = products.filter(p => p.shop_id === auth.shop?.id && p.status === 'active' && p.stock_quantity > 0);
  const shopCats = categories.filter(c => c.shop_id === auth.shop?.id);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [completedSale, setCompletedSale] = useState<Omit<Sale, 'id'> | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const filtered = shopProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode === search || p.sku === search;
    const matchCat = catFilter === 'all' || p.category_id === catFilter;
    return matchSearch && matchCat;
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock_quantity) return prev;
        return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { product, qty: 1, discount: 0 }];
    });
  }, []);

  function handleBarcodeKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.trim();
      const product = shopProducts.find(p => p.barcode === val || p.sku === val);
      if (product) {
        addToCart(product);
        setSearch('');
        (e.target as HTMLInputElement).value = '';
      }
    }
  }

  function updateQty(productId: string, delta: number) {
    setCart(prev => prev.map(c => {
      if (c.product.id !== productId) return c;
      const newQty = c.qty + delta;
      if (newQty <= 0) return c;
      if (newQty > c.product.stock_quantity) return c;
      return { ...c, qty: newQty };
    }));
  }

  function removeItem(productId: string) {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  }

  function setDiscount(productId: string, discount: number) {
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, discount } : c));
  }

  const subtotal = cart.reduce((s, c) => s + c.qty * c.product.selling_price - c.discount, 0);
  const tax = 0;
  const total = subtotal + tax;

  function handlePaymentComplete(method: string, tendered?: number) {
    const invoiceId = generateInvoiceId();
    const saleData: Omit<Sale, 'id'> = {
      invoice_id: invoiceId,
      shop_id: auth.shop!.id,
      cashier_id: auth.user!.id,
      cashier_name: auth.user!.name,
      items: cart.map(c => ({
        product_id: c.product.id,
        product_name: c.product.name,
        qty: c.qty,
        unit_price: c.product.selling_price,
        discount: c.discount,
        returned_qty: 0,
      })),
      subtotal, tax, total,
      payment_method: method as any,
      cash_tendered: tendered,
      change_due: tendered != null ? tendered - total : undefined,
      status: 'completed',
      created_at: new Date().toISOString(),
    };
    addSale(saleData);
    setCompletedSale(saleData);
    setCart([]);
    setShowPayment(false);
  }

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                ref={barcodeRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleBarcodeKey}
                placeholder="Scan barcode or search product..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            <button onClick={() => setCatFilter('all')} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>All</button>
            {shopCats.map(c => (
              <button key={c.id} onClick={() => setCatFilter(c.id)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{c.name}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 rounded-xl p-4 text-left transition-all active:scale-95 group"
              >
                <div className="w-full aspect-square rounded-lg bg-slate-800 mb-3 flex items-center justify-center">
                  <ShoppingCart size={24} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-white text-sm font-medium leading-tight line-clamp-2 mb-2">{product.name}</p>
                <p className="text-indigo-300 font-bold text-base font-mono">{formatRs(product.selling_price)}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 text-xs">{product.unit}</span>
                  <span className={`text-xs font-medium ${product.stock_quantity <= product.min_stock_alert ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {product.stock_quantity} left
                  </span>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-80 flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Cart</h2>
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {cart.map(({ product, qty, discount }) => (
                <div key={product.id} className="bg-slate-800/60 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white text-sm font-medium flex-1 pr-2 leading-tight">{product.name}</p>
                    <button onClick={() => removeItem(product.id)} className="text-slate-600 hover:text-rose-400 transition-colors p-0.5">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-white font-bold text-sm w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(product.id, 1)} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-indigo-300 font-bold font-mono text-sm">{formatRs(qty * product.selling_price - discount)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-slate-500 text-xs">Discount Rs.</span>
                    <input
                      type="number" min={0}
                      value={discount || ''}
                      onChange={e => setDiscount(product.id, Number(e.target.value))}
                      placeholder="0"
                      className="flex-1 bg-slate-700 border border-slate-600 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-sm"><span>Subtotal</span><span className="font-mono">{formatRs(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500 text-sm"><span>Tax (0%)</span><span className="font-mono">{formatRs(tax)}</span></div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-slate-700 pt-2 mt-2">
              <span>Total</span><span className="font-mono">{formatRs(total)}</span>
            </div>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={() => setShowPayment(true)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-colors"
          >
            Charge / Checkout
          </button>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="w-full py-2 text-slate-500 hover:text-rose-400 text-sm transition-colors">
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          shop={auth.shop}
          cashierName={auth.user?.name || ''}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </div>
  );
}
