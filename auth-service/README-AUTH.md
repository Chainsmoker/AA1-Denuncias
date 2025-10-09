# Auth Service - Servicio de Autenticación con Supabase

Este servicio maneja la autenticación de usuarios utilizando Supabase como base de datos y el servicio RENIEC para obtener información de usuarios por DNI.

## Características

- **Registro de usuarios**: Validación de DNI con RENIEC y registro en Supabase
- **Login de usuarios**: Autenticación con DNI y contraseña
- **Actualización de perfil**: Permite cambiar nombres y apellidos después del registro
- **Validación de datos**: Usando class-validator para DTOs
- **Seguridad**: Contraseñas hasheadas con bcrypt
- **Arquitectura híbrida**: Soporta tanto REST API como microservicios TCP

## Configuración

### 1. Variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

### 2. Configuración de Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Obtener la URL del proyecto y la clave anónima
3. Ejecutar el script SQL en `database/schema.sql` en el SQL Editor de Supabase
4. Configurar las variables en `.env`:
   - `SUPABASE_URL`: URL de tu proyecto Supabase
   - `SUPABASE_ANON_KEY`: Clave anónima de Supabase

### 3. Instalación de dependencias

```bash
pnpm install
```

## Esquema de Base de Datos

La tabla `users` contiene:

- `id`: UUID (Primary Key)
- `dni`: VARCHAR(8) (Unique) - Documento Nacional de Identidad
- `email`: VARCHAR(255) (Unique) - Correo electrónico
- `password`: VARCHAR(255) - Contraseña hasheada
- `nombres`: VARCHAR(255) - Nombres obtenidos de RENIEC
- `apellidos`: VARCHAR(255) - Apellidos obtenidos de RENIEC
- `created_at`: TIMESTAMPTZ - Fecha de creación
- `updated_at`: TIMESTAMPTZ - Fecha de última actualización

## Endpoints

### REST API (HTTP)

**Base URL**: `http://localhost:3001`

#### Registro de usuario
```http
POST /auth/register
Content-Type: application/json

{
  "dni": "12345678",
  "email": "usuario@example.com",
  "password": "mipassword123",
  "confirmPassword": "mipassword123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "dni": "12345678",
  "password": "mipassword123"
}
```

#### Actualizar perfil
```http
PUT /auth/profile/{userId}
Content-Type: application/json

{
  "nombres": "Nuevo Nombre",
  "apellidos": "Nuevo Apellido"
}
```

#### Obtener información de usuario por DNI
```http
POST /auth/user-info
Content-Type: application/json

{
  "dni": "12345678"
}
```

#### Obtener usuario por ID
```http
GET /auth/user/{userId}
```

### Microservicios (TCP)

Los mismos endpoints están disponibles como patrones de mensajes:

- `{ cmd: 'register' }` - Registro de usuario
- `{ cmd: 'login' }` - Login de usuario
- `{ cmd: 'update_profile' }` - Actualizar perfil
- `{ cmd: 'get_user_info' }` - Obtener info por DNI
- `{ cmd: 'get_user_by_id' }` - Obtener usuario por ID

## Estructura del Proyecto

```
src/
├── config/
│   └── supabase.config.ts     # Configuración del cliente Supabase
├── dto/
│   └── user.dto.ts            # DTOs para validación
├── utils/
│   └── reniec.ts              # Utilidad para consultar RENIEC
├── auth.controller.ts         # Controlador con endpoints REST y microservicios
├── auth.service.ts            # Lógica de negocio
├── app.module.ts              # Módulo principal
└── main.ts                    # Punto de entrada de la aplicación
```

## Flujo de Registro

1. Usuario envía DNI, email, password y confirmPassword
2. Se valida que las contraseñas coincidan
3. Se verifica que el DNI y email no estén registrados
4. Se consulta RENIEC para obtener nombres y apellidos
5. Se hashea la contraseña con bcrypt
6. Se crea el usuario en Supabase
7. Se retorna la información del usuario creado

## Flujo de Login

1. Usuario envía DNI y password
2. Se busca el usuario por DNI en Supabase
3. Se verifica la contraseña usando bcrypt
4. Se actualiza la fecha de último acceso
5. Se retorna la información del usuario

## Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Validación de datos de entrada con class-validator
- Row Level Security (RLS) habilitado en Supabase
- CORS habilitado para requests del frontend

## Desarrollo

### Ejecutar en modo desarrollo
```bash
pnpm run start:dev
```

### Ejecutar tests
```bash
pnpm run test
```

### Build para producción
```bash
pnpm run build
```

## Dependencias Principales

- `@nestjs/core` - Framework base
- `@supabase/supabase-js` - Cliente de Supabase
- `bcrypt` - Hash de contraseñas
- `class-validator` - Validación de DTOs
- `class-transformer` - Transformación de datos
- `dotenv` - Variables de entorno

## Notas Importantes

1. Asegúrate de ejecutar el script SQL en Supabase antes de usar el servicio
2. El servicio RENIEC debe estar configurado y funcionando
3. Este servicio funciona tanto como REST API como microservicio TCP
4. Los nombres y apellidos se obtienen automáticamente del DNI durante el registro
5. Los usuarios pueden actualizar sus nombres y apellidos después del registro