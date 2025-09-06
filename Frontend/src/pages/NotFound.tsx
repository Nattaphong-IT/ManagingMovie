import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundStart text-text">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted">Oops! Page not found</p>
        <Link to="/">
          <Button className="bg-primary hover:bg-accent text-text">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
