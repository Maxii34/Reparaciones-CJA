# 🔧 Sistema de Reparación — API

> API REST para la gestión integral de un taller de reparación de electrodomésticos: clientes, equipos, órdenes de reparación con máquina de estados, repuestos, pagos, garantías y evidencia fotográfica.

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)


## 📖 Descripción

**Sistema de Reparación** es el backend de un sistema de gestión para talleres (línea blanca, TV, electrónica). Digitaliza la clásica *ficha de recepción en papel* (puntos 3-A, 3-B y 5):

- Registra **clientes y sus equipos** (tipo, marca, modelo, N° serie).
- Crea **órdenes de reparación** numeradas (`OR-0001`) con falla reportada, condición física de ingreso, accesorios y firmas de conformidad.
- Gestiona el ciclo de vida con **máquina de estados validada**: diagnóstico → autorización del cliente → reparación → cierre/entrega.
- Controla **repuestos y stock**, **pagos parciales/totales** por múltiples medios y **garantías de 90 días** con reingresos vinculados.
- Guarda **fotos de evidencia** (recepción, diagnóstico, entrega) en Cloudinary.
- Traza todo con **historial de estados** y auditoría de usuarios.
- Autenticación con **JWT + Refresh Tokens** y roles `ADMIN` / `TECNICO`.

## 👤 Autor

**Maximiliano Ordoñez**

