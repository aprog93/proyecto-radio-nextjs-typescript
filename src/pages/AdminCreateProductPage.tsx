import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import AdminProductForm from '@/components/admin/AdminProductForm';

export default function AdminCreateProductPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/products');
  };

  return (
    <AdminLayout
      title="Crear Producto"
      subtitle="Agrega un nuevo producto"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <AdminProductForm onSuccess={handleSuccess} />
        </div>
      </div>
    </AdminLayout>
  );
}
