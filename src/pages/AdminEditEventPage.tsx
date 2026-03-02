import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import AdminEventForm from '@/components/admin/AdminEventForm';

export default function AdminEditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/admin/events');
    return null;
  }

  const eventId = parseInt(id);

  const handleSuccess = () => {
    navigate('/admin/events');
  };

  return (
    <AdminLayout
      title="Editar Evento"
      subtitle="Actualiza los detalles del evento"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <AdminEventForm eventId={eventId} onSuccess={handleSuccess} />
        </div>
      </div>
    </AdminLayout>
  );
}
