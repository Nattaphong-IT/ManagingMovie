// src/components/layout/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('mm_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
