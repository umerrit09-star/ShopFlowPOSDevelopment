import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  User, Shop, Product, Sale, SaleItem, Expense, Customer, Purchase,
  StockAdjustment, Supplier, Category,
  MOCK_SHOPS, MOCK_PRODUCTS, MOCK_SALES, MOCK_EXPENSES, MOCK_CUSTOMERS,
  MOCK_PURCHASES, MOCK_ADJUSTMENTS, MOCK_SUPPLIERS, MOCK_CATEGORIES, MOCK_USERS
} from '../data/mockData';

interface AuthState {
  user: User | null;
  shop: Shop | null;
  isSuperAdmin: boolean;
}

interface AppState {
  auth: AuthState;
  shops: Shop[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  customers: Customer[];
  purchases: Purchase[];
  adjustments: StockAdjustment[];
  suppliers: Supplier[];
  categories: Category[];
  staffList: User[];
}

interface AppActions {
  login: (email: string, password: string) => 'super_admin' | 'shop_owner' | 'cashier' | null;
  adminLogin: (email: string, password: string) => boolean;
  logout: () => void;
  addShop: (shop: Omit<Shop, 'id' | 'created_at' | 'total_sales' | 'slug'>) => void;
  updateShopStatus: (shopId: string, status: Shop['status']) => void;
  deleteShop: (shopId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  processReturn: (saleId: string, items: { product_id: string; qty: number }[]) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'total_purchases'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  addAdjustment: (adj: Omit<StockAdjustment, 'id'>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  addStaff: (user: Omit<User, 'id' | 'shift_open'>) => void;
  updateStaff: (user: User) => void;
  updateShopSettings: (shopId: string, updates: Partial<Shop>) => void;
}

const AppContext = createContext<AppState & AppActions>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, shop: null, isSuperAdmin: false });
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(MOCK_ADJUSTMENTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [staffList, setStaffList] = useState<User[]>(MOCK_USERS);

  function login(email: string, _password: string) {
    const user = staffList.find(u => u.email === email);
    if (!user) return null;
    const shop = shops.find(s => s.id === user.shop_id) || null;
    setAuth({ user, shop, isSuperAdmin: false });
    return user.role;
  }

  function adminLogin(email: string, _password: string) {
    if (email === 'admin@shopflow.app') {
      setAuth({ user: null, shop: null, isSuperAdmin: true });
      return true;
    }
    return false;
  }

  function logout() {
    setAuth({ user: null, shop: null, isSuperAdmin: false });
  }

  function addShop(shopData: Omit<Shop, 'id' | 'created_at' | 'total_sales' | 'slug'>) {
    const newShop: Shop = {
      ...shopData,
      id: `shop-${Date.now()}`,
      slug: shopData.name.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString(),
      total_sales: 0,
    };
    setShops(prev => [...prev, newShop]);
  }

  function updateShopStatus(shopId: string, status: Shop['status']) {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status } : s));
  }

  function deleteShop(shopId: string) {
    setShops(prev => prev.filter(s => s.id !== shopId));
  }

  function addProduct(product: Omit<Product, 'id'>) {
    setProducts(prev => [...prev, { ...product, id: `prod-${Date.now()}` }]);
  }

  function updateProduct(product: Product) {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }

  function deleteProduct(productId: string) {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }

  function addSale(sale: Omit<Sale, 'id'>) {
    const newSale = { ...sale, id: `sale-${Date.now()}` };
    setSales(prev => [newSale, ...prev]);
    sale.items.forEach(item => {
      setProducts(prev => prev.map(p =>
        p.id === item.product_id ? { ...p, stock_quantity: p.stock_quantity - item.qty } : p
      ));
    });
    if (sale.customer_id) {
      setCustomers(prev => prev.map(c =>
        c.id === sale.customer_id ? { ...c, total_purchases: c.total_purchases + sale.total } : c
      ));
    }
  }

  function processReturn(saleId: string, items: { product_id: string; qty: number }[]) {
    setSales(prev => prev.map(s => {
      if (s.id !== saleId) return s;
      return {
        ...s,
        status: 'partial_return' as const,
        items: s.items.map(item => {
          const ret = items.find(r => r.product_id === item.product_id);
          return ret ? { ...item, returned_qty: item.returned_qty + ret.qty } : item;
        })
      };
    }));
    items.forEach(({ product_id, qty }) => {
      setProducts(prev => prev.map(p =>
        p.id === product_id ? { ...p, stock_quantity: p.stock_quantity + qty } : p
      ));
    });
  }

  function addExpense(expense: Omit<Expense, 'id'>) {
    setExpenses(prev => [{ ...expense, id: `exp-${Date.now()}` }, ...prev]);
  }

  function addCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'total_purchases'>) {
    setCustomers(prev => [...prev, {
      ...customer, id: `cust-${Date.now()}`,
      created_at: new Date().toISOString(), total_purchases: 0
    }]);
  }

  function addPurchase(purchase: Omit<Purchase, 'id'>) {
    const newPurchase = { ...purchase, id: `po-${Date.now()}` };
    setPurchases(prev => [newPurchase, ...prev]);
    purchase.items.forEach(item => {
      setProducts(prev => prev.map(p =>
        p.id === item.product_id ? { ...p, stock_quantity: p.stock_quantity + item.qty } : p
      ));
    });
  }

  function addAdjustment(adj: Omit<StockAdjustment, 'id'>) {
    setAdjustments(prev => [{ ...adj, id: `adj-${Date.now()}` }, ...prev]);
    setProducts(prev => prev.map(p =>
      p.id === adj.product_id ? { ...p, stock_quantity: p.stock_quantity + adj.adjustment_qty } : p
    ));
  }

  function addSupplier(supplier: Omit<Supplier, 'id'>) {
    setSuppliers(prev => [...prev, { ...supplier, id: `sup-${Date.now()}` }]);
  }

  function addStaff(user: Omit<User, 'id' | 'shift_open'>) {
    setStaffList(prev => [...prev, { ...user, id: `user-${Date.now()}`, shift_open: false }]);
  }

  function updateStaff(user: User) {
    setStaffList(prev => prev.map(u => u.id === user.id ? user : u));
  }

  function updateShopSettings(shopId: string, updates: Partial<Shop>) {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, ...updates } : s));
    if (auth.shop?.id === shopId) {
      setAuth(prev => ({ ...prev, shop: prev.shop ? { ...prev.shop, ...updates } : null }));
    }
  }

  return (
    <AppContext.Provider value={{
      auth, shops, products, sales, expenses, customers, purchases,
      adjustments, suppliers, categories, staffList,
      login, adminLogin, logout, addShop, updateShopStatus, deleteShop,
      addProduct, updateProduct, deleteProduct, addSale, processReturn,
      addExpense, addCustomer, addPurchase, addAdjustment, addSupplier,
      addStaff, updateStaff, updateShopSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
