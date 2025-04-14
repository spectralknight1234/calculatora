
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  useEffect(() => {
    // Set a timeout to ensure we don't get stuck in loading state
    const timer = setTimeout(() => {
      setAuthCheckComplete(true);
    }, 2000); // 2 seconds timeout
    
    // If auth is done loading before timeout, clear the timer
    if (!loading) {
      clearTimeout(timer);
      setAuthCheckComplete(true);
    }
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading state for a short time
  if (loading && !authCheckComplete) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If no user is found after loading completes, redirect to auth
  if (!user && authCheckComplete) {
    return <Navigate to="/auth" replace />;
  }

  // If we have a user or timed out but still have a session cookie
  return <>{children}</>;
};

export default ProtectedRoute;
