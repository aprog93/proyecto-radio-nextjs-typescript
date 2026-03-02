import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminLayout, AdminTable, TableColumn } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { api, News } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminNewsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.news.getPublished(1, 100);
      if (response.news) {
        setNews(response.news);
      }
    } catch (err) {
      toast.error('Error al cargar noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta noticia?')) return;
    
    try {
      await api.news.delete(id);
      toast.success('Noticia eliminada');
      fetchNews();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar noticia';
      toast.error(message);
    }
  };

  const filteredNews = news.filter((n) => {
    if (filter === 'published') return n.published;
    if (filter === 'draft') return !n.published;
    return true;
  });

  const columns: TableColumn<News>[] = [
    {
      key: 'title',
      label: 'Título',
      width: '40%',
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
          {published ? 'Publicada' : 'Borrador'}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (date) => new Date(date as string).toLocaleDateString('es-ES'),
      width: '20%',
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (id) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/news/${id}`)}
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
      width: '25%',
    },
  ];

  return (
    <AdminLayout
      title="Gestionar Noticias"
      subtitle="Crear, editar y publicar noticias"
      actions={
        <Button
          onClick={() => navigate('/admin/news/create')}
          className="gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <Plus size={18} />
          Nueva Noticia
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
                ? 'bg-blue-500 text-white'
                : 'bg-secondary text-foreground border border-border hover:border-foreground/20'
            }`}
          >
            {f === 'all' && 'Todas'}
            {f === 'published' && 'Publicadas'}
            {f === 'draft' && 'Borradores'}
            <span className="ml-2 text-sm opacity-75">
              ({filteredNews.length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <AdminTable
          columns={columns}
          data={filteredNews}
          isLoading={loading}
          emptyMessage="No hay noticias"
        />
      </div>
    </AdminLayout>
  );
}
