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
  Radio,
  Music,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminLayout, StatCard } from '@/components/admin';
import { toast } from 'sonner';

interface LiveStatsData {
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
  azuracast: {
    currentListeners: number;
    totalListeners: number;
    isOnline: boolean;
    nowPlaying: {
      artist: string;
      title: string;
      album?: string;
      art?: string;
      duration?: number;
      elapsed?: number;
    } | null;
    station: {
      name: string;
      description: string;
      bitrate: number;
      format: string;
    };
  };
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<LiveStatsData | null>(null);
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
        const data = await api.admin.getLiveStats();
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
    // Refresh stats every 15 seconds for live data
    const interval = setInterval(fetchStats, 15000);
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

      {/* Live Streaming Stats from AzuraCast */}
      <div className="glass rounded-lg p-6 mb-12 border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-500/15 dark:bg-red-500/20 rounded-lg animate-pulse">
            <Radio size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Transmisión en Vivo</h2>
            <p className="text-sm text-muted-foreground">
              {stats.azuracast.isOnline ? '🟢 En línea' : '🔴 Fuera de línea'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Station Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estación</p>
              <p className="text-lg font-semibold text-foreground">{stats.azuracast.station.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.azuracast.station.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bitrate</p>
              <p className="text-lg font-semibold text-foreground">{stats.azuracast.station.bitrate} kbps - {stats.azuracast.station.format}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Oyentes</p>
              <p className="text-2xl font-bold text-blue-500">{stats.azuracast.currentListeners}</p>
              <p className="text-xs text-muted-foreground">Total: {stats.azuracast.totalListeners}</p>
            </div>
          </div>

          {/* Now Playing */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Music size={16} />
                Ahora reproduciendo
              </p>
              {stats.azuracast.nowPlaying ? (
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="flex gap-4 items-start">
                    {/* Album Art - Small */}
                    {stats.azuracast.nowPlaying.art && (
                      <img 
                        src={stats.azuracast.nowPlaying.art} 
                        alt="Album art"
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    {/* Song Info */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <p className="font-semibold text-foreground truncate">{stats.azuracast.nowPlaying.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{stats.azuracast.nowPlaying.artist}</p>
                      {stats.azuracast.nowPlaying.album && (
                        <p className="text-xs text-muted-foreground italic truncate">{stats.azuracast.nowPlaying.album}</p>
                      )}
                      {stats.azuracast.nowPlaying.duration && (
                        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                          {stats.azuracast.nowPlaying.elapsed || 0}s / {stats.azuracast.nowPlaying.duration}s
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-accent/30 rounded-lg p-4 text-center py-6">
                  <Volume2 size={24} className="text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground text-sm">Sin información de reproducción</p>
                </div>
              )}
            </div>
          </div>
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
