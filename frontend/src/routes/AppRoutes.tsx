import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts & Common
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import FarmerDashboardPage from '../pages/farmer/FarmerDashboardPage';
import AddProducePage from '../pages/farmer/AddProducePage';
import MarketplacePage from '../pages/buyer/MarketplacePage';
import ProduceDetailsPage from '../pages/buyer/ProduceDetailsPage';
import AIRecommendationPage from '../pages/buyer/AIRecommendationPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

export default function AppRoutes() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'FARMER' ? '/farmer/dashboard' : '/marketplace')} /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'FARMER' ? '/farmer/dashboard' : '/marketplace')} /> : <RegisterPage />} 
          />

          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/produce/:id" element={<ProduceDetailsPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
            <Route path="/farmer/produce/new" element={<AddProducePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
            <Route path="/buyer/ai" element={<AIRecommendationPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
