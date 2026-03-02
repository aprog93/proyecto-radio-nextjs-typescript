import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserMenuDropdown } from './UserMenuDropdown';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onLogout?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuToggle,
  title,
  subtitle,
  actions,
  onLogout = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu size={24} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        {/* Actions and icons */}
        <div className="flex items-center gap-4">
          {actions && <div className="flex gap-2">{actions}</div>}
          <NotificationsDropdown />
          <UserMenuDropdown onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};
