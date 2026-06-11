# 🎓 Portal Uniremington - Sistema de Gestión Institucional

Sistema web completo en **Angular 21** con componentes standalone para la gestión del programa "Uniremington al Parque".

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm start  # → http://localhost:4200

# 3. Importar Base de Datos
mysql -u root -p < database/veterinaria_db.sql
mysql -u root -p veterinaria_db < database/admin_seed.sql
```

---

## 🔐 Credenciales de Prueba

> 📄 Ver detalles completos en [`database/CREDENCIALES.md`](./database/CREDENCIALES.md)

| Rol | Email | Contraseña |
|-----|-------|------------|
| 🔴 **ADMIN** | `admin@uniremington.edu.co` | `Admin2026*` |
| 🔵 **TEACHER** | `docente@uniremington.edu.co` | `Docente2026*` |
| 🟢 **STUDENT** | `estudiante@uniremington.edu.co` | `Estudiante2026*` |
| 🟣 **VETERINARIAN** | `veterinario@uniremington.edu.co` | `Vet2026*` |

💡 **Tip:** En la página de login hay botones de demo para cargar las credenciales con un clic.

---

## 📂 Arquitectura del Proyecto

```
src/app/
├── auth/                    # Login, Registro, Recuperar Password
├── core/
│   ├── guards/             # auth.guard.ts + role.guard.ts
│   ├── interceptors/       # JWT Interceptor
│   ├── models/             # 7 modelos TypeScript
│   └── services/           # 7 servicios HTTP (estructura plana)
├── pages/                   # 7 páginas standalone
│   ├── usuarios/           # CRUD - Solo ADMIN
│   ├── docentes/           # CRUD - ADMIN/TEACHER
│   ├── estudiantes/        # CRUD - ADMIN/TEACHER
│   ├── eventos/            # CRUD jornadas
│   ├── noticias/           # CRUD (sin facultades)
│   ├── foros/              # Sistema de tópicos
│   └── perfil/             # Datos del usuario
├── dashboard/              # Inicio con info institucional
├── layout/                 # Sidebar dinámico + Footer
└── shared/                 # Componentes compartidos
database/
├── veterinaria_db.sql      # Esquema de la BD
├── admin_seed.sql          # Usuarios iniciales (admin, docente, etc)
└── CREDENCIALES.md         # Documentación de accesos
```

---

## 🎨 Diseño por Rol

El sistema **muestra/oculta** opciones del sidebar y secciones del dashboard según el rol:

| Sección | ADMIN | TEACHER | STUDENT | VETERINARIAN | Sin Login |
|---------|:-----:|:-------:|:-------:|:------------:|:---------:|
| Inicio | ✅ + 📊 | ✅ | ✅ | ✅ | ✅ |
| Usuarios | ✅ CRUD | ❌ | ❌ | ❌ | ❌ |
| Docentes | ✅ CRUD | ✅ Ver | ❌ | ❌ | ❌ |
| Estudiantes | ✅ CRUD | ✅ Ver | ❌ | ❌ | ❌ |
| Eventos | ✅ CRUD | ✅ | ✅ | ✅ | ❌ |
| Noticias | ✅ CRUD | ✅ Crear | ✅ Ver | ✅ Ver | ✅ Ver |
| Foros | ✅ | ✅ | ✅ | ✅ | ✅ Ver |
| Perfil | ✅ | ✅ | ✅ | ✅ | ❌ |

**Reportes Gráficos** (📊): Solo visibles en Dashboard para `ADMIN`

---

## 🔧 Configuración del Backend

El frontend espera estos endpoints en el backend:

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`

### CRUD Genérico (todas las entidades)
- `GET    /api/{entity}` - Listar
- `GET    /api/{entity}/:id` - Obtener
- `POST   /api/{entity}` - Crear
- `PUT    /api/{entity}/:id` - Actualizar
- `DELETE /api/{entity}/:id` - Eliminar
- `PATCH  /api/usuarios/:id/estado` - Cambiar estado

Entidades: `usuarios`, `docentes`, `estudiantes`, `eventos`, `noticias`, `foros`

---

## 🔑 Estructura JWT Esperada

El JWT debe contener (al menos):

```json
{
  "sub": "user-uuid",
  "email": "user@uniremington.edu.co",
  "fullName": "Nombre Completo",
  "role": "ADMIN",
  "exp": 1234567890
}
```

**Roles válidos:** `ADMIN`, `TEACHER`, `STUDENT`, `VETERINARIAN`, `USER`

---

## ✨ Características Implementadas

### ✅ Autenticación y Autorización
- Login con JWT
- Descifrado automático del JWT para extraer rol
- Guards de rutas (`authGuard` + `roleGuard`)
- Almacenamiento seguro de token

### ✅ Sidebar Dinámico
- 8 opciones de menú con íconos Material
- Muestra/oculta opciones según rol
- Avatar con ícono según rol
- Badge de color por rol
- Botón de logout

### ✅ Dashboard Inteligente
- Mensaje de bienvenida personalizado
- Información institucional
- Accesos rápidos por rol
- Estadísticas globales
- Gráficos para ADMIN (Chart.js)

### ✅ CRUD Completos
- 7 páginas con formularios reactivos
- Validaciones FormBuilder + Validators
- Tablas con Angular Material
- Tarjetas para vistas visuales
- Snackbar para feedback

### ✅ Diseño Moderno
- Iconos de Material Icons en todos los componentes
- Tema con colores consistentes
- Gradientes y sombras
- Responsive
- Animaciones suaves

---

## 📦 Build de Producción

```bash
npm run build
# → Salida en dist/
```

---

## 🛠️ Tecnologías

- Angular 21.2
- Angular Material
- TypeScript 5.9
- RxJS
- Chart.js + ng2-charts
- SCSS

---

## 📅 Última Actualización

Enero 2026

---

¡El proyecto está listo para producción! 🚀
