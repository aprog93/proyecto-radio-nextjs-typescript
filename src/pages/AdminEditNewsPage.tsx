import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import AdminNewsForm from '@/components/admin/AdminNewsForm';

export default function AdminEditNewsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/admin/news');
    return null;
  }

  const newsId = parseInt(id);

  const handleSuccess = () => {
    navigate('/admin/news');
  };

  return (
    <AdminLayout
      title="Editar Noticia"
      subtitle="Actualiza los detalles de la noticia"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <AdminNewsForm newsId={newsId} onSuccess={handleSuccess} />
        </div>
      </div>
    </AdminLayout>
  );
}
