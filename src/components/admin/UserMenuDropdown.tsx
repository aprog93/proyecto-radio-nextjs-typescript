import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserMenuDropdownProps {
  onLogout: () => void;
}

// Mock user data
const MOCK_USER = {
  name: 'Administrador',
  email: 'admin@radiocesar.com',
  role: 'Admin',
};

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        <User size={20} className="text-muted-foreground" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass rounded-lg shadow-lg border border-border overflow-hidden z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-border/50 bg-card/40">
            <p className="font-semibold text-foreground">{MOCK_USER.name}</p>
            <p className="text-xs text-muted-foreground">{MOCK_USER.email}</p>
            <p className="text-xs text-primary mt-1 font-medium">{MOCK_USER.role}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
              <User size={18} className="text-muted-foreground" />
              Mi Perfil
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
              <Settings size={18} className="text-muted-foreground" />
              Configuración
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-3 border-t border-border/50 bg-card/40">
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
