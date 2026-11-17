# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio. Regla del proyecto: **se usa `AGENTS.md`; no se usa `CLAUDE.md`**.

## Qué es este proyecto

Sitio personal/portafolio de **Miguel Alvarez** (Medellín, Colombia; trabajo remoto), desarrollador de software independiente. El sitio funciona como **página de captación de clientes**: posiciona a Miguel como alguien que "antes de escribir código, entiende el problema" y dirige al visitante a contactarlo (primera consulta sin costo, respuesta < 24 h).

- Público objetivo: emprendedores y empresas hispanohablantes que necesitan sitios web, sistemas y MVPs.
- Idioma del contenido y de la UI: **español** (`lang="es"`). Código, nombres de variables y commits: mezcla; el copy siempre en español.
- Rama de trabajo actual: `v2/landing-clean` (rediseño v2, historial limpio). **No mezclar con `origin/v2/landing`, `main` ni `develop`**: conservan un historial anterior distinto (con datos personales ya retirados aquí). `main` se reemplazará por esta rama cuando se publique. Se permite hacer push normal de `v2/landing-clean`; no usar `git pull` desde las otras ramas.

## Stack

- Nuxt 4.6 (SSR activo; estructura de carpetas en la raíz, sin `app/`), Vue 3 `<script setup lang="ts">`, TypeScript.
- Nuxt UI 4 + Tailwind CSS 4 (tokens de marca `brand-*` en `assets/css/main.css`), `@nuxt/icon` (mdi / simple-icons), `@nuxt/image` (ipx / proveedor de Netlify), `@nuxt/fonts` (Poppins, Inter).
- Backend en Nitro (`server/api`): Firebase Admin/Firestore, Resend (correo de contacto), Zod (validación).
- Despliegue: Netlify (`netlify.toml`, preset `netlify` de Nitro: estáticos en `dist`, SSR como función). Node 22.22.3 (`.nvmrc` y `netlify.toml`). CI en `.github/workflows/ci.yml` y Dependabot.

## Comandos

```bash
npm run dev        # http://localhost:3000 (si está ocupado, uno temporal: PORT=3333 npm run dev; ajusta NUXT_PUBLIC_BASE_URL)
npm run build      # build de producción
npm run generate   # prerender estático
npm run lint       # eslint
npm run format     # prettier
npm test           # node --test (tests/*.mjs)
```

## Estructura

```
pages/            index (landing), como-trabajo, privacidad, login, portafolio/{index,[slug]}, dashboard/index (sesión activa; módulos futuros en /admin)
layouts/          default, dashboard, error
components/
  atoms/          Button, Input, Select, Title
  molecules/      Header, SocialMedia
  organisms/      Section
  templates/      Main, Services, ProcessSection, Portfolio*, About, Contact, HowWork*
  Form/
composables/      useEmail, useSectionReveal, useSiteSeo, useSocialMedia
constants/        common (copy HOME_COPY/HOME_HERO_COPY/META), portfolio (+ mock solo dev), routes (PUBLIC_ROUTES, API)
data/             services.ts, work.ts (contenido estático de servicios y "cómo trabajo")
server/api/       (contact), (me), admin/{login,logout,session}, portafolio
utils/            cn.ts, portfolioFilters.ts
docs/             brand-system.md (tipografía/paleta), openapi.yaml (contrato de API)
tests/            portfolioFilters.test.mjs
```

Atomic design: atoms → molecules → organisms → templates → pages. Cada carpeta tiene `index.ts` y `.d.ts` de tipos.

## Landing (orden de secciones en `pages/index.vue`)

Main (hero) → Services → ProcessSection → Portafolio (destacados) → About → Contact. Rutas públicas: `/`, `/como-trabajo`, `/portafolio`, `/portafolio/[slug]`.

## Fuentes de datos (importante)

