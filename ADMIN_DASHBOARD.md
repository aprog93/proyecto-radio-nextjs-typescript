# 🎙️ Admin Dashboard - Documentación

## Estructura del Admin Dashboard

El nuevo Admin Dashboard ha sido rediseñado con una arquitectura profesional y modular.

### 📊 Componentes Principales

#### 1. **AdminLayout** (`AdminLayout.tsx`)
- Layout principal con sidebar y header
- Gestiona el estado del menú móvil
- Incluye validación de rol admin

#### 2. **AdminSidebar** (`AdminSidebar.tsx`)
- Navegación principal del admin
- Links a todas las secciones
- Responsive (colapsa en móvil)
- Botón de logout

#### 3. **AdminHeader** (`AdminHeader.tsx`)
- Título dinámico de la página
- Botones de acción
- Notificaciones (placeholder)
- Avatar del usuario

#### 4. **StatCard** (`StatCard.tsx`)
- Componente reutilizable para estadísticas
- 5 colores diferentes (amber, blue, green, red, purple)
- Soporte para trending indicators

#### 5. **AdminTable** (`AdminTable.tsx`)
- Tabla genérica y reutilizable
- Columnas configurables
- Render customizado por columna
- Soporte para clicks de fila

---

## 📑 Páginas Admin Disponibles

### 1. **Dashboard** (`/admin`)
**Ruta:** `/admin`

**Funciones:**
- Estadísticas generales del sistema
- Total de usuarios, activos, admins, oyentes
- Resumen de contenido (eventos, noticias, productos)
- Botones de acción rápida
- Panel de donaciones

**Componentes Usados:**
- AdminLayout
- StatCard (4 tarjetas principales)
- Panel de contenido con botones de acción

---

### 2. **Gestionar Eventos** (`/admin/events`)
**Ruta:** `/admin/events`

**Funciones:**
- Listar todos los eventos
- Filtrar por estado (Todos, Publicados, Borradores)
- Ver tabla con título, fecha, ubicación, estado
- Click para editar
- Botón para crear nuevo evento
- Eliminar eventos

**Estructura de Datos:**
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  published: boolean;
  createdAt: string;
}
```

---

### 3. **Gestionar Noticias** (`/admin/news`)
**Ruta:** `/admin/news`

**Funciones:**
- CRUD completo de noticias
- Filtros: Todas, Publicadas, Borradores
- Tabla con título, autor, estado, fecha
- Crear nueva noticia
- Editar y eliminar

**Estructura de Datos:**
```typescript
interface News {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  author?: string;
}
```

---

### 4. **Gestionar Productos** (`/admin/products`)
**Ruta:** `/admin/products`

**Funciones:**
- Gestión completa de tienda online
- Filtros: Todos, Publicados, Borradores
- Vista de imagen de producto
- Tabla con: nombre, precio, stock, estado
- Control de stock en tiempo real
- Crear nuevo producto

**Estructura de Datos:**
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  published: boolean;
  createdAt: string;
  image?: string;
}
```

---

### 5. **Gestionar Usuarios** (`/admin/users`)
**Ruta:** `/admin/users`

**Funciones:**
- Lista completa de usuarios
- Búsqueda en tiempo real (por nombre/email)
- Paginación (20 usuarios por página)
- Filtrar por rol (Admin, Oyente)
- Cambiar rol de usuario
- Cambiar estado (Activo, Inactivo)
- Crear nuevo usuario
- Eliminar usuario

**Estructura de Datos:**
```typescript
interface User {
  id: number;
  email: string;
  displayName: string;
  role: 'admin' | 'listener';
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}
```

---

### 6. **Gestionar Donaciones** (`/admin/donations`)
**Ruta:** `/admin/donations`

**Funciones:**
- Panel de donaciones
- Estadísticas (total, promedio, top donante)
- Filtrar por estado (Completada, Pendiente, Fallida)
- Tabla con donante, monto, método, estado
- Reportes (exportar próximamente)

**Estructura de Datos:**
```typescript
interface Donation {
  id: string;
  donorName: string;
  amount: number;
  paymentMethod: string;
  message?: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}
```

---

### 7. **Configuración** (`/admin/settings`)
**Ruta:** `/admin/settings`

**Secciones:**
- **General:** Nombre del sitio, email, tamaño de carga
- **Notificaciones:** Habilitar/deshabilitar emails
- **Mantenimiento:** Modo de mantenimiento
- **Seguridad:** Cambiar contraseña, 2FA
- **Base de Datos:** Backup, resetear BD
- **Tema:** Seleccionar tema visual

---

## 🔗 Flujo de Navegación

