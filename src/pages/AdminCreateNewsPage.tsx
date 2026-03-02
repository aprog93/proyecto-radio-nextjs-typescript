import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import AdminNewsForm from '@/components/admin/AdminNewsForm';

export default function AdminCreateNewsPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/news');
  };

  return (
    <AdminLayout
      title="Crear Noticia"
      subtitle="Agrega una nueva noticia"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <AdminNewsForm onSuccess={handleSuccess} />
        </div>
      </div>
    </AdminLayout>
  );
}
