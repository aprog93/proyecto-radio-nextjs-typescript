import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Event } from '@/lib/api';

interface AdminEventFormProps {
  eventId?: number;
  onSuccess: () => void;
}

const AdminEventForm = ({ eventId, onSuccess }: AdminEventFormProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!eventId);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: '',
    image: '',
    published: false,
  });

  // Fetch event data if editing
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setIsFetching(true);
        const event = await api.events.getById(eventId);
        setFormData({
          title: event.title || '',
          description: event.description || '',
          startDate: event.startDate ? event.startDate.split('T')[0] : '',
          endDate: event.endDate ? event.endDate.split('T')[0] : '',
          location: event.location || '',
          capacity: event.capacity?.toString() || '',
          image: event.image || '',
          published: event.published || false,
        });
        if (event.image) {
          setImagePreview(event.image);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : t('admin.load_failed');
        toast.error(message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchEvent();
  }, [eventId, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublishedChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      published: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagen muy grande. Máximo 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFormData((prev) => ({
        ...prev,
        image: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error(t('admin.validation.required_fields'));
      return;
    }

    // Validate end date is after start date
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('La fecha de finalización debe ser posterior a la fecha de inicio');
      return;
    }

    setIsLoading(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        image: formData.image || undefined,
        published: formData.published,
      };

      if (eventId) {
        await api.events.update(eventId, eventData);
        toast.success('Evento actualizado correctamente');
      } else {
        await api.events.create(eventData);
        toast.success('Evento creado correctamente');
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.create_failed');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="text-sm font-medium text-foreground block mb-1">
          Título del Evento *
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="ej: Festival de Radio Comunitaria"
          value={formData.title}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="text-sm font-medium text-foreground block mb-1">
          Descripción
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe el evento en detalle..."
          value={formData.description}
          onChange={handleInputChange}
          disabled={isLoading}
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Imagen del Evento
        </label>
        {imagePreview ? (
          <div className="relative w-full">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={20} className="text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Subir imagen</p>
              <p className="text-xs text-muted-foreground">PNG, JPG o GIF (máx. 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Date/Location Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="text-sm font-medium text-foreground block mb-1">
            Fecha de Inicio *
          </label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="text-sm font-medium text-foreground block mb-1">
            Fecha de Finalización *
          </label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* Location & Capacity Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="text-sm font-medium text-foreground block mb-1">
            Ubicación
          </label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="ej: Plaza Central"
            value={formData.location}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="capacity" className="text-sm font-medium text-foreground block mb-1">
            Capacidad (Personas)
          </label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            placeholder="ej: 500"
            value={formData.capacity}
            onChange={handleInputChange}
            disabled={isLoading}
            min="0"
          />
        </div>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <label htmlFor="published" className="text-sm font-medium text-foreground">
          Publicar Evento
        </label>
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={handlePublishedChange}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full gap-2 bg-primary hover:bg-accent text-primary-foreground">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {eventId ? 'Actualizar Evento' : 'Crear Evento'}
      </Button>
    </form>
  );
};

export default AdminEventForm;
