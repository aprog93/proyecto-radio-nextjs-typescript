import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Nuevo usuario registrado',
    message: 'Juan Pérez se registró en la plataforma',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    read: false,
  },
  {
    id: 2,
    title: 'Nuevo evento creado',
    message: 'Se publicó el evento "Festival de Radio"',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    read: false,
  },
  {
    id: 3,
    title: 'Nueva donación recibida',
    message: 'Se recibió una donación de $100',
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    read: true,
  },
  {
    id: 4,
    title: 'Producto sin stock',
    message: 'El producto "Camiseta" se encuentra agotado',
    timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    read: true,
  },
];

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const handleMarkAsRead = (id: number) => {
    setNotifications((prevs) =>
      prevs.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleRemove = (id: number) => {
    setNotifications((prevs) => prevs.filter((n) => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-secondary rounded-lg relative transition-colors"
      >
        <Bell size={20} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-lg border border-border overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-border/50 bg-card/40">
            <h3 className="font-semibold text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} nuevas</p>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border/30 transition-colors hover:bg-secondary/50 cursor-pointer ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 opacity-75">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(notification.id);
                      }}
                      className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border/50 bg-card/40">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setNotifications([])}
              >
                Marcar todas como leídas
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
