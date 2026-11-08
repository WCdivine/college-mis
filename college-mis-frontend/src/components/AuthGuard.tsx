import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'student';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
