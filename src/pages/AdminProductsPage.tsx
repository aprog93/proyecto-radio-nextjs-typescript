import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { AdminLayout, AdminTable, TableColumn } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { api, Product } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.products.getPublished(1, 100);
      if (response.products) {
        setProducts(response.products);
      }
    } catch (err) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;
    
    try {
      await api.products.delete(id);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar producto';
      toast.error(message);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'published') return p.published;
    if (filter === 'draft') return !p.published;
    return true;
  });

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Producto',
      width: '35%',
      render: (name, product) => (
        <div className="flex items-center gap-3">
          {product.image ? (
            <img
              src={product.image}
              alt={name as string}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
              <ImageIcon size={16} className="text-slate-400" />
            </div>
          )}
          <span>{name}</span>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      render: (price) => `$${Number(price).toFixed(2)}`,
      width: '15%',
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (stock) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            (stock as number) > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {stock} unidades
        </span>
      ),
      width: '15%',
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
            onClick={() => navigate(`/admin/products/${id}`)}
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
      width: '20%',
    },
  ];

  return (
    <AdminLayout
      title="Gestionar Productos"
      subtitle="Crear, editar y publicar productos"
      actions={
        <Button
          onClick={() => navigate('/admin/products/create')}
          className="gap-2 bg-green-500 hover:bg-green-600"
        >
          <Plus size={18} />
          Nuevo Producto
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
                ? 'bg-green-500 text-white'
                : 'bg-secondary text-foreground border border-border hover:border-foreground/20'
            }`}
          >
            {f === 'all' && 'Todos'}
            {f === 'published' && 'Publicados'}
            {f === 'draft' && 'Borradores'}
            <span className="ml-2 text-sm opacity-75">
              ({filteredProducts.length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <AdminTable
          columns={columns}
          data={filteredProducts}
          isLoading={loading}
          emptyMessage="No hay productos"
        />
      </div>
    </AdminLayout>
  );
}
