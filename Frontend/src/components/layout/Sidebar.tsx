import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Home, Users, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from "../../../lib/utils"

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: Home,  label: 'Dashboard' },
    { to: '/movies',    icon: Film,  label: 'Movies' },
    { to: '/movies/new',icon: Plus,  label: 'Add Movie' },
  ];

  if (user?.role === 'MANAGER') {
    navItems.push({ to: '/users', icon: Users, label: 'Users' });
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-muted p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-text'
                  : 'text-muted hover:text-text hover:bg-accent'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};