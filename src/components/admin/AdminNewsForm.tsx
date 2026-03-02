import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { News } from '@/lib/api';

interface AdminNewsFormProps {
  newsId?: number;
  onSuccess: () => void;
}

const AdminNewsForm = ({ newsId, onSuccess }: AdminNewsFormProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!newsId);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    expiresAt: '',
    published: false,
  });

  // Fetch news data if editing
  useEffect(() => {
    if (!newsId) return;

    const fetchNews = async () => {
      try {
        setIsFetching(true);
        const newsItem = await api.news.getById(newsId);
        setFormData({
          title: newsItem.title || '',
          content: newsItem.content || '',
          image: newsItem.image || '',
          expiresAt: newsItem.expiresAt ? newsItem.expiresAt.split('T')[0] : '',
          published: newsItem.published || false,
        });
        if (newsItem.image) {
          setImagePreview(newsItem.image);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : t('admin.load_failed');
        toast.error(message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchNews();
  }, [newsId, t]);

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
    if (!formData.title || !formData.content) {
      toast.error(t('admin.validation.required_fields'));
      return;
    }

    if (formData.content.length < 10) {
      toast.error('El contenido debe tener al menos 10 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const newsData = {
        title: formData.title,
        content: formData.content,
        image: formData.image || undefined,
        expiresAt: formData.expiresAt || undefined,
        published: formData.published,
      };

      if (newsId) {
        await api.news.update(newsId, newsData);
        toast.success('Noticia actualizada correctamente');
      } else {
        await api.news.create(newsData);
        toast.success('Noticia creada correctamente');
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
          Título de la Noticia *
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="ej: Nueva Transmisión en Vivo"
          value={formData.title}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="text-sm font-medium text-foreground block mb-1">
          Contenido *
        </label>
        <Textarea
          id="content"
          name="content"
          placeholder="Escribe el contenido de la noticia..."
          value={formData.content}
          onChange={handleInputChange}
          disabled={isLoading}
          rows={6}
          minLength={10}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Mínimo 10 caracteres | {formData.content.length} caracteres
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Imagen de la Noticia
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

      {/* Expires At */}
      <div>
        <label htmlFor="expiresAt" className="text-sm font-medium text-foreground block mb-1">
          Fecha de Expiración (Opcional)
        </label>
        <Input
          id="expiresAt"
          name="expiresAt"
          type="date"
          value={formData.expiresAt}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          La noticia se ocultará después de esta fecha
        </p>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <label htmlFor="published" className="text-sm font-medium text-foreground">
          Publicar Noticia
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
        {newsId ? 'Actualizar Noticia' : 'Crear Noticia'}
      </Button>
    </form>
  );
};

export default AdminNewsForm;
