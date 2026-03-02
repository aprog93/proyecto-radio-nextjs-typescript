import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: 'amber' | 'blue' | 'green' | 'red' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  color = 'amber',
}) => {
  const colorMap = {
    amber: { 
      bg: 'bg-amber-500/5 dark:bg-amber-500/10', 
      border: 'border-amber-500/30 dark:border-amber-500/40',
      text: 'text-amber-600 dark:text-amber-400',
      icon_bg: 'bg-amber-100 dark:bg-amber-500/20'
    },
    blue: { 
      bg: 'bg-blue-500/5 dark:bg-blue-500/10', 
      border: 'border-blue-500/30 dark:border-blue-500/40',
      text: 'text-blue-600 dark:text-blue-400',
      icon_bg: 'bg-blue-100 dark:bg-blue-500/20'
    },
    green: { 
      bg: 'bg-green-500/5 dark:bg-green-500/10', 
      border: 'border-green-500/30 dark:border-green-500/40',
      text: 'text-green-600 dark:text-green-400',
      icon_bg: 'bg-green-100 dark:bg-green-500/20'
    },
    red: { 
      bg: 'bg-red-500/5 dark:bg-red-500/10', 
      border: 'border-red-500/30 dark:border-red-500/40',
      text: 'text-red-600 dark:text-red-400',
      icon_bg: 'bg-red-100 dark:bg-red-500/20'
    },
    purple: { 
      bg: 'bg-purple-500/5 dark:bg-purple-500/10', 
      border: 'border-purple-500/30 dark:border-purple-500/40',
      text: 'text-purple-600 dark:text-purple-400',
      icon_bg: 'bg-purple-100 dark:bg-purple-500/20'
    },
  };

  const colors = colorMap[color];

  return (
    <div
      className={`glass border ${colors.border} rounded-xl p-6 relative overflow-hidden transition-all hover:shadow-md dark:hover:shadow-lg/20`}
    >
      {/* Background icon - subtle gradient */}
      <div className="absolute top-4 right-4 opacity-[0.03] dark:opacity-[0.08]">
        <Icon size={80} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className={`p-3 ${colors.icon_bg} rounded-lg`}>
            <Icon size={24} className={colors.text} />
          </span>
          {trend && (
            <div
              className={`text-xs font-semibold ${
                trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-sm mb-1 font-medium">{label}</p>
        <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
      </div>
    </div>
  );
};
