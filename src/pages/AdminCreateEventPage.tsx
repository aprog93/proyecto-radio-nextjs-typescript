import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import AdminEventForm from '@/components/admin/AdminEventForm';

export default function AdminCreateEventPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/events');
  };

  return (
    <AdminLayout
      title="Crear Evento"
      subtitle="Agrrega un nuevo evento"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <AdminEventForm onSuccess={handleSuccess} />
        </div>
      </div>
    </AdminLayout>
  );
}
