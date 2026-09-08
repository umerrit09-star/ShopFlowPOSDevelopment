import { useState } from 'react';
import { Plus, Search, Users, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRs, formatDate } from '../../lib/utils';

function AddCustomerDialog({ onClose, onSave }: { onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Add Customer</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="0300-0000000" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!form.name} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors">Add Customer</button>
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const { auth, customers, addCustomer, sales } = useApp();
  const shopCustomers = customers.filter(c => c.shop_id === auth.shop?.id);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const filtered = shopCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 text-sm mt-1">{shopCustomers.length} registered customers</p>
        </div>
        <button onClick={() => setShowDialog(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, phone, email..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Customer', 'Phone', 'Email', 'Address', 'Total Purchases', 'Since', 'Orders'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => {
              const orderCount = sales.filter(s => s.customer_id === customer.id).length;
              return (
                <tr key={customer.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-900/50 flex items-center justify-center">
                        <span className="text-indigo-300 text-sm font-bold">{customer.name[0]}</span>
                      </div>
                      <p className="text-white font-medium text-sm">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-sm font-mono">{customer.phone || '—'}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-sm">{customer.email || '—'}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-sm max-w-xs truncate">{customer.address || '—'}</td>
                  <td className="px-4 py-3.5 text-emerald-400 font-mono text-sm font-semibold">{formatRs(customer.total_purchases)}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-sm">{formatDate(customer.created_at)}</td>
                  <td className="px-4 py-3.5 text-indigo-400 text-sm font-mono">{orderCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p>No customers found</p>
          </div>
        )}
      </div>

      {showDialog && (
        <AddCustomerDialog
          onClose={() => setShowDialog(false)}
          onSave={data => addCustomer({ ...data, shop_id: auth.shop!.id })}
        />
      )}
    </div>
  );
}
