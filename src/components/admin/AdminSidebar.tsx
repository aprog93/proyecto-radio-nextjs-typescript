import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Users,
  Calendar,
  Newspaper,
  ShoppingBag,
  Gift,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard', color: 'text-primary' },
    { path: '/admin/events', icon: Calendar, label: 'Eventos', color: 'text-amber-500' },
    { path: '/admin/news', icon: Newspaper, label: 'Noticias', color: 'text-blue-500' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Productos', color: 'text-green-500' },
    { path: '/admin/users', icon: Users, label: 'Usuarios', color: 'text-purple-500' },
    { path: '/admin/donations', icon: Gift, label: 'Donaciones', color: 'text-red-500' },
    { path: '/admin/settings', icon: Settings, label: 'Configuración', color: 'text-slate-500' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-card border-r border-border w-64 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Radio Admin</h2>
              <p className="text-xs text-muted-foreground">Panel de Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={20} className={active ? 'text-primary-foreground' : item.color} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Portal Link */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} />
            Ir al Portal
          </Button>
        </div>
      </aside>
    </>
  );
};
