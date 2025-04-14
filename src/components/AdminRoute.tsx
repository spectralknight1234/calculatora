
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

type AdminRouteProps = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
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

  // Redirect to auth if no user is found
  if (!user && authCheckComplete) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to main page if user is not admin
  if (user && !isAdmin && authCheckComplete) {
    return <Navigate to="/" replace />;
  }

  // If we have a user that is an admin
  return <>{children}</>;
};

export default AdminRoute;
