# AGENTS.md - Sistema de Gestión de Proyecto (Frontend)

## Project Overview
**Proyecto Radio Cesar** - Frontend React para plataforma de radio comunitaria.
**Workspace:** `/home/aprog93/Documents/workspace/proyecto-radio-cesar/community-stream-connect/`
**Stack:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + React Query

---

## 🎯 Sistema de Skills (Ingenieros Especializados)

El AGENTS.md actúa como **Project Manager (PM)** que delega tareas a los siguientes engineers especializados:

### ⚛️ Skill: `react-architecture`
**Especialista en:** Componentes, hooks, contexto, patrones React
- Componentes funcionales
- Custom hooks
- Context API (Player, Auth, Theme)
- React Query para server state

### 🎨 Skill: `ui-design`
**Especialista en:** shadcn/ui, Tailwind, diseño responsive
- Componentes UI
- Tailwind CSS
- Animaciones (framer-motion)
- Diseño responsive

### 🔌 Skill: `api-integration`
**Especialista en:** Integración con backend, Axios, fetch
- Cliente API (`lib/api.ts`)
- Tipos TypeScript
- Manejo de errores
- Autenticación JWT

### 🎵 Skill: `streaming`
**Especialista en:** Audio player, AzuraCast, streaming
- PlayerContext
- Audio HTML5 API
- Integración AzuraCast
- Estado del stream

### 🧪 Skill: `testing`
**Especialista en:** Vitest, Testing Library, Playwright
- Tests unitarios
- Tests de componentes
- E2E tests
- Mocks y fixtures

### 📱 Skill: `pwa`
**Especialista en:** PWA, Service Workers, offline
- Manifest.json
- Service Workers
- IndexedDB para caché
- Installability

### 🐳 Skill: `devops`
**Especialista en:** Docker, Nginx, despliegue
- Dockerfile
- Nginx config
- Variables de entorno
- CI/CD

---

## 📋 Áreas de Responsabilidad

| Área | Skill Asignado | Archivos Clave |
|------|---------------|----------------|
| Componentes UI | `ui-design` | `src/components/ui/*` |
| Páginas | `react-architecture` | `src/pages/*.tsx` |
| Contextos | `react-architecture` | `src/context/*` |
| API Client | `api-integration` | `src/lib/api.ts`, `backend-api.ts` |
| Streaming | `streaming` | `src/context/PlayerContext.tsx`, `lib/azuracast.ts` |
| Módulos AzuraCast | `streaming` | `src/modules/azuracast/*` |
| Tests unitarios | `testing` | `src/**/*.test.ts` |
| E2E tests | `testing` | `e2e/*.spec.ts` |
| Docker | `devops` | `Dockerfile`, `nginx.conf` |

---

## 🚀 Commands de Desarrollo

### Install dependencies
```bash
cd community-stream-connect && pnpm install
```

### Development
```bash
cd community-stream-connect && pnpm dev
# Vite dev server on http://localhost:5173
```

### Build
```bash
cd community-stream-connect && pnpm build
# Output: dist/ (ES2020, minified)
```

### Preview
```bash
cd community-stream-connect && pnpm preview
```

### Tests
```bash
cd community-stream-connect && pnpm test
# Unit tests with Vitest
cd community-stream-connect && pnpm test:e2e
# E2E tests with Playwright
```

### Lint
```bash
cd community-stream-connect && pnpm lint
# ESLint + TypeScript
```

### Docker
```bash
cd community-stream-connect && docker build -t radio-cesar-frontend .
docker run -d -p 80:80 radio-cesar-frontend
```

---