- **Copy y contenido de la landing**: mayormente estático en `constants/` y `data/`.
- **Portafolio**: hoy vive en `constants/portfolio.ts` (solo Mi Comodoro y Mi Despensa) y se sirve por `/api/portafolio` (no desde Firestore). Campos clave: `slug`, `type` (`client` | `product` | `practice`), `status` (`published` | `in-development`; en desarrollo no tiene ficha de detalle), `problem` / `decision` / `result`. El detalle público es `pages/portafolio/[slug].vue` (la página legacy `[id].vue` se eliminó porque tapaba a `[slug]`).
- **Redes sociales**: `/api/socialMedia` (Firestore). Los testimonios no tienen endpoint hasta que exista uno real aprobado.
- **Contacto**: `POST /api/contact` → Resend (`RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`).

## Convenciones

- Prettier + ESLint (config en repo); `<script>` indentado dentro de `.vue`. Respetar `.prettierrc`.
- Clases Tailwind canónicas v4 y tokens `brand-*`; seguir `docs/brand-system.md` para jerarquía tipográfica y contraste.
- Accesibilidad: `min-h-11` en objetivos táctiles, `focus-visible`, `aria-hidden` en iconos decorativos.
- Texto de UI en español, tono cercano y orientado al negocio (no jerga técnica en el copy).
- Imágenes en `public/` (webp, ≤ ~100 KB); usar `NuxtImg`.
- Commits en español, descriptivos y cortos (ver `git log`).

## Seguridad de cabeceras

