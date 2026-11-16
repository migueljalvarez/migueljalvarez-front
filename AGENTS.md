# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio. Regla del proyecto: **se usa `AGENTS.md`; no se usa `CLAUDE.md`**.

## Qué es este proyecto

Sitio personal/portafolio de **Miguel Alvarez** (Medellín, Colombia; trabajo remoto), desarrollador de software independiente. El sitio funciona como **página de captación de clientes**: posiciona a Miguel como alguien que "antes de escribir código, entiende el problema" y dirige al visitante a contactarlo (primera consulta sin costo, respuesta < 24 h).

- Público objetivo: emprendedores y empresas hispanohablantes que necesitan sitios web, sistemas y MVPs.
- Idioma del contenido y de la UI: **español** (`lang="es"`). Código, nombres de variables y commits: mezcla; el copy siempre en español.
- Rama de trabajo actual: `v2/landing` (rediseño v2 de la landing). `main` es la rama principal.

## Stack

- Nuxt 3.21 (SSR activo), Vue 3 `<script setup lang="ts">`, TypeScript.
- Nuxt UI 3 + Tailwind CSS 4 (tokens de marca `brand-*` en `assets/css/main.css`), `@nuxt/icon` (mdi / simple-icons), `@nuxt/image` (ipx + Cloudinary `res.cloudinary.com/m2a`), `@nuxt/fonts` (Poppins, Inter, IBM Plex Mono).
- Backend en Nitro (`server/api`): Firebase Admin/Firestore, Resend (correo de contacto), Zod (validación).
- Despliegue: Netlify (`netlify.toml`). Node `>=22 <25` (ver `.nvmrc`).

## Comandos

```bash
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run generate   # prerender estático
npm run lint       # eslint
npm run format     # prettier
npm test           # node --test (tests/*.mjs)
```

## Estructura

```
pages/            index (landing), como-trabajo, login, portafolio/{index,[slug],[id]}, dashboard/*
layouts/          default, dashboard, error
components/
  atoms/          Avatar, Badge, Button, DotNavigation, Hero, Input, Select, Title
  molecules/      AvatarCard, Blockquote, Card, Footer, Header, HeroVisual, InfiniteCarousel, SocialMedia
  organisms/      Carousel, Section
  templates/      Main, Services, ProcessSection, Portfolio*, About, Contact, HowWork*, Testimonial
  DynamicTable/, Form/
composables/      useEmail, useLogos, useSectionReveal, useSocialMedia, useTechnicalSheet, useTypeContent, useTypeText
constants/        common (copy HOME_COPY/HOME_HERO_COPY/META), portfolio, routes (PUBLIC_ROUTES, API), testimonials
data/             services.ts, work.ts (contenido estático de servicios y "cómo trabajo")
server/api/       (contact), (me), admin/{login,logout}, portafolio, testimonials
utils/            cn.ts, portfolioFilters.ts
docs/             brand-system.md (tipografía/paleta), firebase-me-update.md
tests/            portfolioFilters.test.mjs
```

Atomic design: atoms → molecules → organisms → templates → pages. Cada carpeta tiene `index.ts` y `.d.ts` de tipos.

## Landing (orden de secciones en `pages/index.vue`)

Main (hero) → Services → ProcessSection → Portafolio (destacados) → About → Contact. Rutas públicas: `/`, `/como-trabajo`, `/portafolio`, `/portafolio/[slug]`.

## Fuentes de datos (importante)

- **Copy y contenido de la landing**: mayormente estático en `constants/` y `data/`.
- **Portafolio**: hoy vive en `constants/portfolio.ts` (solo Mi Comodoro y Mi Despensa) y se sirve por `/api/portafolio` (no desde Firestore). Campos clave: `slug`, `type` (`client` | `product` | `practice`), `status` (`published` | `in-development`; en desarrollo no tiene ficha de detalle), `problem` / `decision` / `result`. El detalle público es `pages/portafolio/[slug].vue` (la página legacy `[id].vue` se eliminó porque tapaba a `[slug]`).
- **Perfil ("me")**: Firestore vía `/api/me` (cacheado, `swr`). Edición manual documentada en `docs/firebase-me-update.md`.
- **Redes sociales / testimonios**: `/api/socialMedia`, `/api/testimonials`.
- **Contacto**: `POST /api/contact` → Resend (`RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`).

