# 🐾 VetClinic — Sistema de Gestión Veterinaria

Sistema full-stack de gestión veterinaria desarrollado como proyecto final grupal para el curso de Programación Web — ITM 2026.

## 👥 Integrantes

| Nombre | Rol |
|--------|-----|
| Kasandra Pimienta | Estudiante de Diseño de software


## 🛠️ Tecnologías

**Backend**
- .NET 8 Web API
- Entity Framework Core 8 (Code-First)
- SQL Server (SQLEXPRESS)
- AutoMapper 13
- Swagger / OpenAPI

**Frontend**
- Angular 21
- Angular Material (Material 3)
- TypeScript

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server Express](https://www.microsoft.com/es-es/sql-server/sql-server-downloads)
- [Node.js 20+](https://nodejs.org/)
- [Angular CLI 21](https://angular.io/cli): `npm install -g @angular/cli`

---

## 🚀 Instrucciones de Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/ksandra-04/VetClinic.git
cd VetClinic
```

---

### 2. Configurar y ejecutar el Backend

#### 2.1 Verificar la cadena de conexión

Abre `VetClinic.API/appsettings.json` y verifica que la cadena de conexión apunte a tu instancia de SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=VetClinicDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

> Si usas una instancia con nombre diferente, cambia `.\SQLEXPRESS` por el nombre de tu instancia.

#### 2.2 Aplicar migraciones y ejecutar

Abre la solución `VetClinic.sln` en Visual Studio 2022 y ejecuta el proyecto `VetClinic.API` (F5).

La aplicación automáticamente:
- Aplica las migraciones de EF Core
- Ejecuta el DataSeeder con datos de prueba

O desde la terminal:

```bash
cd VetClinic.API
dotnet run
```

#### 2.3 Verificar que el backend está corriendo

Abre Swagger en el navegador:
```
http://localhost:5065/swagger/index.html
```

Deberías ver todos los endpoints documentados y funcionales.

---

### 3. Configurar y ejecutar el Frontend

```bash
cd vetclinic-frontend
npm install
ng serve
```

Abre el navegador en:
```
http://localhost:4200
```

> El frontend consume el API en `http://localhost:5065`. Si el backend corre en un puerto diferente, actualiza la variable `apiUrl` en los servicios dentro de `src/app/core/services/`.

---

## 📦 Datos de Prueba (DataSeeder)

Al iniciar el backend por primera vez, se crean automáticamente:

| Entidad | Cantidad |
|---------|----------|
| Dueños | 5 (nombres colombianos, Medellín) |
| Mascotas | 10 (2 por dueño, tipos variados) |
| Veterinarios | 4 (especialidades distintas) |
| Citas | 6 (estados: Scheduled, InProgress, Completed) |
| Registros Médicos | 3 (para citas completadas) |

---

## 🗂️ Estructura del Proyecto

```
VetClinic/
├── VetClinic.sln
├── VetClinic.Domain/          ← Entidades, Enums, Interfaces, Services
├── VetClinic.DataAccess/      ← DbContext, Repositories, Migrations, Seeder
└── VetClinic.API/             ← Controllers, DTOs, AutoMapper, Program.cs

vetclinic-frontend/
└── src/app/
    ├── core/services/         ← Servicios HTTP (owner, pet, vet, appointment)
    ├── pages/                 ← Vistas (owners, pets, veterinarians, appointments)
    ├── shared/navbar/         ← Barra de navegación
    ├── app.routes.ts
    └── app.config.ts
```

---

## 🔗 Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/Owner | Listar dueños |
| POST | /api/Owner | Crear dueño |
| PUT | /api/Owner/{id} | Actualizar dueño |
| DELETE | /api/Owner/{id} | Eliminar dueño |
| GET | /api/Pet | Listar mascotas |
| POST | /api/Pet | Crear mascota |
| GET | /api/Veterinarian | Listar veterinarios |
| POST | /api/Veterinarian | Crear veterinario |
| GET | /api/Appointment | Listar citas |
| POST | /api/Appointment | Crear cita |
| PATCH | /api/Appointment/{id}/status | Cambiar estado de cita |

---

## 📐 Modelo de Datos

```
Owner (1) ──── (N) Pet
Pet   (N) ──── (N) Veterinarian   [a través de Appointment]
Appointment (1) ── (1) MedicalRecord
```

### Enums

**PetType:** `Dog=0, Cat=1, Bird=2, Rabbit=3, Other=4`

**AppointmentStatus:** `Scheduled=0, InProgress=1, Completed=2, Cancelled=3`

### Máquina de estados de citas
```
Scheduled → InProgress  (iniciar)
InProgress → Completed  (completar)
Scheduled/InProgress → Cancelled  (cancelar)
```

---

## ✅ Patrones Implementados

- Arquitectura por capas (Domain / DataAccess / API)
- Repository Pattern (GenericRepository + repositorios específicos)
- Services con validaciones de negocio
- DTOs + AutoMapper (no se exponen entidades)
- Máquina de estados (AppointmentStatus)
- Tabla intermedia explícita N:M (Appointment)
- DeleteBehavior.Restrict para evitar cascadas
- DataSeeder con ejecución condicional
- CORS configurado para Angular (localhost:4200)
- Swagger funcional

## 🔐 Credenciales de acceso
| Usuario | Contraseña |
|---------|-----------|
| admin   | vet2026   |