- `routeRules` en `nuxt.config.ts` añade `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS y un CSP mínimo (`frame-ancestors`, `base-uri`, `form-action`, `object-src`). Zonas privadas llevan `no-store` y `X-Robots-Tag`. El CSP completo (script/connect-src) queda pendiente hasta retirar el SDK de Firebase del navegador.
- El servidor de desarrollo escucha solo en `localhost` (no en toda la red).

## Calidad antes de integrar

- Además de lint, build y tests: abrir la home en `npm run dev` y revisar que la consola no muestre avisos de Vue ni "Hydration mismatch". Un import perdido (p. ej. `Section`) no rompe la página a la vista pero sí genera errores de hidratación.
- Lighthouse (referencia nov-2026, build local): móvil 80 / escritorio 98 en rendimiento; accesibilidad, buenas prácticas y SEO en 100. Imágenes de `public/` ≤ ~100 KB y ≤ 1920 px de ancho.

## Contrato de API

- `docs/openapi.yaml` (OpenAPI 3.1) documenta todos los endpoints `/api/*` y es el contrato que debe cumplir el futuro backend Nest. Al agregar o cambiar un endpoint hay que actualizarlo: `tests/openapiContract.test.mjs` falla si un archivo de `server/api` no está documentado (o al revés).

## SEO

- Metadatos por página con `usePageSeo()` (`composables/useSiteSeo.ts`): título, descripción, canonical, Open Graph y Twitter. La URL base sale de `NUXT_PUBLIC_BASE_URL` (obligatoria en producción: `https://migueljalvarez.com`); nunca usar `window` para calcularla.
- `/robots.txt` y `/sitemap.xml` son rutas de servidor (`server/routes/`). El robots bloquea todo si la URL base es local. El sitemap excluye proyectos `in-development`.
- Páginas privadas (`/login`, `/dashboard/*`) llevan `noindex`. JSON-LD (Person + ProfessionalService) en la home.

## Código retirado a propósito

- Se eliminó todo lo que ninguna página usaba (nov-2026): componentes (Hero, Avatar, Badge, Footer, Card, AvatarCard, Blockquote, carruseles, HeroVisual, HeroCurve, Testimonial, PortfolioItem), `DynamicTable`, composables sin uso, los endpoints `/api/testimonials` y `/api/me`, las 6 páginas del dashboard viejo, la configuración de Cloudinary, la fuente IBM Plex Mono y los logos/cursos de `public/`. Quedan en el historial de git si se necesitan.
- **Testimonios**: no hay sección pública ni endpoint hasta que exista un testimonio real aprobado (módulo planeado en S9-S10 del plan). Entonces se reconstruyen desde cero.

## Archivos privados

- El CV y otros documentos personales NO se sirven públicamente. Viven en `.private/` (ignorado por git). Solo se descargarán o generarán desde el panel `/admin` con sesión válida (módulo de experiencia/CV, futuro); nunca desde `public/`.
- El repositorio de GitHub es **público**: no subir datos personales (teléfono, correo, CV) ni secretos.

## Flujo de ramas y publicación

- **NO se publica nada hasta que la base de datos (Supabase) esté OK.** No hacer push, PR a `main`, merge a `main` ni deploy sin que el autor lo pida explícitamente.
- Se trabaja en ramas `feat/*` / `fix/*` creadas desde `v2/landing-clean` y se integran de vuelta en ella con merge local (`--no-ff`). El push de `v2/landing-clean` está permitido (no afecta al despliegue); `main`, push forzado y deploy requieren petición explícita.
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
- **Tipografía**: Poppins (títulos, peso fuerte, tracking ajustado), Inter (cuerpo). Eyebrows en mayúsculas con tracking amplio antes de cada título.
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

- **Auth del dashboard es provisional** (rama `feat/security-hardening`): login con `ADMIN_EMAIL` / `ADMIN_PASSWORD`, cookie `admin_session` firmada (HMAC con `ADMIN_SESSION_SECRET`), httpOnly, 8 h, validada en servidor (`server/utils/adminSession.ts`, `/api/admin/session`, `middleware/auth.ts`). Sin esas variables el acceso queda cerrado (503). Limitaciones: un solo usuario, contador de intentos en memoria. El panel viejo (6 páginas con datos de ejemplo en localStorage) se eliminó en nov-2026; `/dashboard` solo muestra la sesión activa hasta que exista `/admin`. Se reemplaza por Supabase Auth (S7).
- `server/api/(contact)/contact.ts` ya está endurecido (escape de HTML, límites, honeypot, 5 intentos/10 min por IP en memoria, `runtimeConfig`). Pendiente: rate limit del proveedor y prueba de envío real en preview.
- (Resuelto) `server/utils/firebase-admin.ts` ya sin doble extensión y sin el `DotNavigation` duplicado de Hero.
- Firestore solo se usa hoy para `/api/socialMedia` (Header y Contacto); existe `MY_SOCIAL_MEDIA` en `constants/common` como alternativa sin base de datos.
- Netlify: el build con el preset `netlify` funciona en local (`NITRO_PRESET=netlify npm run build`); pesa 45 MB la función por los iconos de `@nuxt/icon` en modo local (valorar modo `remote` o recorte de colecciones). Falta medir en un deploy preview real.
- Cobertura de tests básica (filtros, mocks, contrato OpenAPI, secretos).
- `constants/portfolio.ts` `PORTFOLIO_TYPE_OPTIONS` ('Productos Propios') difiere en capitalización de `PortfolioFilter` ('Productos propios').

## Problemas conocidos de entorno

- **Node**: Nuxt 4.6 exige Node `^22.22.3 || ^24.15.0 || >=26`. Con 22.12 compila pero avisa "unsupported". Actualizar con `nvm install 22.22.3` (Netlify usa `.nvmrc`).
- `estree-walker@^2.0.2` es dependencia directa a propósito: sin ella `node .output/server/index.mjs` falla con `ERR_PACKAGE_PATH_NOT_EXPORTED` (Nitro no copiaba la v2 anidada de `@vue/compiler-core`). No quitarla.
- **Secretos**: nunca se leen de `process.env` en `nuxt.config.ts` (quedarían escritos en `.output`). Los valores privados de `runtimeConfig` van vacíos y se resuelven en ejecución con `getServerSecret()` (`server/utils/secrets.ts`): primero `NUXT_<CLAVE>` (p. ej. `NUXT_RESEND_API_KEY`) y como respaldo el nombre clásico del `.env` (`RESEND_API_KEY`). `tests/noSecretsInBuild.test.mjs` falla si un secreto del `.env` aparece en `.output`.
- El correo y teléfono de `pages/dashboard/cv.vue` viajan en un chunk JS público aunque la página esté protegida; se retirarán al reconstruir el módulo de CV.