```
/admin (Dashboard)
├── /admin/events (Eventos)
├── /admin/news (Noticias)
├── /admin/products (Productos)
├── /admin/users (Usuarios)
├── /admin/donations (Donaciones)
└── /admin/settings (Configuración)
```

---

## 🎨 Colores y Estilos

### Colores Primarios
- **Amber:** Eventos y acciones primarias (#F59E0B)
- **Blue:** Noticias (#3B82F6)
- **Green:** Productos (#10B981)
- **Purple:** Usuarios (#A855F7)
- **Red:** Donaciones y alertas (#EF4444)

### Estructura de Cards
- Borde de 2px con color del tema
- Fondo semi-transparente (10%)
- Padding consistente (6 unidades)
- Iconos grandes en la esquina

---

## 📱 Responsividad

### Desktop
- Sidebar fijo a la izquierda
- Contenido principal flexible
- Tablas completas visible

### Mobile
- Sidebar deslizable (slide-out)
- Header con menú hamburguesa
- Tablas scrollables
- Botones apilados

---

## 🔐 Seguridad

### Validaciones
- ✅ Solo usuarios con `role === 'admin'` pueden acceder
- ✅ Redirección automática al home si no es admin
- ✅ Token JWT requerido en cada petición
- ✅ CORS configurado correctamente

---

## 💾 API Endpoints Conectados

| Página | Método | Endpoint | Descripción |
|--------|--------|----------|-------------|
| Dashboard | GET | `/admin/stats` | Obtener estadísticas |
| Eventos | GET | `/events` | Listar eventos |
| Eventos | POST | `/events` | Crear evento |
| Eventos | PUT | `/events/:id` | Editar evento |
| Eventos | DELETE | `/events/:id` | Eliminar evento |
| Noticias | GET | `/news` | Listar noticias |
| Noticias | POST | `/news` | Crear noticia |
| Productos | GET | `/products` | Listar productos |
| Productos | POST | `/products` | Crear producto |
| Usuarios | GET | `/admin/users` | Listar usuarios |
| Usuarios | POST | `/admin/users` | Crear usuario |
| Usuarios | PUT | `/admin/users/:id` | Editar usuario |
| Usuarios | DELETE | `/admin/users/:id` | Eliminar usuario |
| Donaciones | GET | `/donations` | Listar donaciones |

---

## 🚀 Próximas Mejoras

- [ ] Forms completos para crear/editar contenido
- [ ] Búsqueda avanzada con filtros
- [ ] Exportar datos a CSV/PDF
- [ ] Programación de publicaciones
- [ ] Editor de contenido enriquecido (Rich Editor)
- [ ] Gestión de permisos detallada
- [ ] Logs de auditoría
- [ ] Webhooks para integraciones

---

## 📚 Componentes Reutilizables Disponibles

```typescript
// Layout
import { AdminLayout, AdminSidebar, AdminHeader } from '@/components/admin';

// Stats
import { StatCard } from '@/components/admin';

// Tabla genérica
import { AdminTable, type TableColumn } from '@/components/admin';

// Usar:
const columns: TableColumn<MyData>[] = [
  { key: 'name', label: 'Nombre', width: '30%' },
  { key: 'status', label: 'Estado', render: (val) => <span>{val}</span> }
];

<AdminTable columns={columns} data={data} isLoading={loading} />
```

---

## 🔧 Desarrollo Local

### Iniciar Frontend
```bash
cd community-stream-connect
pnpm install
pnpm dev
```

### Acceder al Admin
1. Abrir `http://localhost:8082` (o el puerto que indique Vite)
2. Ir a `/admin` o iniciar sesión como admin
3. Credenciales: `admin@radiocesar.com` / `Admin1234!`

---

## ❓ Preguntas Frecuentes

### ¿Se puede integrar Strapi?
**Respuesta:** Sí, pero actualmente tu backend Express + Prisma es más eficiente. Puedes integrar Strapi como API separada si necesitas un CMS más robusto.

### ¿Cómo agregar un nuevo módulo?
1. Crear página en `src/pages/AdminXxxPage.tsx`
2. Crear componentes en `src/components/admin/` si necesitas
3. Agregar lazy import en `src/lib/lazy-routes.tsx`
4. Agregar ruta en `src/App.tsx`
5. Agregar link en `AdminSidebar.tsx`

### ¿Cómo personalizar colores?
Edita los colores en cada StatCard o AdminSidebar:
```typescript
<StatCard color="amber" ... /> // Cambia a "blue", "green", etc.
```

---

**Última actualización:** Mar 2, 2026  
**Estado:** ✅ Producción
