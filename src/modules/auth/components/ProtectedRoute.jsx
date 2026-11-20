import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

const HOME_BY_ROLE = {
  ADMINISTRADOR: '/admin/home',
  PACIENTE: '/',
};

function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={HOME_BY_ROLE[role]} replace />;
  }

  return children;
}

export default ProtectedRoute;
