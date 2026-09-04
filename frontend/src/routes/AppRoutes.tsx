import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts & Common
import MainLayout from '../components/layout/MainLayout';
import AnimatedPage from '../components/layout/AnimatedPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import FarmerDashboardPage from '../pages/farmer/FarmerDashboardPage';
import AddProducePage from '../pages/farmer/AddProducePage';
import EditProducePage from '../pages/farmer/EditProducePage';
import MarketplacePage from '../pages/buyer/MarketplacePage';
import ProduceDetailsPage from '../pages/buyer/ProduceDetailsPage';
import AIRecommendationPage from '../pages/buyer/AIRecommendationPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ProfilePage from '../pages/ProfilePage';

export default function AppRoutes() {
  const { user } = useAuthStore();
  const location = useLocation();

  return (
    <MainLayout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'FARMER' ? '/farmer/dashboard' : '/marketplace')} /> : <AnimatedPage><LoginPage /></AnimatedPage>} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'FARMER' ? '/farmer/dashboard' : '/marketplace')} /> : <AnimatedPage><RegisterPage /></AnimatedPage>} 
        />

        <Route path="/marketplace" element={<AnimatedPage><MarketplacePage /></AnimatedPage>} />
        <Route path="/produce/:id" element={<AnimatedPage><ProduceDetailsPage /></AnimatedPage>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
          <Route path="/farmer/dashboard" element={<AnimatedPage><FarmerDashboardPage /></AnimatedPage>} />
          <Route path="/farmer/produce/new" element={<AnimatedPage><AddProducePage /></AnimatedPage>} />
          <Route path="/farmer/produce/:id/edit" element={<AnimatedPage><EditProducePage /></AnimatedPage>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
          <Route path="/buyer/ai" element={<AnimatedPage><AIRecommendationPage /></AnimatedPage>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FARMER', 'BUYER']} />}>
          <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
        </Route>
      </Routes>
    </MainLayout>
  );
}
