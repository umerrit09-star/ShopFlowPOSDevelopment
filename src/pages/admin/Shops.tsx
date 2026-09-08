import { useState } from 'react';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, PauseCircle, Trash2, Edit, Store, TrendingUp, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Shop } from '../../data/mockData';
import { formatRs, formatDate } from '../../lib/utils';

type StatusFilter = 'all' | 'active' | 'suspended' | 'on-hold';

const STATUS_CONFIG = {
  active: { label: 'Active', class: 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' },
  suspended: { label: 'Suspended', class: 'bg-rose-900/40 text-rose-400 border-rose-800/50' },
  'on-hold': { label: 'On Hold', class: 'bg-amber-900/40 text-amber-400 border-amber-800/50' },
};

function CreateShopDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (data: any) => void }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '', city: '', owner_name: '', owner_email: '', status: 'active' as Shop['status'] });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create New Shop</h2>
          <p className="text-slate-400 text-sm mt-1">Register a new tenant shop on the platform</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Shop Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Al-Fatima General Store" />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="0300-1234567" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Lahore" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Owner Name</label>
              <input value={form.owner_name} onChange={e => set('owner_name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Owner Email</label>
              <input type="email" value={form.owner_email} onChange={e => set('owner_email', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">Cancel</button>
          <button
            onClick={() => { onCreate(form); onClose(); }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Create Shop
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShops() {
  const { shops, addShop, updateShopStatus, deleteShop } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const totalVolume = shops.reduce((s, shop) => s + shop.total_sales, 0);

  const filtered = shops.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner_email.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shop Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all registered tenant shops</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Create New Shop
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Shops', value: shops.length, color: 'text-white', bg: 'bg-slate-800/50', icon: Store },
          { label: 'Active Stores', value: shops.filter(s => s.status === 'active').length, color: 'text-emerald-400', bg: 'bg-emerald-900/20', icon: CheckCircle },
          { label: 'Suspended', value: shops.filter(s => s.status === 'suspended').length, color: 'text-rose-400', bg: 'bg-rose-900/20', icon: XCircle },
          { label: 'On Hold', value: shops.filter(s => s.status === 'on-hold').length, color: 'text-amber-400', bg: 'bg-amber-900/20', icon: PauseCircle },
          { label: 'Platform Volume', value: formatRs(totalVolume), color: 'text-indigo-300', bg: 'bg-indigo-900/20', icon: TrendingUp },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`${bg} border border-slate-800/50 rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-xs font-medium">{label}</p>
              <Icon size={14} className={color} />
            </div>
            <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shops, owners, cities..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
          {(['all', 'active', 'suspended', 'on-hold'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Shop Name', 'Owner', 'Phone', 'City', 'Status', 'Created', 'Sales', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(shop => (
              <tr key={shop.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900/50 flex items-center justify-center">
                      <Store size={14} className="text-indigo-400" />
                    </div>
                    <p className="text-white text-sm font-medium">{shop.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-300 text-sm">{shop.owner_email}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm font-mono">{shop.phone}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{shop.city}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[shop.status].class}`}>
                    {STATUS_CONFIG[shop.status].label}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{formatDate(shop.created_at)}</td>
                <td className="px-4 py-3.5 text-slate-300 text-sm font-mono">{formatRs(shop.total_sales)}</td>
                <td className="px-4 py-3.5">
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === shop.id ? null : shop.id)}
                      className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <MoreVertical size={15} />
                    </button>
                    {menuOpen === shop.id && (
                      <div className="absolute right-0 top-8 z-10 bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-48 py-1 animate-fadeIn">
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors">
                          <Edit size={13} /> Edit Details
                        </button>
                        {shop.status !== 'active' && (
                          <button
                            onClick={() => { updateShopStatus(shop.id, 'active'); setMenuOpen(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-emerald-400 hover:bg-slate-700 text-sm transition-colors"
                          >
                            <CheckCircle size={13} /> Activate
                          </button>
                        )}
                        {shop.status !== 'suspended' && (
                          <button
                            onClick={() => { updateShopStatus(shop.id, 'suspended'); setMenuOpen(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-rose-400 hover:bg-slate-700 text-sm transition-colors"
                          >
                            <XCircle size={13} /> Suspend
                          </button>
                        )}
                        {shop.status !== 'on-hold' && (
                          <button
                            onClick={() => { updateShopStatus(shop.id, 'on-hold'); setMenuOpen(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-amber-400 hover:bg-slate-700 text-sm transition-colors"
                          >
                            <PauseCircle size={13} /> Put on Hold
                          </button>
                        )}
                        <div className="my-1 border-t border-slate-700" />
                        <button
                          onClick={() => { deleteShop(shop.id); setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-rose-400 hover:bg-rose-900/20 text-sm transition-colors"
                        >
                          <Trash2 size={13} /> Delete Shop
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Store size={32} className="mx-auto mb-3 opacity-30" />
            <p>No shops found</p>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateShopDialog
          onClose={() => setShowCreate(false)}
          onCreate={(data) => addShop({ ...data, logo_url: '' })}
        />
      )}
    </div>
  );
}
