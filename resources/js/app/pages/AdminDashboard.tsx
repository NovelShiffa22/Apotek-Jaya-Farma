import { useState } from 'react';
import { TrendingUp, ShoppingBag, AlertTriangle, Plus, Edit2, Trash2, Search, Filter, Download, Package, DollarSign, Users, TrendingDown, UserCog, Shield, Mail, Calendar, LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';

const products = [
  { id: '1', name: 'Paracetamol 500mg', stock: 150, price: 15000, category: 'bebas', symptoms: ['Demam', 'Sakit Kepala'], sales: 245 },
  { id: '2', name: 'Amoxicillin 500mg', stock: 5, price: 45000, category: 'keras', symptoms: ['Batuk', 'Infeksi'], sales: 87 },
  { id: '3', name: 'Vitamin C 1000mg', stock: 200, price: 85000, category: 'bebas', symptoms: [], sales: 156 },
  { id: '4', name: 'Omeprazole 20mg', stock: 12, price: 125000, category: 'terbatas', symptoms: ['GERD'], sales: 42 },
];

const orders = [
  { id: 'ORD-001', customer: 'John Doe', status: 'diproses', total: 45000, date: '2026-04-29 10:30', items: 2 },
  { id: 'ORD-002', customer: 'Jane Smith', status: 'disiapkan', total: 125000, date: '2026-04-29 11:15', items: 1 },
  { id: 'ORD-003', customer: 'Bob Wilson', status: 'dikirim', total: 30000, date: '2026-04-29 12:00', items: 3 },
  { id: 'ORD-004', customer: 'Alice Chen', status: 'selesai', total: 85000, date: '2026-04-28 15:20', items: 1 },
];

const users = [
  { id: '1', name: 'Dr. Ahmad Wijaya', email: 'ahmad.wijaya@apotek.com', role: 'admin', status: 'active', joinDate: '2024-01-15', lastActive: '2026-04-29 14:30' },
  { id: '2', name: 'Apt. Sarah Kusuma', email: 'sarah.kusuma@apotek.com', role: 'pharmacist', status: 'active', joinDate: '2024-03-20', lastActive: '2026-04-29 15:20' },
  { id: '3', name: 'Apt. Budi Santoso', email: 'budi.santoso@apotek.com', role: 'pharmacist', status: 'active', joinDate: '2024-05-10', lastActive: '2026-04-29 13:45' },
  { id: '4', name: 'John Doe', email: 'john.doe@email.com', role: 'customer', status: 'active', joinDate: '2025-08-12', lastActive: '2026-04-28 10:15' },
  { id: '5', name: 'Jane Smith', email: 'jane.smith@email.com', role: 'customer', status: 'active', joinDate: '2025-09-05', lastActive: '2026-04-29 11:30' },
  { id: '6', name: 'Apt. Linda Putri', email: 'linda.putri@apotek.com', role: 'pharmacist', status: 'inactive', joinDate: '2024-02-28', lastActive: '2026-03-15 09:00' },
  { id: '7', name: 'Bob Wilson', email: 'bob.wilson@email.com', role: 'customer', status: 'active', joinDate: '2025-11-20', lastActive: '2026-04-29 12:00' },
  { id: '8', name: 'Alice Chen', email: 'alice.chen@email.com', role: 'customer', status: 'active', joinDate: '2026-01-08', lastActive: '2026-04-28 15:20' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'pharmacist' | 'customer'>('all');

  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    diproses: { label: 'Diproses', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    disiapkan: { label: 'Disiapkan', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    dikirim: { label: 'Dikirim', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
    selesai: { label: 'Selesai', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#f1f5f9] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[32px] tracking-[-0.8px] text-[#171d19]">
                Dashboard Admin
              </h1>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70] mt-1">
                Kelola produk, pesanan, dan analytics
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#f1f5f9] rounded-xl hover:shadow-sm hover:border-[#006a3f] transition-all">
                <Download size={16} className="text-[#171d19]" />
                <span className="font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19]">Export</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#006a3f] hover:bg-[#005632] rounded-xl text-white hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)] transition-all">
                <Plus size={16} />
                <span className="font-['Inter',sans-serif] text-[13px] font-medium">Tambah Produk</span>
              </button>
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-[#ba1a1a] transition-all font-medium font-['Inter',sans-serif] text-[13px] cursor-pointer"
              >
                <LogOut size={16} />
                <span>Keluar</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Enhanced Tab Navigation */}
        <div className="flex gap-3 mb-8">
          {[
            { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
            { id: 'products' as const, label: 'Produk & Stok', icon: Package, badge: products.filter(p => p.stock < 50).length },
            { id: 'orders' as const, label: 'Manajemen Pesanan', icon: ShoppingBag, badge: orders.filter(o => o.status === 'diproses').length },
            { id: 'users' as const, label: 'Manajemen User', icon: UserCog, badge: users.filter(u => u.status === 'inactive').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-['Inter',sans-serif] text-[14px] font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#006a3f] text-white shadow-[0_4px_12px_rgba(0,106,63,0.25)]'
                  : 'bg-white text-[#171d19] border border-[#f1f5f9] hover:border-[#006a3f] hover:shadow-sm'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-red-100 text-red-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total Penjualan', value: 'Rp 12.5M', change: '+18.5%', trend: 'up', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Jumlah Transaksi', value: '847', change: '+12.3%', trend: 'up', icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
                { label: 'Pelanggan Aktif', value: '1,248', change: '+8.7%', trend: 'up', icon: Users, color: 'from-purple-500 to-purple-600' },
                { label: 'Avg Order Value', value: 'Rp 147K', change: '-2.4%', trend: 'down', icon: TrendingDown, color: 'from-amber-500 to-amber-600' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="text-white" size={22} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                      stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span className="font-['Inter',sans-serif] text-[11px] font-semibold">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70] uppercase tracking-wider font-bold mb-2">
                    {stat.label}
                  </p>
                  <p className="font-['Roboto_Condensed',sans-serif] font-semibold text-[32px] text-[#171d19] tracking-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] font-semibold">
                    Revenue Trend
                  </h3>
                  <select className="px-4 py-2 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[13px] text-[#171d19] font-medium focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f]">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                {/* Chart Placeholder */}
                <div className="h-64 bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] rounded-xl flex items-center justify-center border border-[#f1f5f9]">
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                    Chart visualization here
                  </p>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] font-semibold mb-6">
                  Top Selling Products
                </h3>
                <div className="space-y-4">
                  {products.sort((a, b) => b.sales - a.sales).slice(0, 5).map((product, idx) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-lg flex items-center justify-center text-white font-['Inter',sans-serif] text-[12px] font-semibold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-['Roboto_Condensed',sans-serif] text-[15px] text-[#171d19] font-medium">
                          {product.name}
                        </p>
                        <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">
                          {product.sales} penjualan
                        </p>
                      </div>
                      <p className="font-['Roboto_Condensed',sans-serif] text-[14px] text-[#006a3f] font-semibold">
                        Rp {(product.price * product.sales).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Critical Stock Alert */}
            <div className="bg-gradient-to-br from-red-50 via-white to-amber-50 rounded-2xl p-8 border-2 border-red-200 shadow-[0_8px_24px_rgba(239,68,68,0.08)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] tracking-[-0.6px] text-[#171d19] font-semibold">
                    Peringatan Stok Kritis
                  </h2>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                    {products.filter(p => p.stock < 50).length} produk memerlukan restock segera
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {products.filter(p => p.stock < 50).map(product => (
                  <div key={product.id} className="bg-white rounded-xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold mb-1">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                              style={{ width: `${(product.stock / 50) * 100}%` }}
                            />
                          </div>
                          <p className={`font-['Inter',sans-serif] text-[13px] font-semibold ${
                            product.stock < 10 ? 'text-red-700' : 'text-amber-700'
                          }`}>
                            {product.stock} unit
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[#006a3f] hover:bg-[#005632] px-4 py-2.5 rounded-lg font-['Inter',sans-serif] text-[13px] text-white font-medium hover:shadow-lg transition-all">
                      Restock Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7a70]" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:bg-white focus:border-[#006a3f] transition-all placeholder:text-[#6e7a70]"
                  />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl hover:bg-white hover:border-[#006a3f] transition-all">
                  <Filter size={18} className="text-[#171d19]" />
                  <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19]">Filter</span>
                </button>
              </div>
            </div>

            {/* Enhanced Product Table */}
            <div className="bg-white rounded-2xl border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f5f7f6] border-b border-[#f1f5f9]">
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Stok
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Penjualan
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Label Gejala
                    </th>
                    <th className="px-6 py-4 text-right font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#fafaf8] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] rounded-lg" />
                          <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#171d19] font-medium">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium ${
                          product.category === 'bebas' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          product.category === 'keras' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {product.category === 'bebas' ? 'Bebas' : product.category === 'keras' ? 'Keras' : 'Terbatas'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[100px]">
                            <div className="h-2 bg-[#e8e8e6] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  product.stock < 10 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                  product.stock < 50 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                  'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                }`}
                                style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className={`font-['Inter',sans-serif] text-[14px] font-semibold ${
                            product.stock < 10 ? 'text-red-700' :
                            product.stock < 50 ? 'text-amber-700' :
                            'text-emerald-700'
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-['Inter',sans-serif] text-[14px] text-[#171d19] font-medium">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-5 font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                        {product.sales} unit
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {product.symptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-md font-['Inter',sans-serif] text-[11px] font-medium"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2 justify-end">
                          <button className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors group">
                            <Edit2 size={16} className="text-[#171d19] opacity-60 group-hover:text-[#006a3f] group-hover:opacity-100 transition-colors" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                            <Trash2 size={16} className="text-red-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-6 font-semibold">
              Manajemen Pesanan
            </h2>

            <div className="grid gap-4">
              {orders.map(order => {
                const config = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        {/* Order Info */}
                        <div>
                          <p className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] font-semibold mb-1">
                            {order.id}
                          </p>
                          <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                            {order.customer} • {order.date}
                          </p>
                        </div>

                        {/* Items Count */}
                        <div className="bg-[#f9fafb] rounded-xl px-4 py-2 border border-[#f1f5f9]">
                          <p className="font-['Inter',sans-serif] text-[11px] text-[#6e7a70] uppercase tracking-wider font-bold mb-0.5">
                            Items
                          </p>
                          <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold">
                            {order.items}
                          </p>
                        </div>

                        {/* Total */}
                        <div className="bg-[#f9fafb] rounded-xl px-4 py-2 border border-[#f1f5f9]">
                          <p className="font-['Inter',sans-serif] text-[11px] text-[#6e7a70] uppercase tracking-wider font-bold mb-0.5">
                            Total
                          </p>
                          <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#006a3f] font-semibold">
                            Rp {order.total.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-4">
                        <select
                          defaultValue={order.status}
                          className={`px-4 py-2.5 rounded-xl font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase border-2 focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 ${config.bg} ${config.color} ${config.border}`}
                        >
                          <option value="diproses">Diproses</option>
                          <option value="disiapkan">Disiapkan</option>
                          <option value="dikirim">Dikirim</option>
                          <option value="selesai">Selesai</option>
                        </select>

                        <button className="px-5 py-2.5 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] hover:bg-white hover:border-[#006a3f] transition-all">
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] font-semibold">
                  Manajemen User
                </h2>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70] mt-1">
                  Kelola akses dan peran pengguna sistem
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#006a3f] hover:bg-[#005632] rounded-xl text-white hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5">
                <Plus size={18} />
                <span className="font-['Roboto_Condensed',sans-serif] text-[14px] font-medium">Tambah User Baru</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              {[
                { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700' },
                { label: 'Admin', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' },
                { label: 'Apoteker', value: users.filter(u => u.role === 'pharmacist').length, icon: UserCog, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                { label: 'Pelanggan', value: users.filter(u => u.role === 'customer').length, icon: Users, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-700' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="text-white" size={22} />
                    </div>
                  </div>
                  <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70] uppercase tracking-wider mb-2 font-bold">
                    {stat.label}
                  </p>
                  <p className="font-['Roboto_Condensed',sans-serif] font-semibold text-[32px] text-[#171d19] tracking-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7a70]" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama atau email..."
                    className="w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:bg-white focus:border-[#006a3f] transition-all placeholder:text-[#6e7a70]"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-5 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] font-medium focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="pharmacist">Apoteker</option>
                  <option value="customer">Pelanggan</option>
                </select>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-2xl border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f5f7f6] border-b border-[#f1f5f9]">
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Bergabung
                    </th>
                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Terakhir Aktif
                    </th>
                    <th className="px-6 py-4 text-right font-['Inter',sans-serif] font-bold text-[11px] text-[#6e7a70] tracking-wider uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => {
                      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
                      return matchesSearch && matchesRole;
                    })
                    .map((user) => {
                      const roleConfig = {
                        admin: { label: 'Admin', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Shield },
                        pharmacist: { label: 'Apoteker', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: UserCog },
                        customer: { label: 'Pelanggan', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Users }
                      }[user.role as 'admin' | 'pharmacist' | 'customer'] || { label: 'Pelanggan', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Users };

                      return (
                        <tr key={user.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#fafaf8] transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-full flex items-center justify-center">
                                <span className="font-['Roboto_Condensed',sans-serif] text-white text-[14px] font-semibold">
                                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                              <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#171d19] font-medium">
                                {user.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-[#6e7a70]" />
                              <span className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                {user.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                              <roleConfig.icon size={14} />
                              <span className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase">
                                {roleConfig.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-block px-3 py-1.5 rounded-full text-[12px] font-bold tracking-wider uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-[#6e7a70]" />
                              <span className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                {new Date(user.joinDate).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                            {user.lastActive}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-2 justify-end">
                              <button className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors group" title="Edit user">
                                <Edit2 size={16} className="text-[#171d19] opacity-60 group-hover:text-[#006a3f] group-hover:opacity-100 transition-colors" />
                              </button>
                              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Hapus user">
                                <Trash2 size={16} className="text-red-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {users.filter(user => {
              const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesRole = roleFilter === 'all' || user.role === roleFilter;
              return matchesSearch && matchesRole;
            }).length === 0 && (
              <div className="bg-white rounded-2xl border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-16 text-center">
                <div className="w-20 h-20 bg-[#f9fafb] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users size={32} className="text-[#6e7a70]" />
                </div>
                <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] mb-2 font-semibold">
                  Tidak ada user ditemukan
                </h3>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
