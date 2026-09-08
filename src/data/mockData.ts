export type ShopStatus = 'active' | 'suspended' | 'on-hold';
export type UserRole = 'super_admin' | 'shop_owner' | 'cashier';
export type PaymentMethod = 'cash' | 'card' | 'digital_qr';
export type AdjustmentReason = 'damaged' | 'expired' | 'inventory_count' | 'other';
export type SaleStatus = 'completed' | 'returned' | 'partial_return';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  city: string;
  owner_name: string;
  owner_email: string;
  logo_url?: string;
  receipt_header?: string;
  receipt_footer?: string;
  status: ShopStatus;
  created_at: string;
  total_sales: number;
}

export interface User {
  id: string;
  shop_id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  shift_open: boolean;
}

export interface Category {
  id: string;
  shop_id: string;
  name: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  sku: string;
  barcode: string;
  category_id: string;
  brand: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  status: 'active' | 'inactive';
  thumbnail?: string;
}

export interface Supplier {
  id: string;
  shop_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface PurchaseItem {
  product_id: string;
  product_name: string;
  qty: number;
  unit_cost: number;
}

export interface Purchase {
  id: string;
  shop_id: string;
  supplier_id: string;
  supplier_name: string;
  items: PurchaseItem[];
  total_cost: number;
  created_at: string;
  created_by: string;
}

export interface SaleItem {
  product_id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  discount: number;
  returned_qty: number;
}

export interface Sale {
  id: string;
  invoice_id: string;
  shop_id: string;
  cashier_id: string;
  cashier_name: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
  cash_tendered?: number;
  change_due?: number;
  customer_id?: string;
  customer_name?: string;
  status: SaleStatus;
  created_at: string;
}

export interface StockAdjustment {
  id: string;
  shop_id: string;
  product_id: string;
  product_name: string;
  adjustment_qty: number;
  reason: AdjustmentReason;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface Expense {
  id: string;
  shop_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  created_by: string;
}

export interface Customer {
  id: string;
  shop_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  total_purchases: number;
  created_at: string;
}

export const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop-001', name: 'Al-Fatima General Store', slug: 'al-fatima',
    address: 'Shop 12, Liberty Market', phone: '0300-1234567', city: 'Lahore',
    owner_name: 'Muhammad Tariq', owner_email: 'tariq@alfatima.pk',
    receipt_header: 'Welcome to Al-Fatima', receipt_footer: 'Thank you for shopping!',
    status: 'active', created_at: '2024-01-15', total_sales: 1850000
  },
  {
    id: 'shop-002', name: 'Karachi Mart', slug: 'karachi-mart',
    address: 'Plot 45, Gulshan-e-Iqbal', phone: '0321-9876543', city: 'Karachi',
    owner_name: 'Fatima Malik', owner_email: 'fatima@karachimart.pk',
    status: 'active', created_at: '2024-02-20', total_sales: 3200000
  },
  {
    id: 'shop-003', name: 'Peshawar Bazaar', slug: 'peshawar-bazaar',
    address: 'Saddar Road, Peshawar', phone: '0345-5551234', city: 'Peshawar',
    owner_name: 'Khan Sahib', owner_email: 'khan@peshawarbazaar.pk',
    status: 'suspended', created_at: '2024-03-10', total_sales: 450000
  },
  {
    id: 'shop-004', name: 'Islamabad Superstore', slug: 'islamabad-super',
    address: 'F-10 Markaz, Islamabad', phone: '0333-7778888', city: 'Islamabad',
    owner_name: 'Ayesha Noor', owner_email: 'ayesha@isb-super.pk',
    status: 'on-hold', created_at: '2024-04-05', total_sales: 980000
  },
  {
    id: 'shop-005', name: 'Multan Kirana', slug: 'multan-kirana',
    address: 'Hussain Agahi Bazar, Multan', phone: '0312-4445566', city: 'Multan',
    owner_name: 'Zubair Ahmed', owner_email: 'zubair@multankirana.pk',
    status: 'active', created_at: '2024-05-01', total_sales: 720000
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', shop_id: 'shop-001', name: 'Beverages' },
  { id: 'cat-2', shop_id: 'shop-001', name: 'Snacks' },
  { id: 'cat-3', shop_id: 'shop-001', name: 'Dairy' },
  { id: 'cat-4', shop_id: 'shop-001', name: 'Household' },
  { id: 'cat-5', shop_id: 'shop-001', name: 'Personal Care' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001', shop_id: 'shop-001', name: 'Nestle Pure Life 1.5L', sku: 'BEV-NP15',
    barcode: '8901234567890', category_id: 'cat-1', brand: 'Nestle', unit: 'Pcs',
    cost_price: 55, selling_price: 70, stock_quantity: 120, min_stock_alert: 20, status: 'active'
  },
  {
    id: 'prod-002', shop_id: 'shop-001', name: 'Coca-Cola 500ml', sku: 'BEV-CC5',
    barcode: '8901234567891', category_id: 'cat-1', brand: 'Coca-Cola', unit: 'Pcs',
    cost_price: 70, selling_price: 85, stock_quantity: 8, min_stock_alert: 24, status: 'active'
  },
  {
    id: 'prod-003', shop_id: 'shop-001', name: 'Lays Classic 100g', sku: 'SNK-LC1',
    barcode: '8901234567892', category_id: 'cat-2', brand: 'Lays', unit: 'Pcs',
    cost_price: 80, selling_price: 100, stock_quantity: 65, min_stock_alert: 30, status: 'active'
  },
  {
    id: 'prod-004', shop_id: 'shop-001', name: 'Olpers Full Cream Milk 1L', sku: 'DAI-OFC1',
    barcode: '8901234567893', category_id: 'cat-3', brand: 'Olpers', unit: 'Pcs',
    cost_price: 140, selling_price: 165, stock_quantity: 45, min_stock_alert: 15, status: 'active'
  },
  {
    id: 'prod-005', shop_id: 'shop-001', name: 'Ariel Detergent 500g', sku: 'HH-AD5',
    barcode: '8901234567894', category_id: 'cat-4', brand: 'Ariel', unit: 'Pack',
    cost_price: 350, selling_price: 420, stock_quantity: 3, min_stock_alert: 10, status: 'active'
  },
  {
    id: 'prod-006', shop_id: 'shop-001', name: 'Colgate Toothpaste 150ml', sku: 'PC-CT15',
    barcode: '8901234567895', category_id: 'cat-5', brand: 'Colgate', unit: 'Pcs',
    cost_price: 120, selling_price: 150, stock_quantity: 33, min_stock_alert: 20, status: 'active'
  },
  {
    id: 'prod-007', shop_id: 'shop-001', name: 'Lipton Yellow Label Tea 190g', sku: 'BEV-LYL2',
    barcode: '8901234567896', category_id: 'cat-1', brand: 'Lipton', unit: 'Pack',
    cost_price: 420, selling_price: 490, stock_quantity: 28, min_stock_alert: 10, status: 'active'
  },
  {
    id: 'prod-008', shop_id: 'shop-001', name: 'Sunridge Basmati Rice 5kg', sku: 'GRC-SBR5',
    barcode: '8901234567897', category_id: 'cat-4', brand: 'Sunridge', unit: 'Kg',
    cost_price: 1100, selling_price: 1350, stock_quantity: 18, min_stock_alert: 5, status: 'active'
  },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup-001', shop_id: 'shop-001', name: 'Al-Khair Distributors', phone: '0300-1112222', email: 'alkhair@dist.pk', address: 'Shahalam Market', city: 'Lahore' },
  { id: 'sup-002', shop_id: 'shop-001', name: 'National Traders', phone: '0321-3334444', email: 'national@traders.pk', address: 'Brandreth Road', city: 'Lahore' },
  { id: 'sup-003', shop_id: 'shop-001', name: 'Pak Wholesale Hub', phone: '0333-5556666', email: 'pakwholesale@hub.pk', address: 'Hall Road', city: 'Lahore' },
];

const today = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();

export const MOCK_SALES: Sale[] = [
  {
    id: 'sale-001', invoice_id: 'INV-20240001', shop_id: 'shop-001',
    cashier_id: 'user-002', cashier_name: 'Bilal Ahmed',
    items: [
      { product_id: 'prod-001', product_name: 'Nestle Pure Life 1.5L', qty: 2, unit_price: 70, discount: 0, returned_qty: 0 },
      { product_id: 'prod-003', product_name: 'Lays Classic 100g', qty: 1, unit_price: 100, discount: 0, returned_qty: 0 },
    ],
    subtotal: 240, tax: 0, total: 240, payment_method: 'cash',
    cash_tendered: 300, change_due: 60, status: 'completed', created_at: today
  },
  {
    id: 'sale-002', invoice_id: 'INV-20240002', shop_id: 'shop-001',
    cashier_id: 'user-002', cashier_name: 'Bilal Ahmed',
    items: [
      { product_id: 'prod-004', product_name: 'Olpers Full Cream Milk 1L', qty: 3, unit_price: 165, discount: 0, returned_qty: 0 },
      { product_id: 'prod-006', product_name: 'Colgate Toothpaste 150ml', qty: 1, unit_price: 150, discount: 0, returned_qty: 0 },
    ],
    subtotal: 645, tax: 0, total: 645, payment_method: 'card',
    customer_id: 'cust-001', customer_name: 'Ali Hassan', status: 'completed', created_at: today
  },
  {
    id: 'sale-003', invoice_id: 'INV-20240003', shop_id: 'shop-001',
    cashier_id: 'user-002', cashier_name: 'Bilal Ahmed',
    items: [
      { product_id: 'prod-007', product_name: 'Lipton Yellow Label Tea 190g', qty: 2, unit_price: 490, discount: 50, returned_qty: 0 },
      { product_id: 'prod-008', product_name: 'Sunridge Basmati Rice 5kg', qty: 1, unit_price: 1350, discount: 0, returned_qty: 0 },
    ],
    subtotal: 2280, tax: 0, total: 2280, payment_method: 'digital_qr',
    customer_id: 'cust-002', customer_name: 'Sara Qureshi', status: 'completed', created_at: yesterday
  },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'exp-001', shop_id: 'shop-001', category: 'Rent', description: 'Monthly shop rent - September', amount: 45000, date: today, created_by: 'Muhammad Tariq' },
  { id: 'exp-002', shop_id: 'shop-001', category: 'Electricity', description: 'LESCO bill - August', amount: 8500, date: yesterday, created_by: 'Muhammad Tariq' },
  { id: 'exp-003', shop_id: 'shop-001', category: 'Salaries', description: 'Cashier salary - Bilal Ahmed', amount: 25000, date: yesterday, created_by: 'Muhammad Tariq' },
  { id: 'exp-004', shop_id: 'shop-001', category: 'Supplies', description: 'Packaging bags and receipt paper', amount: 2200, date: today, created_by: 'Muhammad Tariq' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust-001', shop_id: 'shop-001', name: 'Ali Hassan', phone: '0300-7778888', email: 'ali@gmail.com', address: 'Gulberg III, Lahore', total_purchases: 15400, created_at: '2024-03-15' },
  { id: 'cust-002', shop_id: 'shop-001', name: 'Sara Qureshi', phone: '0321-4445555', email: 'sara@yahoo.com', address: 'Model Town, Lahore', total_purchases: 8900, created_at: '2024-04-22' },
  { id: 'cust-003', shop_id: 'shop-001', name: 'Imran Khan', phone: '0333-1112222', email: '', address: 'DHA Phase 5, Lahore', total_purchases: 32000, created_at: '2024-01-10' },
  { id: 'cust-004', shop_id: 'shop-001', name: 'Nadia Malik', phone: '0345-6667777', email: 'nadia@hotmail.com', address: 'Johar Town, Lahore', total_purchases: 5600, created_at: '2024-06-01' },
];

export const MOCK_ADJUSTMENTS: StockAdjustment[] = [
  { id: 'adj-001', shop_id: 'shop-001', product_id: 'prod-002', product_name: 'Coca-Cola 500ml', adjustment_qty: -6, reason: 'damaged', notes: 'Bottles broken during delivery', created_by: 'Muhammad Tariq', created_at: yesterday },
  { id: 'adj-002', shop_id: 'shop-001', product_id: 'prod-005', product_name: 'Ariel Detergent 500g', adjustment_qty: -4, reason: 'expired', notes: 'Past expiry date removed', created_by: 'Bilal Ahmed', created_at: today },
  { id: 'adj-003', shop_id: 'shop-001', product_id: 'prod-001', product_name: 'Nestle Pure Life 1.5L', adjustment_qty: 50, reason: 'inventory_count', notes: 'Recount after stocktake', created_by: 'Muhammad Tariq', created_at: today },
];

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: 'po-001', shop_id: 'shop-001', supplier_id: 'sup-001', supplier_name: 'Al-Khair Distributors',
    items: [
      { product_id: 'prod-001', product_name: 'Nestle Pure Life 1.5L', qty: 100, unit_cost: 55 },
      { product_id: 'prod-002', product_name: 'Coca-Cola 500ml', qty: 48, unit_cost: 70 },
    ],
    total_cost: 8860, created_at: yesterday, created_by: 'Muhammad Tariq'
  },
  {
    id: 'po-002', shop_id: 'shop-001', supplier_id: 'sup-002', supplier_name: 'National Traders',
    items: [
      { product_id: 'prod-008', product_name: 'Sunridge Basmati Rice 5kg', qty: 20, unit_cost: 1100 },
    ],
    total_cost: 22000, created_at: today, created_by: 'Muhammad Tariq'
  },
];

export const MOCK_USERS: User[] = [
  { id: 'user-001', shop_id: 'shop-001', name: 'Muhammad Tariq', email: 'tariq@alfatima.pk', role: 'shop_owner', is_active: true, shift_open: true },
  { id: 'user-002', shop_id: 'shop-001', name: 'Bilal Ahmed', email: 'bilal@alfatima.pk', role: 'cashier', is_active: true, shift_open: true },
  { id: 'user-003', shop_id: 'shop-001', name: 'Sana Bibi', email: 'sana@alfatima.pk', role: 'cashier', is_active: false, shift_open: false },
];
