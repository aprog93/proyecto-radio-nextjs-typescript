import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface AdminTableProps<T extends { id: string | number }> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export const AdminTable = React.forwardRef<HTMLTableElement, AdminTableProps<any>>(
  ({ columns, data, isLoading, emptyMessage = 'Sin datos', onRowClick }, ref) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table ref={ref} className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="text-left px-6 py-4 font-semibold text-foreground"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              <th className="w-12 px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-b border-border hover:bg-secondary/50 transition-all duration-200 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 text-foreground">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
                {onRowClick && (
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

AdminTable.displayName = 'AdminTable';
