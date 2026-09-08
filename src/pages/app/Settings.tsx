import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Users, Plus, Check, X } from 'lucide-react';
import { User } from '../../data/mockData';

function AddStaffDialog({ onClose, shopId, onSave }: { onClose: () => void; shopId: string; onSave: (d: any) => void }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'cashier' as 'cashier', shop_id: shopId, is_active: true });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Invite Staff Member</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Role</label>
            <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
              <option value="cashier">Cashier</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!form.name || !form.email} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { auth, staffList, updateShopSettings, addStaff, updateStaff } = useApp();
  const [activeTab, setActiveTab] = useState<'store' | 'staff'>('store');
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [saved, setSaved] = useState(false);

  const shopStaff = staffList.filter(u => u.shop_id === auth.shop?.id);

  const [storeForm, setStoreForm] = useState({
    name: auth.shop?.name || '',
    phone: auth.shop?.phone || '',
    address: auth.shop?.address || '',
    receipt_header: auth.shop?.receipt_header || '',
    receipt_footer: auth.shop?.receipt_footer || '',
  });

  function handleSaveStore() {
    updateShopSettings(auth.shop!.id, storeForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleStaffActive(user: User) {
    updateStaff({ ...user, is_active: !user.is_active });
  }

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage store profile and staff accounts</p>
      </div>

      <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1 w-fit">
        {(['store', 'staff'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {tab === 'store' ? <Store size={14} /> : <Users size={14} />}
            {tab === 'store' ? 'Store Profile' : 'Staff Accounts'}
          </button>
        ))}
      </div>

      {activeTab === 'store' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold">Store Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Shop Name</label>
              <input value={storeForm.name} onChange={e => setStoreForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Phone</label>
              <input value={storeForm.phone} onChange={e => setStoreForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Address</label>
              <input value={storeForm.address} onChange={e => setStoreForm(f => ({ ...f, address: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Receipt Header Notice</label>
              <input value={storeForm.receipt_header} onChange={e => setStoreForm(f => ({ ...f, receipt_header: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Welcome to our store!" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Receipt Footer Message</label>
              <input value={storeForm.receipt_footer} onChange={e => setStoreForm(f => ({ ...f, receipt_footer: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Thank you for shopping!" />
            </div>
          </div>
          <button
            onClick={handleSaveStore}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowStaffDialog(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              <Plus size={16} /> Invite Staff
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Staff Member', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shopStaff.map(user => (
                  <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-900/50 flex items-center justify-center">
                          <span className="text-indigo-300 text-sm font-bold">{user.name[0]}</span>
                        </div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-sm">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'shop_owner' ? 'bg-indigo-900/40 text-indigo-300' : 'bg-emerald-900/40 text-emerald-300'
                      }`}>
                        {user.role === 'shop_owner' ? 'Shop Owner' : 'Cashier'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {user.role !== 'shop_owner' && (
                        <button
                          onClick={() => toggleStaffActive(user)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            user.is_active
                              ? 'text-rose-400 hover:bg-rose-900/20'
                              : 'text-emerald-400 hover:bg-emerald-900/20'
                          }`}
                        >
                          {user.is_active ? <><X size={12} /> Deactivate</> : <><Check size={12} /> Activate</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showStaffDialog && (
        <AddStaffDialog
          onClose={() => setShowStaffDialog(false)}
          shopId={auth.shop!.id}
          onSave={data => addStaff(data)}
        />
      )}
    </div>
  );
}
