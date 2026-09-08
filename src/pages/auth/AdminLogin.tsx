import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShoppingBag, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminLogin() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@shopflow.app');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const ok = adminLogin(email, password);
    if (ok) {
      navigate('/admin/shops');
    } else {
      setError('Invalid admin credentials');
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
          <div className="inline-flex items-center gap-1.5 bg-rose-900/30 border border-rose-800/50 rounded-full px-3 py-1">
            <Shield size={12} className="text-rose-400" />
            <span className="text-rose-300 text-xs font-medium">Super Admin Portal</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Administrator Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-900/20 border border-rose-800/50 rounded-lg text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="admin@shopflow.app"
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
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-6">
            Shop login?{' '}
            <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300">Go to Shop Portal</Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Demo: admin@shopflow.app / any password
        </p>
      </div>
    </div>
  );
}