## 📐 Estructura de Código

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Layout.tsx       # Main layout
│   ├── Navbar.tsx       # Navigation
│   ├── Footer.tsx       # Footer
│   ├── PersistentPlayer.tsx  # Always visible player
│   └── admin/           # Admin components
├── context/
│   ├── PlayerContext.tsx   # Audio player state
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx   # Dark/light theme
├── pages/               # 30+ page components
├── modules/
│   ├── azuracast/      # AzuraCast integration
│   │   ├── api/        # API client
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Dashboard pages
│   │   ├── services/    # Business logic
│   │   └── types/      # TypeScript types
│   ├── auth/           # Auth module
│   └── blog/            # Blog module
├── lib/
│   ├── api.ts          # API client (main)
│   ├── backend-api.ts  # Backend BFF client
│   ├── azuracast.ts    # AzuraCast direct API
│   ├── utils.ts        # Utilities
│   └── lazy-routes.tsx # Lazy loading routes
├── hooks/              # Custom React hooks
├── integrations/
│   └── supabase/       # Supabase client
├── i18n/               # Internationalization
└── test/               # Test setup
```

---

## 🔗 Integración con Backend

### Endpoints del Backend Conectados

| Módulo | Endpoints | Estado |
|--------|-----------|--------|
| Auth | `/api/auth/register`, `/login`, `/logout`, `/me` | ✅ Conectado |
| Users | `/api/users/profile`, `/avatar` | ✅ Conectado |
| Blog | `/api/blogs` (CRUD) | ✅ Conectado |
| News | `/api/news` (CRUD) | ✅ Conectado |
| Events | `/api/events` (CRUD + register) | ✅ Conectado |
| Products | `/api/products` (CRUD) | ✅ Conectado |
| Admin | `/api/admin/users`, `/stats` | ✅ Conectado |
| Schedule | `/api/schedule` | ✅ Conectado |

### Endpoints AzuraCast (via Backend)

| Endpoint | Descripción | Estado Backend |
|----------|-------------|----------------|
| `/api/station/now-playing` | Ahora reproduciendo | ✅ Implementado |
| `/api/station/schedule` | Programación | ✅ Implementado |
| `/api/station/ondemand` | On-Demand | ✅ Implementado |
| `/api/station/podcasts` | Podcasts | ✅ Implementado |
| `/api/station/listeners` | Oyentes | ✅ Implementado |
| `/api/station/streamers` | DJs/Streamers | ✅ Implementado |
| `/api/station/requests` | Solicitar canción | ✅ Implementado |
| `/api/station/playlists` | Playlists | ✅ Implementado |

---

## 📱 PWA Configuration

- **Manifest:** `public/manifest.json`
- **Service Worker:** No configurado aún
- **Icons:** `public/icons/`

---

## 🧪 Estándares de Código

### React
- **Componentes:** Funcionales, no class components
- **Hooks:** useState, useEffect, useCallback, useMemo
- **Context:** Para estado global (Player, Auth, Theme)
- **React Query:** Para server state

### TypeScript
- **Strict mode:** Configurado
- **Sin `any`:** No se permite el tipo `any` en código fuente (excluyendo archivos de test)
- **Interfaces:** Para objetos (no prefix `I`)
- **Path aliases:** `@/` para imports

### Imports
```typescript
// External → Internal → Relative
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePlayer } from '@/context/PlayerContext';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
```

### Estilos
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes
- **framer-motion** para animaciones

---

## 🎯 Tareas Activas

### Fase 6: Integración Frontend-Backend
1. [ ] Conectar endpoints de AzuraCast desde backend
2. [ ] Actualizar PlayerContext para usar backend
3. [ ] Crear página de programación dinámica
4. [ ] Crear página de podcasts
5. [ ] Crear página de on-demand
6. [ ] Agregar componentes de estadísticas en vivo

---

## 📞 Uso del Sistema de Skills

Para delegar una tarea, especifica:
```
Skill requerido: [react-architecture|ui-design|api-integration|streaming|testing|pwa|devops]
Tarea: [descripción específica]
Prioridad: [high|medium|low]
```

Ejemplo:
```
@skill[streaming] Actualizar PlayerContext para obtener la URL del stream 
desde /api/station/now-playing en lugar de AzuraCast directo.
```

---

## 📖 Referencias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/)
- [AzuraCast API](https://www.azuracast.com/api/)
- [Playwright](https://playwright.dev/)

---

## 🔗 Endpoints del Backend

**URL Base:** `http://localhost:3000` (dev) / `https://radio-azura.orioncaribe.com` (prod)

**Swagger UI:** `/api/docs`
**OpenAPI JSON:** `/api/docs.json`
