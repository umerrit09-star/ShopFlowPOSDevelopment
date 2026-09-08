import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShoppingBag, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DEMO_ACCOUNTS = [
  { label: 'Shop Owner', email: 'tariq@alfatima.pk', hint: 'Goes to Dashboard' },
  { label: 'Cashier', email: 'bilal@alfatima.pk', hint: 'Goes to POS' },
];

export default function ShopLogin() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('tariq@alfatima.pk');
  const [password, setPassword] = useState('password');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));
    const role = login(email, password);
    if (role === 'shop_owner') {
      navigate('/app/dashboard');
    } else if (role === 'cashier') {
      navigate('/app/pos');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <ShoppingBag size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ShopFlow POS</h1>
          <p className="text-slate-400 text-sm">Sign in to your shop workspace</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Shop Workspace Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-900/20 border border-rose-800/50 rounded-lg text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Demo Accounts</p>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => setEmail(acc.email)}
                className="w-full text-left flex items-center justify-between px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-indigo-600 transition-colors"
              >
                <div>
                  <p className="text-white text-xs font-medium">{acc.label}</p>
                  <p className="text-slate-400 text-xs">{acc.email}</p>
                </div>
                <span className="text-indigo-400 text-xs">{acc.hint}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            Admin panel?{' '}
            <Link to="/auth/admin/login" className="text-indigo-400 hover:text-indigo-300">Admin Portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
