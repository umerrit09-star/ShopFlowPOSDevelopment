import { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRs, formatDate } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Gas', 'Internet', 'Salaries', 'Supplies', 'Maintenance', 'Transport', 'Other'];

function AddExpenseDialog({ onClose, onSave }: { onClose: () => void; onSave: (d: any) => void }) {
  const [form, setForm] = useState({ category: 'Rent', description: '', amount: 0, date: new Date().toISOString().split('T')[0] });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md animate-fadeIn">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Log Expense</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Amount (Rs.)</label>
              <input type="number" value={form.amount || ''} onChange={e => set('amount', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
            <input value={form.description} onChange={e => set('description', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Brief description..." />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} disabled={!form.amount} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors">Save Expense</button>
        </div>
      </div>
    </div>
  );
}

export default function Expenses() {
  const { auth, expenses, addExpense } = useApp();
  const shopExpenses = expenses.filter(e => e.shop_id === auth.shop?.id);
  const [showDialog, setShowDialog] = useState(false);

  const totalExpenses = shopExpenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    const total = shopExpenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    if (total > 0) acc[cat] = total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-slate-400 text-sm mt-1">Operating cost ledger</p>
        </div>
        <button onClick={() => setShowDialog(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} /> Log Expense
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 lg:col-span-1 bg-rose-900/20 border border-rose-800/30 rounded-xl p-5">
          <p className="text-rose-400 text-sm mb-1">Total Expenses</p>
          <p className="text-white font-bold text-2xl font-mono">{formatRs(totalExpenses)}</p>
        </div>
        {Object.entries(byCategory).slice(0, 3).map(([cat, amount]) => (
          <div key={cat} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm mb-1">{cat}</p>
            <p className="text-white font-bold text-xl font-mono">{formatRs(amount)}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Category', 'Description', 'Amount', 'Date', 'Recorded By'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shopExpenses.map(exp => (
              <tr key={exp.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium">{exp.category}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-300 text-sm">{exp.description}</td>
                <td className="px-4 py-3.5 text-rose-400 font-mono text-sm font-semibold">{formatRs(exp.amount)}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{formatDate(exp.date)}</td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{exp.created_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shopExpenses.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <DollarSign size={32} className="mx-auto mb-3 opacity-30" />
            <p>No expenses logged</p>
          </div>
        )}
      </div>

      {showDialog && (
        <AddExpenseDialog
          onClose={() => setShowDialog(false)}
          onSave={data => addExpense({ ...data, shop_id: auth.shop!.id, created_by: auth.user?.name || '' })}
        />
      )}
    </div>
  );
}
