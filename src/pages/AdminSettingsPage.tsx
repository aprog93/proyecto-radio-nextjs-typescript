import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Lock, Palette, Database, Mail, Shield } from 'lucide-react';
import { AdminLayout } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Radio Comunitaria Cesar',
    siteEmail: 'admin@radiocesar.com',
    notificationsEnabled: true,
    maintenanceMode: false,
    maxUploadSize: 10,
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Configuración guardada correctamente');
    } catch (err) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Está seguro de que desea resetear toda la base de datos?')) {
      toast.warning('Esta acción no se puede deshacer');
    }
  };

  return (
    <AdminLayout
      title="Configuración"
      subtitle="Configuraciones del sistema y preferencias"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/15 dark:bg-blue-500/20 rounded-lg">
                <Mail size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Configuración General</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre del Sitio
                </label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email de Contacto
                </label>
                <Input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, siteEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tamaño Máximo de Carga (MB)
                </label>
                <Input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxUploadSize: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/15 dark:bg-amber-500/20 rounded-lg">
                <Bell size={20} className="text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Notificaciones</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-foreground">
                  Habilitar notificaciones por email
                </span>
              </label>
              <p className="text-xs text-muted-foreground">
                Recibirás notificaciones de nuevos registros de usuarios y donaciones.
              </p>
            </div>
          </div>

          {/* Maintenance */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/15 dark:bg-red-500/20 rounded-lg">
                <Shield size={20} className="text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Mantenimiento</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-foreground">
                  Modo de mantenimiento (desactiva el sitio temporalmente)
                </span>
              </label>
              <p className="text-xs text-muted-foreground">
                Cuando esté activo, los visitantes verán una página de
                mantenimiento.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={20} className="text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Seguridad</h3>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                🔑 Cambiar Contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🔐 Dos Factores
              </Button>
            </div>
          </div>

          {/* Database */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Base de Datos</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-sm">
                💾 Backup
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start text-sm"
                onClick={handleReset}
              >
                🗑️ Resetear BD
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ⚠️ Estas acciones son permanentes.
            </p>
          </div>

          {/* Theme */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette size={20} className="text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Tema</h3>
            </div>
            <div className="space-y-2">
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground">
                <option>Claro (Light)</option>
                <option>Oscuro (Dark)</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {saving ? '⏳ Guardando...' : '✅ Guardar Cambios'}
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          🔄 Cancelar
        </Button>
      </div>
    </AdminLayout>
  );
}