## Convenciones

- Prettier + ESLint (config en repo); `<script>` indentado dentro de `.vue`. Respetar `.prettierrc`.
- Clases Tailwind canónicas v4 y tokens `brand-*`; seguir `docs/brand-system.md` para jerarquía tipográfica y contraste.
- Accesibilidad: `min-h-11` en objetivos táctiles, `focus-visible`, `aria-hidden` en iconos decorativos.
- Texto de UI en español, tono cercano y orientado al negocio (no jerga técnica en el copy).
- Imágenes en `public/` (webp) o Cloudinary; usar `NuxtImg`.
- Commits en español, descriptivos y cortos (ver `git log`).

## Flujo de ramas y publicación

- **NO se publica nada hasta que la base de datos (Supabase) esté OK.** No hacer push, PR a `main`, merge a `main` ni deploy sin que el autor lo pida explícitamente.
- Se trabaja en ramas `feat/*` / `fix/*` creadas desde `v2/landing` y se integran de vuelta en `v2/landing` con merge local (`--no-ff`).
- Commits y PRs sin líneas de atribución de Claude (ni `Co-Authored-By` ni "Generated with Claude Code").

## Reglas para agentes

1. No modificar nada fuera del alcance pedido; el árbol de trabajo tiene muchos cambios sin commitear de la v2 — **no revertirlos ni formatearlos en masa**.
2. Nunca leer, imprimir ni commitear valores de `.env` (Firebase, Resend). Solo nombres de variables.
3. Antes de dar una tarea por cerrada: `npm run lint` y `npm test`; para cambios visuales, verificar en `npm run dev`.
4. No crear `CLAUDE.md`. Las instrucciones para agentes se mantienen aquí.
5. Los pendientes y el plan de trabajo se gestionan en **Notion** (ver sección siguiente).

## Identidad visual (validada con la home en escritorio, nov-2026)

