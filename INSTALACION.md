# 🚀 Guía Rápida de Instalación - Portal Uniremington

## ✅ Errores Corregidos

Los archivos que aparecían en rojo (con errores) **YA ESTÁN ARREGLADOS**:

| Archivo | Error que tenía | Estado |
|---------|----------------|--------|
| `eventos.component.ts` | Código duplicado y comentarios mal puestos en línea 112-116 | ✅ ARREGLADO |
| `evento.service.ts` | id de tipo `string` no compatible con `number` | ✅ ARREGLADO |
| `noticia.service.ts` | id de tipo `string` no compatible con `number` | ✅ ARREGLADO |
| `foro.service.ts` | id de tipo `string` no compatible con `number` | ✅ ARREGLADO |

**Verificación:** `npx ng build` ahora compila sin errores ✅

---

## 📊 Paso 1: Configurar la Base de Datos en phpMyAdmin

### 1.1 Abre phpMyAdmin
http://localhost/phpmyadmin

### 1.2 Selecciona `veterinaria_db` en el menú izquierdo

### 1.3 Click en la pestaña **"SQL"**

### 1.4 Copia y pega TODO el contenido del archivo:
```
database/instalar_bd_completa.sql
```

### 1.5 Click en **"Continuar"**

✅ Esto creará/actualizará las siguientes tablas:
- `usuarios` (con 4 usuarios: ADMIN, TEACHER, STUDENT, VETERINARIAN)
- `news` (3 noticias de ejemplo)
- `forum_topics` (3 temas de foro de ejemplo)
- `forum_replies` (tabla nueva para respuestas)
- `veterinary_journeys` (3 eventos de ejemplo)
- `mascotas`
- `historias_clinicas`

---

## 💻 Paso 2: Configurar el Frontend

### 2.1 Edita el archivo `src/environments/environment.ts`

Configura la URL de tu backend según el lenguaje que uses:

```typescript
// Si usas Spring Boot (Java):
apiUrl: 'http://localhost:8080/api'

// Si usas Node.js:
apiUrl: 'http://localhost:3000/api'

// Si usas PHP/Laravel:
apiUrl: 'http://localhost/api'

// Si usas FastAPI (Python):
apiUrl: 'http://localhost:8000/api'
```

---

## 🎯 Paso 3: Ejecutar el Frontend

```bash
cd frontend-angular

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm start
```

Abre el navegador en: **http://localhost:4200**

---

## 🔐 Paso 4: Probar el Login

En la página de login encontrarás 4 botones de demostración. Haz clic en cualquiera para auto-completar las credenciales:

| Botón | Email | Contraseña | Acceso |
|-------|-------|------------|--------|
| 🔴 **Administrador** | `admin@uniremington.edu.co` | `Admin2026*` | TODO |
| 🔵 **Docente** | `docente@uniremington.edu.co` | `Docente2026*` | Limitado |
| 🟢 **Estudiante** | `estudiante@uniremington.edu.co` | `Estudiante2026*` | Básico |
| 🟣 **Veterinario** | `veterinario@uniremington.edu.co` | `Vet2026*` | Veterinario |

---

## 🛠️ Endpoints del Backend que necesitas implementar

El frontend ya está listo. Solo necesitas que tu backend exponga estos endpoints:

### Autenticación
```
POST /api/auth/login         → Body: { email, password }  → Respuesta: { token, user }
POST /api/auth/register      → Body: { fullName, email, password }
POST /api/auth/forgot-password  → Body: { email }
```

### CRUD Usuarios
```
GET    /api/usuarios               → Listar todos
GET    /api/usuarios/{id}          → Obtener uno
POST   /api/usuarios               → Crear
PUT    /api/usuarios/{id}          → Actualizar
PATCH  /api/usuarios/{id}/estado   → Cambiar estado (activo/inactivo)
DELETE /api/usuarios/{id}          → Eliminar
```

### CRUD Otros (Docentes, Estudiantes, Eventos, Noticias, Foros)
```
GET    /api/{entidad}
GET    /api/{entidad}/{id}
POST   /api/{entidad}
PUT    /api/{entidad}/{id}
DELETE /api/{entidad}/{id}
```

Donde `{entidad}` puede ser: `docentes`, `estudiantes`, `eventos`, `noticias`, `foros`

### Foros - Respuestas
```
POST /api/foros/{id}/respuestas  → Body: { autor, contenido }
```

---

## 📐 Estructura del JWT

El backend debe devolver un JWT con la siguiente estructura mínima en el payload:

```json
{
  "sub": "admin-uniremington-2026",
  "email": "admin@uniremington.edu.co",
  "fullName": "Administrador Principal",
  "role": "ADMIN",
  "exp": 1234567890
}
```

⚠️ **CRÍTICO:** El campo `role` DEBE estar presente con uno de estos valores:
- `ADMIN`
- `TEACHER`
- `STUDENT`
- `VETERINARIAN`
- `USER`

---

## 🐛 ¿Algo falla?

### Si el login no funciona:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Intenta iniciar sesión
4. Revisa la solicitud `/api/auth/login`:
   - **¿Status 404?** → El backend no está corriendo o la URL es incorrecta
   - **¿Status 401?** → Credenciales incorrectas
   - **¿Status 500?** → Error en el backend (revisa los logs)
   - **¿No aparece?** → Verifica `environment.ts`

### Si los datos no cargan:
- Revisa que el token JWT contenga el campo `role`
- Revisa la consola del navegador por errores de CORS
- El backend debe permitir CORS desde `http://localhost:4200`

### Si ves "Cannot find module":
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✨ Próximo paso recomendado

Crear el backend en el lenguaje de tu preferencia que:
1. Lea/escriba de la BD `veterinaria_db`
2. Implemente JWT con el campo `role`
3. Exponga los endpoints listados arriba
4. Habilite CORS para `http://localhost:4200`

¿Necesitas ayuda con el backend? ¡Pregúntame qué lenguaje quieres usar! (Spring Boot, Node.js, FastAPI, etc.)
