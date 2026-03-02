import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Product } from '@/lib/api';

interface AdminProductFormProps {
  productId?: number;
  onSuccess: () => void;
}

const AdminProductForm = ({ productId, onSuccess }: AdminProductFormProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!productId);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    published: false,
  });

  // Fetch product data if editing
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setIsFetching(true);
        const product = await api.products.getById(productId);
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          category: product.category || '',
          stock: product.stock?.toString() || '',
          image: product.image || '',
          published: product.published || false,
        });
        if (product.image) {
          setImagePreview(product.image);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : t('admin.load_failed');
        toast.error(message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [productId, t]);

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
    if (!formData.name || !formData.price) {
      toast.error(t('admin.validation.required_fields'));
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error('El precio debe ser un número válido mayor o igual a 0');
      return;
    }

    const stock = formData.stock ? parseInt(formData.stock) : 0;
    if (isNaN(stock) || stock < 0) {
      toast.error('El stock debe ser un número válido mayor o igual a 0');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        price: price,
        category: formData.category || undefined,
        stock: stock,
        image: formData.image || undefined,
        published: formData.published,
      };

      if (productId) {
        await api.products.update(productId, productData);
        toast.success('Producto actualizado correctamente');
      } else {
        await api.products.create(productData);
        toast.success('Producto creado correctamente');
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
      {/* Name */}
      <div>
        <label htmlFor="name" className="text-sm font-medium text-foreground block mb-1">
          Nombre del Producto *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="ej: Camiseta Radio Cesar"
          value={formData.name}
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
          placeholder="Describe el producto en detalle..."
          value={formData.description}
          onChange={handleInputChange}
          disabled={isLoading}
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Imagen del Producto
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

      {/* Price & Stock Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="text-sm font-medium text-foreground block mb-1">
            Precio ($) *
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="stock" className="text-sm font-medium text-foreground block mb-1">
            Stock (Unidades)
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="0"
            value={formData.stock}
            onChange={handleInputChange}
            disabled={isLoading}
            min="0"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="text-sm font-medium text-foreground block mb-1">
          Categoría
        </label>
        <Input
          id="category"
          name="category"
          type="text"
          placeholder="ej: Mercancía, Tecnología, etc."
          value={formData.category}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      {/* Published Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <label htmlFor="published" className="text-sm font-medium text-foreground">
          Publicar Producto
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
        {productId ? 'Actualizar Producto' : 'Crear Producto'}
      </Button>
    </form>
  );
};

export default AdminProductForm;
