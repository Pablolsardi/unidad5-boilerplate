# MedPortal — Frontend (DSW 2026, Unidad 5)

Frontend del TPI de gestión de turnos médicos. React 19 + Vite + Tailwind CSS 4 + React Router + React Hook Form + Axios.

Backend: [Pablolsardi/dsw2026-tpi](https://github.com/Pablolsardi/dsw2026-tpi) (rama `development`).

## Requisitos

- Node.js 20.19 o superior
- Backend corriendo en `http://localhost:5278` (ver su README)

## Configuración

1. Copiar `.env.example` como `.env.development` (el repo ya incluye uno con el valor por defecto).
2. Si el backend corre en otro puerto, ajustar `VITE_BACKEND_URL`.

El front llama a la API con rutas relativas (`/api/...`) y Vite las reenvía al backend mediante el proxy configurado en `vite.config.js`, así que no hace falta configurar CORS.

## Instalación y ejecución

```bash
npm install
npm run dev        # http://localhost:5173
```

Otros scripts:

```bash
npm run lint           # ESLint
npm run format:check   # Prettier (solo verifica)
npm run format         # Prettier (corrige)
npm run build          # build de producción en dist/
```

## Usuarios de prueba

| Rol           | Dónde          | Credenciales                                                                        |
| ------------- | -------------- | ----------------------------------------------------------------------------------- |
| Administrador | `/admin/login` | `admin@system.com` / `Admin1234!`                                                   |
| Paciente      | `/login`       | Cualquier email + DNI de 7 u 8 dígitos (se registra automáticamente la primera vez) |

## Estructura (Screaming Architecture)

```
src/modules/
  auth/          contexto de sesión, useAuth, ProtectedRoute (allowedRoles), login admin
  patients/      login de paciente, reservar turno, mis turnos
  appointments/  búsqueda de citas (admin)
  doctors/       médicos y disponibilidad
  specialties/   especialidades
  dashboard/     layout y panel del admin
  shared/        componentes reutilizables, cliente HTTP (axios) y helpers
```

## Integrantes

- López Roldán, Fabrizzio Javier - 56450 - 3K4
- López Sardi, Pablo - 56037 - 3K3
- Luna Mendoza, Diego Elías - 56142 - 3K3