- **Tono**: profesional sereno, consultivo y confiable; "entiendo tu problema" antes que "construyo tu app". Cercano (tuteo, primera persona), sin jerga ni tono de búsqueda de empleo.
- **Paleta**: azul marino profundo (`brand-navy` #121e30 / `brand-mid` / `brand-accent`) como protagonista; superficies casi blancas (`brand-surface` #f5f7fa) para lectura; azul de logo (`brand-blue` #3f6bad) solo en acentos puntuales; verde solo para estados/WhatsApp. Alternancia de bandas oscuras (hero, proceso, contacto) y claras (servicios, portafolio, sobre mí).
- **Tipografía**: Poppins (títulos, peso fuerte, tracking ajustado), Inter (cuerpo), IBM Plex Mono (acentos técnicos). Eyebrows en mayúsculas con tracking amplio antes de cada título.
- **Motivo gráfico**: hexágonos (logo, fondo del hero, marcadores numerados 01–06, placeholders de proyectos).
- **Componentes**: tarjetas blancas con esquinas muy redondeadas y sombra suave sobre fondo claro; paneles oscuros con borde sutil; botones primario (azul oscuro) y secundario (contorno); chips pequeños para etiquetas; checks para beneficios.
- **Estructura narrativa**: hero (promesa + CTA + prueba de disponibilidad) → ¿en qué punto estás? (3 servicios por situación del cliente) → proceso → acuerdos de trabajo → portafolio → sobre mí (personal y cálido) → contacto.
- **Contacto**: panel oscuro con formulario sobre el footer, solapado a propósito. No "corregirlo".
- Al ajustar, mantener esta identidad; las mejoras son refinamientos, no rediseños.

## Datos de ejemplo (mocks)

- El portafolio público solo muestra **productos propios y trabajos reales de clientes**. Los proyectos de práctica y cualquier dato inventado NO van en `constants/portfolio.ts`.
- Para ver cómo se comporta la UI con varios proyectos, los mocks viven en un archivo aparte (`constants/portfolio.mock.ts`) y solo se activan en desarrollo (`USE_PORTFOLIO_MOCKS = import.meta.dev` en `constants/portfolio.ts`; en `npm run dev` se ve la marca "Datos de ejemplo"). Nunca deben llegar a producción, `build` ni `generate`: `tests/portfolioMocks.test.mjs` revisa `.output` tras un `npm run build`. Para ver el sitio solo con datos reales, usa `npm run build && npm run preview`.
- Lo mismo aplica a testimonios: sin testimonios reales aprobados, la sección no se muestra en producción.

## Gestión de pendientes

Plan de trabajo y backlog en Notion (workspace del autor). Base "migueljalvarez.com – Backlog": https://app.notion.com/p/41a3dd9397f681c9ba0fd839c2e4786b (sprints semanales S1–S15 desde el 16-nov-2026, ~5 h/semana; vistas Tablero, Roadmap y Por sprint).

Dirección estratégica: cerrar y publicar v2/landing → endurecer seguridad → SEO/contenido → migrar Firestore a Supabase (DB + Auth + Storage) → panel privado `/admin` en el mismo proyecto Nuxt → más adelante backend propio.

## Panel administrativo (visión)

Módulos previstos en `/admin` (privado, noindex, Supabase Auth, un solo admin): leads (captura del formulario + alta manual + pipeline), testimonios (solicitud por correo con enlace único → aprobación), políticas y tarifas, clientes y proyectos, equipo (horas pactadas y pagos pendientes; solo el admin registra), experiencia profesional y, a futuro, generador de CV ATS por vacante (usa solo hechos de la base de experiencia, sin inventar).

**Posicionamiento**: el sitio público proyecta a un profesional que presta servicios, no a alguien que busca empleo. No exponer CV ni experiencia laboral públicamente.

## Deuda técnica conocida (a priorizar en el plan)

- **Auth del dashboard es provisional** (rama `feat/security-hardening`): login con `ADMIN_EMAIL` / `ADMIN_PASSWORD`, cookie `admin_session` firmada (HMAC con `ADMIN_SESSION_SECRET`), httpOnly, 8 h, validada en servidor (`server/utils/adminSession.ts`, `/api/admin/session`, `middleware/auth.ts`). Sin esas variables el acceso queda cerrado (503). Limitaciones: un solo usuario, contador de intentos en memoria, y las páginas del dashboard aún escriben en Firestore desde el cliente (reglas de Firestore no revisadas). Se reemplaza por Supabase Auth (S7).
- `server/api/(contact)/contact.ts` ya está endurecido (escape de HTML, límites, honeypot, 5 intentos/10 min por IP en memoria, `runtimeConfig`). Pendiente: rate limit del proveedor y prueba de envío real en preview.
- (Resuelto) `server/utils/firebase-admin.ts` ya sin doble extensión y sin el `DotNavigation` duplicado de Hero.
- Dos fuentes de verdad para portafolio: `constants/portfolio.ts` vs. dashboard `/dashboard/portfolio` (Firestore) — sin sincronizar. Lo mismo con servicios y testimonios.
- `README.md` es el de la plantilla de Nuxt; `netlify.toml` publica `dist` pero Nuxt SSR genera `.output`; `useSeoMeta` en `index.vue` calcula `origin` con `window` (riesgo de hydration mismatch), sin sitemap/robots/canonical.
- Cobertura de tests mínima (1 archivo); 
- `constants/portfolio.ts` `PORTFOLIO_TYPE_OPTIONS` ('Productos Propios') difiere en capitalización de `PortfolioFilter` ('Productos propios').

## Problemas conocidos de entorno

- `@nuxt/image` se fija en `~2.1.0`: la 2.2.x requiere `nuxt/server` (Nuxt 4) y rompe el servidor con Nuxt 3.21. Subirla solo junto con la migración a Nuxt 4.
- `npm run build` + `node .output/server/index.mjs` en local falla con 500 (`ERR_PACKAGE_PATH_NOT_EXPORTED` de `estree-walker`: no se copia a `.output`). No lo causa `npm audit fix`. Pendiente verificar si ocurre con el preset de Netlify antes de publicar.
