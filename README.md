# Crucigrama

Crucigramas colaborativos en español para Discord — Discord Activity + Bot.
Todos los jugadores de un servidor resuelven juntos el mismo tablero. Sin competición individual.

Este README cubre la **Fase 1: configuración del proyecto**. Todo lo necesario aquí es gratuito.

---

## Requisitos previos (instalar en tu ordenador)

1. **Node.js 20 o superior** → https://nodejs.org (versión LTS, gratis).
   Verifica con: `node -v`
2. **Docker Desktop** → https://www.docker.com/products/docker-desktop (gratis para uso personal/pequeños equipos).
   Necesario para levantar Postgres y Redis en local sin pagar ningún hosting.
3. **Git** → normalmente ya viene instalado; si no, https://git-scm.com (gratis).
4. **Cuenta de GitHub** → https://github.com (el plan gratuito es suficiente para repos privados o públicos).
5. **Cuenta de Discord** (la que ya usas) — no hace falta ninguna de pago.

---

## Paso 1 — Crear el repositorio en GitHub

1. Entra en https://github.com/new
2. Nombre sugerido: `crucigrama`
3. Puedes dejarlo **privado** (gratis en GitHub para cualquier cuenta).
4. No marques "Initialize with README" (ya lo tenemos aquí).
5. En tu terminal, dentro de esta carpeta:

```bash
git init
git add .
git commit -m "Fase 1: scaffolding inicial del monorepo"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/crucigrama.git
git push -u origin main
```

⚠️ **Nunca** subas el archivo `.env` (ya está en `.gitignore`) — ahí irán tokens y secretos.

---

## Paso 2 — Instalar dependencias del monorepo

```bash
npm install
```

Esto instala todo lo necesario para `apps/activity`, `apps/bot`, `apps/api` y `packages/*` de una vez (npm workspaces, sin coste).

---

## Paso 3 — Levantar PostgreSQL y Redis en local con Docker

```bash
npm run docker:up
```

Esto arranca dos contenedores locales (Postgres 16 y Redis 7, ambos imágenes oficiales gratuitas) usando `docker/docker-compose.yml`. No se conecta a ningún servicio de pago.

Para pararlos cuando termines de trabajar:

```bash
npm run docker:down
```

---

## Paso 4 — Configurar variables de entorno

```bash
cp .env.example .env
```

Los valores por defecto ya apuntan al Postgres/Redis que acabas de levantar con Docker. Los campos de Discord (`DISCORD_CLIENT_ID`, etc.) los rellenamos en el paso siguiente.

---

## Paso 5 — Crear la aplicación en el Discord Developer Portal (gratis)

1. Ve a https://discord.com/developers/applications
2. Pulsa **New Application** → ponle de nombre `Crucigrama` (o el que prefieras).
3. En la pestaña **General Information**:
   - Copia el **Application ID** → pégalo en `.env` como `DISCORD_CLIENT_ID`.
4. En la pestaña **OAuth2**:
   - Copia el **Client Secret** → `.env` como `DISCORD_CLIENT_SECRET`.
   - En "Redirects", añade `http://localhost:5173` (para desarrollo local).
5. En la pestaña **Bot**:
   - Pulsa **Add Bot** (gratis, sin límite de servidores para un bot personal en esta fase).
   - Copia el **Token** → `.env` como `DISCORD_BOT_TOKEN`. (Este token es secreto, no lo compartas ni lo subas a GitHub.)
   - Activa el intent **Server Members Intent** (lo necesitaremos para comprobar el rol "Creador").
6. En la pestaña **General Information** también verás la **Public Key** → `.env` como `DISCORD_PUBLIC_KEY`.
7. En la pestaña **Activities** (puede aparecer como "App Testers" o "Embedded App" según el momento en que Discord la muestre):
   - Habilita que la aplicación pueda lanzarse como **Activity**.
   - Como URL de desarrollo usaremos el túnel local que configuraremos en la Fase 2 (Discord exige HTTPS incluso en local, normalmente vía `cloudflared` o `ngrok`, ambos con plan gratuito). Esto lo detallamos cuando lleguemos a esa fase — en la Fase 1 solo necesitas tener la app creada.

No hace falta verificar la app ni pagar nada para desarrollo; los límites de "aplicación no verificada" (máx. 100 servidores) no afectan a esta fase.

---

## Paso 6 — Generar el cliente de Prisma y aplicar el esquema inicial

Con Docker ya levantado (paso 3) y el `.env` configurado (paso 4):

```bash
npm run prisma:generate
npm run prisma:migrate
```

El segundo comando te pedirá un nombre para la migración (ej. `init`) y creará las tablas iniciales en tu Postgres local.

---

## Paso 7 — Comprobar que todo arranca

En tres terminales distintas (o con un gestor de procesos, más adelante):

```bash
npm run dev:api        # http://localhost:3001/health debe devolver {"status":"ok"}
npm run dev:activity   # http://localhost:5173
npm run dev:bot        # debe imprimir "Bot conectado como ..."
```

Si los tres arrancan sin errores, la Fase 1 está completa.

---

## Estructura del proyecto

```
crucigrama/
├── apps/
│   ├── activity/   # Frontend (Discord Activity) - React + Vite + TS + Tailwind
│   ├── bot/        # Discord Bot - discord.js
│   └── api/        # Backend - Fastify + Socket.IO + Prisma
├── packages/
│   ├── shared-types/  # Tipos TS compartidos entre api/bot/activity
│   └── config/        # tsconfig base compartido
├── prisma/
│   └── schema.prisma  # Esquema inicial de base de datos
├── docker/
│   └── docker-compose.yml  # Postgres + Redis para desarrollo local
└── .env.example
```

## Próxima fase

**Fase 2 — Discord**: Bot funcional con slash commands básicos, flujo OAuth2 completo, y la Activity cargando dentro de Discord de verdad (vía túnel HTTPS gratuito).
