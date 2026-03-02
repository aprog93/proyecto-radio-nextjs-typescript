import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Users,
  Calendar,
  Newspaper,
  ShoppingBag,
  Gift,
  TrendingUp,
  Activity,
  Plus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminLayout, StatCard } from '@/components/admin';
import { toast } from 'sonner';

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  admins: number;
  listeners: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalNews: number;
  publishedNews: number;
  totalEvents: number;
  publishedEvents: number;
  totalProducts: number;
  publishedProducts: number;
  totalDonations: { count: number; amount: number };
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      toast.error('Acceso denegado');
    }
  }, [user, navigate]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.admin.getStats();
        setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        toast.error(`Error: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Bienvenido al panel de administración">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-secondary animate-pulse rounded-lg" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout title="Dashboard" subtitle="Bienvenido al panel de administración">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-destructive">
          <p className="font-semibold">Error al cargar datos</p>
          <p className="text-sm mt-1">{error || 'No se pudieron cargar las estadísticas'}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Bienvenido al panel de administración"
      actions={
        <Button
          onClick={() => navigate('/admin/events')}
          className="gap-2 bg-primary hover:bg-accent text-primary-foreground"
        >
          <Plus size={18} />
          Crear Contenido
        </Button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div onClick={() => navigate('/admin/users')} className="cursor-pointer hover:opacity-80 transition-opacity">
          <StatCard
            icon={Users}
            label="Total Usuarios"
            value={stats.totalUsers}
            color="blue"
            trend={{ direction: 'up', percentage: 12 }}
          />
        </div>
        <div onClick={() => navigate('/admin/users')} className="cursor-pointer hover:opacity-80 transition-opacity">
          <StatCard
            icon={Activity}
            label="Usuarios Activos"
            value={stats.activeUsers}
            color="green"
          />
        </div>
        <div onClick={() => navigate('/admin/users')} className="cursor-pointer hover:opacity-80 transition-opacity">
          <StatCard
            icon={TrendingUp}
            label="Admins"
            value={stats.admins}
            color="purple"
          />
        </div>
        <div onClick={() => navigate('/admin/donations')} className="cursor-pointer hover:opacity-80 transition-opacity">
          <StatCard
            icon={Gift}
            label="Donaciones"
            value={`$${stats.totalDonations.amount.toFixed(2)}`}
            color="red"
            trend={{ direction: 'up', percentage: 8 }}
          />
        </div>
      </div>

       {/* Content Stats */}
       <div className="glass rounded-lg p-6 mb-12">
         <h2 className="text-xl font-bold text-foreground mb-6">Resumen de Contenido</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Events */}
           <div 
             onClick={() => navigate('/admin/events')}
             className="space-y-3 cursor-pointer p-4 rounded-lg hover:bg-accent/20 transition-colors"
           >
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-amber-500/15 dark:bg-amber-500/20 rounded-lg">
                 <Calendar size={20} className="text-amber-500" />
               </div>
               <div>
                 <p className="text-sm text-muted-foreground">Eventos</p>
                 <p className="text-2xl font-bold text-foreground">{stats.totalEvents}</p>
               </div>
             </div>
             <p className="text-xs text-muted-foreground">
               {stats.publishedEvents} publicados
             </p>
             <Button
               variant="outline"
               size="sm"
               className="w-full"
               onClick={(e) => {
                 e.stopPropagation();
                 navigate('/admin/events/create');
               }}
             >
               <Plus size={16} className="mr-2" />
               Nuevo Evento
             </Button>
           </div>

           {/* News */}
           <div 
             onClick={() => navigate('/admin/news')}
             className="space-y-3 cursor-pointer p-4 rounded-lg hover:bg-accent/20 transition-colors"
           >
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-blue-500/15 dark:bg-blue-500/20 rounded-lg">
                 <Newspaper size={20} className="text-blue-500" />
               </div>
               <div>
                 <p className="text-sm text-muted-foreground">Noticias</p>
                 <p className="text-2xl font-bold text-foreground">{stats.totalNews}</p>
               </div>
             </div>
             <p className="text-xs text-muted-foreground">
               {stats.publishedNews} publicadas
             </p>
             <Button
               variant="outline"
               size="sm"
               className="w-full"
               onClick={(e) => {
                 e.stopPropagation();
                 navigate('/admin/news/create');
               }}
             >
               <Plus size={16} className="mr-2" />
               Nueva Noticia
             </Button>
           </div>

           {/* Products */}
           <div 
             onClick={() => navigate('/admin/products')}
             className="space-y-3 cursor-pointer p-4 rounded-lg hover:bg-accent/20 transition-colors"
           >
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-green-500/15 dark:bg-green-500/20 rounded-lg">
                 <ShoppingBag size={20} className="text-green-500" />
               </div>
               <div>
                 <p className="text-sm text-muted-foreground">Productos</p>
                 <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
               </div>
             </div>
             <p className="text-xs text-muted-foreground">
               {stats.publishedProducts} disponibles
             </p>
             <Button
               variant="outline"
               size="sm"
               className="w-full"
               onClick={(e) => {
                 e.stopPropagation();
                 navigate('/admin/products/create');
               }}
             >
               <Plus size={16} className="mr-2" />
               Nuevo Producto
             </Button>
           </div>
         </div>
       </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/events')}
          className="glass rounded-lg p-6 text-center hover:border-primary hover:shadow-lg transition-all"
        >
          <Calendar className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground">Gestionar Eventos</h3>
          <p className="text-xs text-muted-foreground mt-1">Crear y editar eventos</p>
        </button>

        <button
          onClick={() => navigate('/admin/news')}
          className="glass rounded-lg p-6 text-center hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <Newspaper className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground">Gestionar Noticias</h3>
          <p className="text-xs text-muted-foreground mt-1">Publicar noticias nuevas</p>
        </button>

        <button
          onClick={() => navigate('/admin/products')}
          className="glass rounded-lg p-6 text-center hover:border-green-500 hover:shadow-lg transition-all"
        >
          <ShoppingBag className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground">Gestionar Productos</h3>
          <p className="text-xs text-muted-foreground mt-1">Tienda online</p>
        </button>

        <button
          onClick={() => navigate('/admin/users')}
          className="glass rounded-lg p-6 text-center hover:border-purple-500 hover:shadow-lg transition-all"
        >
          <Users className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground">Gestionar Usuarios</h3>
          <p className="text-xs text-muted-foreground mt-1">Control de acceso</p>
        </button>
      </div>
    </AdminLayout>
  );
}
