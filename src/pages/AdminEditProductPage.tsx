import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import AdminProductForm from '@/components/admin/AdminProductForm';

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/admin/products');
    return null;
  }

  const productId = parseInt(id);

  const handleSuccess = () => {
    navigate('/admin/products');
  };

  return (
    <AdminLayout
      title="Editar Producto"
      subtitle="Actualiza los detalles del producto"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <AdminProductForm productId={productId} onSuccess={handleSuccess} />
        </div>
      </div>
    </AdminLayout>
  );
}
