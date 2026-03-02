import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminLayout, AdminTable, TableColumn } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { api, Event } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminEventsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<(Event & { actions?: React.ReactNode })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.events.getPublished(1, 100);
      if (response.events) {
        setEvents(response.events);
      }
    } catch (err) {
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este evento?')) return;
    
    try {
      await api.events.delete(id);
      toast.success('Evento eliminado');
      fetchEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar evento';
      toast.error(message);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (filter === 'published') return e.published;
    if (filter === 'draft') return !e.published;
    return true;
  });

  const columns: TableColumn<Event & { actions?: React.ReactNode }>[] = [
    {
      key: 'title',
      label: 'Título',
      width: '35%',
    },
    {
      key: 'startDate',
      label: 'Fecha',
      render: (date) => new Date(date as string).toLocaleDateString('es-ES'),
      width: '20%',
    },
    {
      key: 'location',
      label: 'Ubicación',
      width: '20%',
    },
    {
      key: 'published',
      label: 'Estado',
      render: (published) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            published
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {published ? 'Publicado' : 'Borrador'}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (id) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/events/${id}`)}
            className="gap-1"
          >
            <Edit2 size={16} />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(id as number)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      width: '10%',
    },
  ];

  return (
    <AdminLayout
      title="Gestionar Eventos"
      subtitle="Crear, editar y publicar eventos"
      actions={
        <Button
          onClick={() => navigate('/admin/events/create')}
          className="gap-2 bg-amber-500 hover:bg-amber-600"
        >
          <Plus size={18} />
          Nuevo Evento
        </Button>
      }
    >
      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {(['all', 'published', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-amber-500 text-white'
                : 'bg-secondary text-foreground border border-border hover:border-foreground/20'
            }`}
          >
            {f === 'all' && 'Todos'}
            {f === 'published' && 'Publicados'}
            {f === 'draft' && 'Borradores'}
            <span className="ml-2 text-sm opacity-75">
              ({filteredEvents.length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <AdminTable
          columns={columns}
          data={filteredEvents}
          isLoading={loading}
          emptyMessage="No hay eventos"
        />
      </div>
    </AdminLayout>
  );
}
