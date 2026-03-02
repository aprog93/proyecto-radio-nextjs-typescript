import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, TrendingUp, DollarSign, User } from 'lucide-react';
import { AdminLayout, AdminTable, TableColumn, StatCard } from '@/components/admin';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  paymentMethod: string;
  message?: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  averageAmount: number;
  topDonor: { name: string; amount: number } | null;
}

export default function AdminDonationsPage() {
  const { t } = useTranslation();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      // Asume que hay un endpoint de donaciones
      const response = await api.get('/donations');
      if (response.success && response.data) {
        setDonations(Array.isArray(response.data) ? response.data : response.data.donations || []);
      }
    } catch (err) {
      // Las donaciones pueden no estar implementadas en backend aún
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.success && response.data?.totalDonations) {
        const { count, amount } = response.data.totalDonations;
        setStats({
          totalDonations: count,
          totalAmount: amount,
          averageAmount: count > 0 ? amount / count : 0,
          topDonor: null, // Could be fetched from separate endpoint
        });
      }
    } catch (err) {
      toast.error('Error al cargar estadísticas de donaciones');
    }
  };

  const filteredDonations = donations.filter((d) => {
    if (filter === 'completed') return d.status === 'completed';
    if (filter === 'pending') return d.status === 'pending';
    if (filter === 'failed') return d.status === 'failed';
    return true;
  });

  const columns: TableColumn<Donation>[] = [
    {
      key: 'donorName',
      label: 'Donante',
      width: '25%',
    },
    {
      key: 'amount',
      label: 'Monto',
      render: (amount) => `$${Number(amount).toFixed(2)}`,
    },
    {
      key: 'paymentMethod',
      label: 'Método de Pago',
    },
    {
      key: 'status',
      label: 'Estado',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'completed'
              ? 'bg-green-100 text-green-800'
              : status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status === 'completed' && 'Completada'}
          {status === 'pending' && 'Pendiente'}
          {status === 'failed' && 'Fallida'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (date) => new Date(date as string).toLocaleDateString('es-ES'),
    },
  ];

  return (
    <AdminLayout
      title="Gestionar Donaciones"
      subtitle="Seguimiento de donaciones y recaudación"
    >
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            label="Monto Total"
            value={`$${stats.totalAmount.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={Gift}
            label="Total Donaciones"
            value={stats.totalDonations}
            color="red"
          />
          <StatCard
            icon={TrendingUp}
            label="Promedio"
            value={`$${stats.averageAmount.toFixed(2)}`}
            color="blue"
          />
          <StatCard
            icon={User}
            label="Top Donante"
            value={stats.topDonor?.name || 'N/A'}
            color="purple"
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {(['all', 'completed', 'pending', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-green-500 text-white'
                : 'bg-secondary text-foreground border border-border hover:border-foreground/20'
            }`}
          >
            {f === 'all' && 'Todas'}
            {f === 'completed' && 'Completadas'}
            {f === 'pending' && 'Pendientes'}
            {f === 'failed' && 'Fallidas'}
            <span className="ml-2 text-sm opacity-75">
              ({filteredDonations.length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <AdminTable
          columns={columns}
          data={filteredDonations}
          isLoading={loading}
          emptyMessage="No hay donaciones registradas"
        />
      </div>

      {/* Export Button */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 glass rounded-lg font-medium text-foreground hover:border-primary transition-colors">
          📥 Descargar Reporte
        </button>
      </div>
    </AdminLayout>
  );
}
