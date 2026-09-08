import { createBrowserRouter, Navigate } from 'react-router';
import AdminShell from './components/layout/AdminShell';
import AppShell from './components/layout/AppShell';
import AdminLogin from './pages/auth/AdminLogin';
import ShopLogin from './pages/auth/ShopLogin';
import AdminShops from './pages/admin/Shops';
import Dashboard from './pages/app/Dashboard';
import POS from './pages/app/POS';
import Products from './pages/app/Products';
import StockAdjustments from './pages/app/StockAdjustments';
import Purchases from './pages/app/Purchases';
import Sales from './pages/app/Sales';
import Expenses from './pages/app/Expenses';
import Customers from './pages/app/Customers';
import Reports from './pages/app/Reports';
import Settings from './pages/app/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/auth/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/auth/login',
    element: <ShopLogin />,
  },
  {
    path: '/admin',
    element: <AdminShell />,
    children: [
      { index: true, element: <Navigate to="/admin/shops" replace /> },
      { path: 'shops', element: <AdminShops /> },
      { path: 'overview', element: <AdminShops /> },
      { path: 'analytics', element: <AdminShops /> },
      { path: 'activity', element: <AdminShops /> },
    ],
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'pos', element: <POS /> },
      { path: 'products', element: <Products /> },
      { path: 'stock-adjustments', element: <StockAdjustments /> },
      { path: 'purchases', element: <Purchases /> },
      { path: 'sales', element: <Sales /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'customers', element: <Customers /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