- GitHub: [@Maxii34](https://github.com/Maxii34)
- Repositorio: [Reparaciones-CJA](https://github.com/Maxii34/Reparaciones-CJA)
- Proyecto: `sistema-reparacion` v1.0.0

## 🛠️ Stack y Tecnologías

### Core

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

### Auth, Validación y Uploads

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcryptjs-003A70?style=for-the-badge)
![Multer](https://img.shields.io/badge/Multer-FF6600?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### Utilidades y Dev

![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![CORS](https://img.shields.io/badge/CORS-7A0945?style=for-the-badge)
![Morgan](https://img.shields.io/badge/Morgan-68A063?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TSX](https://img.shields.io/badge/TSX-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

| Categoría | Tecnología | Versión | Uso |
|---|---|---|---|
| Lenguaje | TypeScript | ^7.0.2 | Tipado estático del proyecto |
| Runtime / Server | Node.js + Express | Express ^5.2.1 | Servidor HTTP y routing |
| ORM | Prisma ORM | ^7.10.0 | Modelado y acceso a datos |
| DB | PostgreSQL (`pg` + `@prisma/adapter-pg`) | pg ^8.23.0 | Base de datos relacional |
| Auth | `jsonwebtoken` + `bcryptjs` | jwt ^9.0.3 / bcryptjs ^3.0.3 | Login, hash de passwords, access + refresh tokens |
| Validación | `zod` | ^4.6.5 | Schemas de validación por endpoint |
| Uploads | `multer` + `cloudinary` | multer ^2.4.0 / cloudinary ^2.11.0 | Subida de fotos de evidencia (1 a 5 por request) |
| Middlewares | `cors`, `morgan`, `express.json` | — | CORS, logging dev, parse JSON |
| Config | `dotenv` | ^17.4.2 | Variables de entorno |
| Dev / Test | `tsx`, `vitest`, `@types/*` | — | Hot-reload en dev y tests |

## ✨ Características principales

- [x] **Usuarios y Roles**: `ADMIN` / `TECNICO`, login, refresh/logout con revocación, CRUD solo-admin.
- [x] **Clientes**: alta, baja lógica (`activo`), DNI/email únicos, búsqueda por equipo.
- [x] **Equipos**: vinculados a cliente, con tipo/marca/modelo/serie/observaciones.
- [x] **Órdenes**: número único visible (`OR-XXXX`), falla, accesorios, condición física (checkbox múltiple), diagnóstico, presupuesto, autorización, reparación, precio final, entrega y firmas.
- [x] **Fases con validación de transición**: `diagnostico`, `autorizacion`, `reparacion`, `cierre`.
- [x] **Garantía**: 90 días por defecto, flag `esGarantia` + vínculo `ordenOrigenId`, bloqueo si hay orden abierta.
- [x] **Repuestos**: stock, costo y precio de venta; detalle `RepuestoUsado` con costo/precio congelado al momento de uso.
- [x] **Pagos**: parciales, medios (`EFECTIVO`, `TRANSFERENCIA`, `TARJETA_*`, `MERCADO_PAGO`, `OTRO`), estado `PENDIENTE` / `PARCIAL` / `PAGADO`.
- [x] **Fotos**: Multer en memoria → Cloudinary firmado, límite 2MB, tipos validados, error 502 amable con log.
- [x] **Historial**: trazabilidad completa de cambios de estado con usuario y comentario.
- [x] **Errores**: handler global JSON `{ ok: false, mensaje }` + 400 para errores de subida.

## 🏗️ Arquitectura y Estructura

Arquitectura en capas: `routes → middlewares → controllers → service/repositores → prisma`.

```text
src/
├── index.ts              # Bootstrap: dotenv + listen PORT
├── app.ts                # Express app, CORS, morgan, rutas /api/*, errorHandler
├── config/
│   ├── prisma.ts         # Cliente Prisma + adapter pg
│   └── cloudinary.ts     # Config Cloudinary firmado
├── routes/               # 8 routers: usuario, cliente, equipo, orden-reparacion,
│                         # historial-estado-orden, repuesto, pago, repuesto-usado
├── controllers/          # Lógica HTTP por recurso
├── service/              # Reglas de negocio (máquina de estados, garantía, pagos)
├── repositores/          # Acceso a datos Prisma
├── middlewares/
│   ├── auth.middleware.ts# verificarToken, esAdmin
│   ├── validate.ts       # Validación Zod
│   ├── upload.ts         # Multer (memoria, 2MB, MAX_FOTOS_POR_ORDEN)
│   └── errorHandler.ts   # Handler global de errores
├── validators/           # Schemas Zod por recurso (8 archivos)
├── utils/                # Helpers
└── generated/prisma/     # Cliente Prisma generado (output custom)
prisma/
├── schema.prisma         # 10 modelos + 4 enums
└── migrations/           # Migraciones SQL
```

## 🗄️ Modelo de Datos

**PostgreSQL + Prisma 7** — 10 modelos:

| Modelo | Descripción |
|---|---|
| `Usuario` | `nombre, email(unique), passwordHash, rol, activo` + relaciones a órdenes, pagos, historial, refreshTokens |
| `RefreshToken` | `token(unique), usuarioId, expiraEn, revocado` |
| `Cliente` | `nombre, apellido, dni(unique), telefono, whatsapp, email(unique), direccion, activo` |
| `Equipo` | `tipo, marca, modelo, numeroSerie, observaciones` + `clienteId` |
| `OrdenReparacion` | Núcleo: `numero(unique)`, ingreso, diagnóstico, presupuesto/autorización, reparación, cobro, entrega/garantía, firmas, `estado`, `esGarantia/origen`, `creadoPorId/tecnicoId` |
| `FotoOrden` | `ordenId, url, publicId(unique)` — evidencia en Cloudinary |
| `HistorialEstadoOrden` | `ordenId, estado, fecha, comentario, usuarioId` |
| `Repuesto` | `nombre, descripcion, stock, costo, precioVenta` |
| `RepuestoUsado` | Detalle N:M orden↔repuesto con `cantidad, costoUnitario, precioUnitario` congelados |
| `Pago` | `ordenId, monto, medioPago, fecha, observaciones, registradoPorId` |

**Enums:**

- `RolUsuario`: `ADMIN`, `TECNICO`
- `EstadoOrden`: `RECIBIDO`, `EN_DIAGNOSTICO`, `ESPERANDO_REPUESTO`, `EN_REPARACION`, `LISTO`, `ENTREGADO`, `CANCELADO`
- `EstadoPago`: `PENDIENTE`, `PARCIAL`, `PAGADO`
- `MedioPago`: `EFECTIVO`, `TRANSFERENCIA`, `TARJETA_DEBITO`, `TARJETA_CREDITO`, `MERCADO_PAGO`, `OTRO`
- `CondicionFisicaEquipo`: `BUEN_ESTADO`, `GOLPES_ABOLLADURAS`, `RAYONES_SUPERFICIALES`, `PIEZAS_ROTAS_FALTANTES`

## 🔌 API Endpoints

Base URL: `http://localhost:3001` — Health: `GET /` → `"Sistema de Reparación — API funcionando correctamente 🚀"`

Todos (salvo login/refresh/logout) requieren `Authorization: Bearer <accessToken>`.

| Recurso | Base | Endpoints destacados |
|---|---|---|
| Usuarios | `/api/usuario` | `POST /login`, `POST /refresh`, `POST /logout` (públicos) · `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` (solo ADMIN) |
| Clientes | `/api/cliente` | CRUD completo |
| Equipos | `/api/equipo` | CRUD completo (requiere `clienteId`) |
| Órdenes | `/api/orden-reparacion` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` · `PATCH /:id/diagnostico` · `PATCH /:id/autorizacion` · `PATCH /:id/reparacion` · `PATCH /:id/cierre` · `POST /:id/fotos` (form-data `fotos`, 1–5) · `DELETE /fotos/:fotoId` |
| Historial | `/api/historial-estado-orden` | CRUD / consulta de trazabilidad por orden |
| Repuestos | `/api/repuesto` | CRUD + control de `stock` |
| Repuestos usados | `/api/repuesto-usado` | Asignar repuestos a una orden con cantidades y precios |
| Pagos | `/api/pago` | Registrar pagos parciales/totales por orden |

## 🚀 Instalación y Uso

### Requisitos

- Node.js 20+ · PostgreSQL 14+ · Cuenta de Cloudinary

### 1. Clonar e instalar

```bash
git clone https://github.com/Maxii34/Reparaciones-CJA.git
cd Reparaciones-CJA
npm install
```

> `postinstall` ejecuta `prisma generate` automáticamente (cliente en `src/generated/prisma`).

### 2. Configurar entorno

Copiar `.env.local` o crear `.env` (ver [Variables de Entorno](#-variables-de-entorno)).

### 3. Base de datos

```bash
npx prisma migrate dev
# o aplicar en producción:
npx prisma migrate deploy
```

### 4. Correr

```bash
npm run dev    # desarrollo con tsx watch → http://localhost:3001
npm run build  # compila a ./dist
npm start      # corre dist/index.js
```

### 5. Tests

```bash
npm test        # vitest run
npm run test:watch
```

## 🔐 Variables de Entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL (`prisma+postgres://...` o `postgresql://...`) |
| `JWT_SECRET` | ✅ | Secreto para firmar access/refresh tokens |
| `PORT` | ❌ (default `3001`) | Puerto del servidor |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | ✅ | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | ✅ | API secret de Cloudinary |
| `CLOUDINARY_UPLOAD_PRESET` | ❌ | Upload preset (si se usa modo preset) |

Ejemplo:

```env
DATABASE_URL="prisma+postgres://..."
JWT_SECRET="tu-secreto-super-seguro"
PORT=3001
CLOUDINARY_CLOUD_NAME="tu-cloud"
CLOUDINARY_API_KEY="tu-key"
CLOUDINARY_API_SECRET="tu-secret"
CLOUDINARY_UPLOAD_PRESET="tu-preset"
```

## 📜 Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `tsx watch src/index.ts` | Desarrollo con recarga |
| `postinstall` | `prisma generate` | Genera cliente Prisma |
| `build` | `tsc` | Compila TypeScript a `dist/` |
| `start` | `node dist/index.js` | Producción |
| `test` | `vitest run` | Tests una vez |
| `test:watch` | `vitest` | Tests en modo watch |

## 🔄 Flujo de la Orden de Reparación

```text
RECIBIDO → EN_DIAGNOSTICO → [ESPERANDO_REPUESTO] → EN_REPARACION → LISTO → ENTREGADO
                                                                ↘ CANCELADO (desde varios estados)
```

1. **Recepción** (`POST /api/orden-reparacion`): equipo, falla, accesorios, condición física, firmas recepción.
2. **Diagnóstico** (`PATCH /:id/diagnostico`): diagnóstico, pruebas, recomendaciones, costo estimado.
3. **Autorización** (`PATCH /:id/autorizacion`): `autorizadoCliente` + fecha.
4. **Reparación** (`PATCH /:id/reparacion`): trabajo realizado, mano de obra, repuestos usados.
5. **Cierre/Entrega** (`PATCH /:id/cierre`): precio final, pagos, fecha entrega, garantía 90 días, conformidad.

Cada transición escribe en `HistorialEstadoOrden`. Si el equipo reingresa en garantía se crea una orden con `esGarantia: true` + `ordenOrigenId`.

## 📄 Licencia

Distribuido bajo licencia **ISC** — ver `package.json`. © 2026 Maximiliano Ordoñez.
