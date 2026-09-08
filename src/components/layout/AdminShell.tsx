import { NavLink, Outlet, useNavigate } from 'react-router';
import { LayoutDashboard, Store, LogOut, ShoppingBag, TrendingUp, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRs } from '../../lib/utils';

export default function AdminShell() {
  const { shops, logout } = useApp();
  const navigate = useNavigate();

  const totalShops = shops.length;
  const activeShops = shops.filter(s => s.status === 'active').length;
  const suspendedShops = shops.filter(s => s.status === 'suspended').length;
  const totalVolume = shops.reduce((sum, s) => sum + s.total_sales, 0);

  function handleLogout() {
    logout();
    navigate('/auth/admin/login');
  }

  return (
    <div className="flex h-full bg-slate-950">
      <aside className="w-64 flex-shrink-0 bg-[#0F172A] flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">ShopFlow POS</p>
              <p className="text-indigo-400 text-xs">Super Admin</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Total Shops</p>
              <p className="text-white font-bold text-xl">{totalShops}</p>
            </div>
            <div className="bg-emerald-900/30 rounded-lg p-3">
              <p className="text-emerald-400 text-xs mb-1">Active</p>
              <p className="text-emerald-400 font-bold text-xl">{activeShops}</p>
            </div>
            <div className="bg-rose-900/30 rounded-lg p-3">
              <p className="text-rose-400 text-xs mb-1">Suspended</p>
              <p className="text-rose-400 font-bold text-xl">{suspendedShops}</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">On Hold</p>
              <p className="text-amber-400 font-bold text-xl">{shops.filter(s => s.status === 'on-hold').length}</p>
            </div>
          </div>
          <div className="bg-indigo-900/30 rounded-lg p-3">
            <p className="text-indigo-300 text-xs mb-1">System Sales</p>
            <p className="text-indigo-200 font-bold text-sm font-mono">{formatRs(totalVolume)}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Navigation</p>
          <NavLink
            to="/admin/shops"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Store size={16} />
            Shop Directory
          </NavLink>
          <NavLink
            to="/admin/overview"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <LayoutDashboard size={16} />
            Overview
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <TrendingUp size={16} />
            Analytics
          </NavLink>
          <NavLink
            to="/admin/activity"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Activity size={16} />
            System Activity
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-900/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
}
