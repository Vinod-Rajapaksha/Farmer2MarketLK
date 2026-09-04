import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
interface ProtectedRouteProps {
  allowedRoles?: ('FARMER' | 'BUYER' | 'ADMIN')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuthStore();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'FARMER' ? '/farmer/dashboard' : '/marketplace')} replace />;
  }

  return <Outlet />;
}
