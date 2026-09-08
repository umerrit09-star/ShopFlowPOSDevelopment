import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  ShoppingBag, LayoutDashboard, Package, ClipboardList, ShoppingCart,
  BarChart2, Receipt, DollarSign, Users, Settings, LogOut, Monitor, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';

export default function AppShell() {
  const { auth, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate('/auth/login');
  }

  const navItems = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', ownerOnly: true },
    { to: '/app/pos', icon: Monitor, label: 'POS Terminal', ownerOnly: false },
    { to: '/app/products', icon: Package, label: 'Products', ownerOnly: true },
    { to: '/app/stock-adjustments', icon: ClipboardList, label: 'Stock Adjustments', ownerOnly: true },
    { to: '/app/purchases', icon: ShoppingCart, label: 'Purchases', ownerOnly: true },
    { to: '/app/sales', icon: Receipt, label: 'Sales', ownerOnly: true },
    { to: '/app/expenses', icon: DollarSign, label: 'Expenses', ownerOnly: true },
    { to: '/app/customers', icon: Users, label: 'Customers', ownerOnly: true },
    { to: '/app/reports', icon: BarChart2, label: 'Reports', ownerOnly: true },
    { to: '/app/settings', icon: Settings, label: 'Settings', ownerOnly: true },
  ];

  const visibleNav = auth.user?.role === 'cashier'
    ? navItems.filter(n => !n.ownerOnly)
    : navItems;

  return (
    <div className="flex h-full bg-slate-950">
      <aside
        className={`flex-shrink-0 bg-[#0F172A] flex flex-col border-r border-slate-800 transition-all duration-200 ${sidebarCollapsed ? 'w-16' : 'w-56'}`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={15} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{auth.shop?.name || 'ShopFlow'}</p>
              <p className="text-slate-400 text-xs truncate">{auth.user?.role === 'shop_owner' ? 'Owner Portal' : 'Cashier View'}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          {!sidebarCollapsed && (
            <div className="px-2.5 py-2 mb-1">
              <p className="text-white text-sm font-medium truncate">{auth.user?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  auth.user?.role === 'shop_owner' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-emerald-900/50 text-emerald-300'
                }`}>
                  {auth.user?.role === 'shop_owner' ? 'Owner' : 'Cashier'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 text-xs">Shift Open</span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-900/20 transition-colors"
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0F172A] border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarCollapsed(v => !v)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ChevronDown size={16} className={`transition-transform ${sidebarCollapsed ? '-rotate-90' : 'rotate-90'}`} />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium">{auth.shop?.name}</p>
              <p className="text-slate-400 text-xs">{auth.user?.name}</p>
            </div>
            <NavLink
              to="/app/pos"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Monitor size={15} />
              Open POS Terminal
            </NavLink>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
