import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Film } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MANAGER':
        return 'text-primary';
      case 'TEAMLEADER':
        return 'text-accent';
      case 'FLOORSTAFF':
        return 'text-muted';
      default:
        return 'text-text';
    }
  };

  return (
    <header className="bg-backgroundEnd border-b border-muted text-text px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Film className="h-8 w-8 text-primary" />
          <h1
            className="text-2xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-primary to-accent"
          >
            MovieVault
          </h1>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted" />
            <span className="font-medium">{user?.username}</span>
            <span
              className={`
                text-sm px-2 py-1 rounded-full bg-surface 
                ${getRoleColor(user?.role || '')}
              `}
            >
              {user?.role}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2 border-muted text-text hover:bg-accent hover:text-text"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};