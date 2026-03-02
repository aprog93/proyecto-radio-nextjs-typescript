import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Shield, User } from 'lucide-react';
import { AdminLayout, AdminTable, TableColumn } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  displayName: string;
  role: 'admin' | 'listener';
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          search: search || undefined,
        },
      });
      if (response.success && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : response.data.data || []);
        setTotal(response.data.total || response.total || 0);
      }
    } catch (err) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Usuario eliminado');
      fetchUsers();
    } catch (err) {
      toast.error('Error al eliminar usuario');
    }
  };

  const handleToggleRole = async (userId: number, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'listener' : 'admin';
      await api.put(`/admin/users/${userId}`, { role: newRole });
      toast.success(`Rol actualizado a ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Error al actualizar rol');
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'displayName',
      label: 'Usuario',
      width: '30%',
      render: (name, user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={name as string}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
              <User size={16} className="text-slate-600" />
            </div>
          )}
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (role) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
            role === 'admin'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <Shield size={14} />
          {role === 'admin' ? 'Administrador' : 'Oyente'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (isActive) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Creado',
      render: (date) => new Date(date as string).toLocaleDateString('es-ES'),
    },
  ];

  return (
    <AdminLayout
      title="Gestionar Usuarios"
      subtitle="Control de usuarios y asignación de roles"
      actions={
        <Button
          onClick={() => navigate('/admin/users/create')}
          className="gap-2 bg-purple-500 hover:bg-purple-600"
        >
          <Plus size={18} />
          Nuevo Usuario
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden">
        <AdminTable
          columns={columns}
          data={users}
          isLoading={loading}
          emptyMessage="No hay usuarios"
        />

        {/* Pagination */}
        {total > ITEMS_PER_PAGE && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1} a{' '}
              {Math.min(page * ITEMS_PER_PAGE, total)} de {total} usuarios
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage(
                    Math.min(Math.ceil(total / ITEMS_PER_PAGE), page + 1)
                  )
                }
                disabled={page * ITEMS_PER_PAGE >= total}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Acciones Rápidas</h3>
        <div className="space-y-2">
          {users.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-white p-3 rounded-lg"
            >
              <div>
                <p className="font-medium text-slate-900">{user.displayName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleRole(user.id, user.role)}
                >
                  Cambiar Rol
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
