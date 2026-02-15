# NestJS Backend Template

Plantilla base para la construcción de **APIs REST con NestJS**, orientada a proyectos backend CRUD, siguiendo una **arquitectura modular**, separación de capas y buenas prácticas para escalabilidad y mantenimiento.

Este repositorio está diseñado como **template reutilizable** para nuevos proyectos backend.

---

## Propósito del proyecto

Este proyecto sirve como punto de partida para desarrollar APIs que:

- Expongan recursos RESTful
- Implementen operaciones CRUD
- Manejen relaciones entre entidades
- Utilicen validación de datos, interceptores y manejo centralizado de errores
- Usen una base de datos relacional con ORM

La estructura y reglas del proyecto están pensadas para facilitar:
- Desarrollo en equipo
- Consistencia arquitectónica
- Escalabilidad del código
- Uso educativo o productivo

---

## Arquitectura

La aplicación sigue una **arquitectura por módulos**, donde cada recurso del API define:

- Un **módulo**
- Una **entidad de dominio**
- Un **servicio**
- Un **controlador**
- Sus **DTOs**
- (Opcional) servicios y controladores de asociaciones

Capas principales:

Controller → Service → Repository → Database

Separación estricta de responsabilidades:

- Controllers: manejo de HTTP y validación
- Services: lógica de negocio
- Entities: modelo de persistencia
- DTOs: transporte y validación de datos

---

## Estructura del proyecto

```text
src/
├── shared/
│ ├── errors/
│ ├── interceptors/
│ └── testing-utils/
├── <resource>/
│ ├── <resource>.controller.ts
│ ├── <resource>.service.ts
│ ├── <resource>.entity.ts
│ ├── <resource>.dto.ts
│ └── <resource>.module.ts
├── app.module.ts
└── main.ts
```
---

## 🗄️ Base de datos

- **Motor:** PostgreSQL
- **Modo:** Local
- **ORM:** TypeORM

La aplicación asume una base de datos PostgreSQL corriendo localmente (por ejemplo vía Docker o instalación local).

### Configuración típica

Las credenciales se definen mediante variables de entorno:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_db


> ⚠️ Este proyecto **no incluye conexión a bases de datos en la nube** por defecto.

---

## ORM y persistencia

- Todas las entidades usan **TypeORM**
- Las relaciones están explícitamente definidas (`OneToMany`, `ManyToOne`, etc.)
- El acceso a base de datos ocurre únicamente desde servicios
- Los repositorios se inyectan mediante `@InjectRepository`

---

## Manejo de errores

- La lógica de negocio lanza **errores de dominio**
- Un **interceptor global** traduce estos errores a códigos HTTP
- Los controladores no manejan errores manualmente

Errores soportados:
- `404 NOT_FOUND`
- `412 PRECONDITION_FAILED`
- `400 BAD_REQUEST`

---

## Validación y transformación

- Validación de entrada mediante **class-validator**
- Transformación DTO → Entity mediante **class-transformer**
- Validación activada globalmente con `ValidationPipe`

---

## Instalación y ejecución

### 1 Clonar el repositorio
```bash
git clone <repo-url>
cd nestjs-backend-template
```
### 2 Instalar dependencias y ejecutar

```bash
npm install
npm run start:dev
```

## Pruebas

El proyecto incluye **pruebas unitarias enfocadas en la capa de servicios**, con el objetivo de validar la lógica de negocio de forma aislada.

Características del entorno de pruebas:

- Los **servicios cuentan con pruebas unitarias** dedicadas.
- Se utiliza una **base de datos en memoria** para la ejecución de los tests.
- Cada prueba se ejecuta de forma **aislada**, asegurando independencia entre casos.
- El estado de la base de datos se **limpia antes de cada prueba** para evitar efectos colaterales.
