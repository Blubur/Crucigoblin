# Crucigrama

Crucigramas colaborativos en español — web independiente (sin Discord).
Todos los jugadores de una **sala** resuelven juntos el mismo tablero. Sin competición individual.

Este README cubre la **Fase 1: configuración del proyecto**. Todo lo necesario aquí es gratuito.

---

## Requisitos previos (instalar en tu ordenador)

1. **Node.js 20 o superior** → https://nodejs.org (versión LTS, gratis). Verifica con `node -v`.
2. **Docker Desktop** → https://www.docker.com/products/docker-desktop (gratis para uso personal).
   Necesario para levantar Postgres y Redis en local sin pagar hosting.
3. **Git** → https://git-scm.com (gratis).
4. **Cuenta de GitHub** → https://github.com (plan gratuito).

---

## Paso 1 — Crear el repositorio en GitHub

```bash
git init
git add .
git commit -m "Fase 1: scaffolding inicial del monorepo (sin Discord)"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/crucigrama.git
git push -u origin main
```

⚠️ **Nunca** subas el archivo `.env` (ya está en `.gitignore`) — ahí irá `JWT_SECRET`.

---

## Paso 2 — Instalar dependencias del monorepo

```bash
npm install
```

---

## Paso 3 — Levantar PostgreSQL y Redis en local con Docker

```bash
npm run docker:up
```

Para pararlos cuando termines:

```bash
npm run docker:down
```

---

## Paso 4 — Configurar variables de entorno

```bash
cp .env.example .env
```

Cambia `JWT_SECRET` por cualquier cadena larga aleatoria (por ejemplo, ejecuta `openssl rand -hex 32` y pega el resultado).

---

## Paso 5 — Generar el cliente de Prisma y aplicar el esquema inicial

Con Docker levantado (paso 3) y el `.env` configurado (paso 4):

```bash
npm run prisma:generate
npm run prisma:migrate
```

El segundo comando te pedirá un nombre para la migración (ej. `init`) y creará las tablas (`User`, `Room`, `RoomMember`, `Crossword`...) en tu Postgres local.

---

## Paso 6 — Comprobar que todo arranca

```bash
npm run dev:api        # http://localhost:3001/health debe devolver {"status":"ok"}
npm run dev:activity   # http://localhost:5173
```

Prueba el registro de usuario:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"unaClaveLarga123","username":"TuNombre"}'
```

Debería devolver un `token` y tus datos de usuario. Guarda ese `token`; lo usaremos en la Fase 2 para las rutas protegidas (crear/unirse a salas).

---

## Estructura del proyecto

```
crucigrama/
├── apps/
│   ├── activity/   # Frontend web - React + Vite + TS + Tailwind
│   └── api/        # Backend - Fastify + Socket.IO + Prisma + auth propia
├── packages/
│   ├── shared-types/  # Tipos TS compartidos entre api y activity
│   └── config/        # tsconfig base compartido
├── prisma/
│   └── schema.prisma  # Esquema: User, Room, RoomMember, Crossword...
├── docker/
│   └── docker-compose.yml  # Postgres + Redis para desarrollo local
└── .env.example
```

## Próxima fase

**Fase 2 — Salas y motor**: endpoints para crear una sala (genera `inviteCode`), unirse con ese código, gestionar roles dentro de la sala, y el `CrosswordEngine` (construcción de cuadrícula, validación de tildes/Ñ).
