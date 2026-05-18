import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Recommendation from './pages/Recommendation';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import PharmacistDashboard from './pages/PharmacistDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />

        {/* Staff Routes */}
        <Route path="/pharmacist" element={<PharmacistDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}