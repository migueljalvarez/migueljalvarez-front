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
- Backend en Nitro (`server/api`): Resend (correo de contacto) y Zod (validación). **Sin base de datos por ahora**: Firebase se retiró por completo (nov-2026); la base y la API serán un backend propio (NestJS + PostgreSQL en el repositorio `../migueljalvarez-api`, en tu servidor tras Cloudflare Tunnel); Supabase queda solo como alternativa descartada por ahora.
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
pages/            index (landing), how-we-work (/como-trabajo), privacy (/privacidad), login, portfolio/{index,[slug]} (/portafolio), admin/* (panel privado)
layouts/          default, admin (panel), auth (login); el error global está en error.vue (raíz)
components/
  atoms/          Button (tema primary/secondary/whatsapp, onDark, to), Input, Select, Checkbox, Title, Eyebrow, Chip, Card, HexMarker
  molecules/      Header, SocialMedia, SectionHeader (eyebrow + título + texto), CheckList, BackLink, FilterPills
  organisms/      Section, ProjectCard, ServiceCard
  templates/      Main, Services, ProcessSection, Portfolio*, About, Contact, HowWork*
  Form/
composables/      useEmail, useSectionReveal, useSiteSeo, useSocialMedia
constants/        common (copy HOME_COPY/HOME_HERO_COPY/META), portfolio (+ mock solo dev), routes (PUBLIC_ROUTES, API)
data/             services.ts, work.ts (contenido estático de servicios y "cómo trabajo")
server/api/       (contact), admin/{login,logout,session}, portafolio
utils/            cn.ts, portfolioFilters.ts
docs/             brand-system.md (tipografía/paleta), openapi.yaml (contrato de API), portfolio-guide.md (qué mostrar y medidas de imágenes)
tests/            filtros del portafolio, mocks fuera del build, secretos fuera del build y contrato OpenAPI
```

Atomic design: atoms → molecules → organisms → templates → pages. Cada carpeta tiene `index.ts` y `.d.ts` de tipos (`atom.d.ts`, `molecule.d.ts`, `organism.d.ts`, `template.d.ts`); los tipos de portafolio viven en `types/portfolio.ts`. Sombras de marca como tokens (`shadow-card`, `shadow-card-lg`, `shadow-dialog`, `shadow-header`) en `assets/css/main.css`; ritmo vertical de bandas `py-12 md:py-16`.

## Landing (orden de secciones en `pages/index.vue`)

Main (hero) → Services → ProcessSection → Portafolio (destacados) → About → Contact. Rutas públicas: `/`, `/como-trabajo`, `/portafolio`, `/portafolio/[slug]`.

## Fuentes de datos (importante)

- **Copy y contenido de la landing**: mayormente estático en `constants/` y `data/`.
- **Contenido público gestionado desde el panel (portafolio, redes, políticas)**: la fuente principal es la API (`../migueljalvarez-api`), consumida **solo desde Nitro** con `server/utils/publicContent.ts` y `publicApiClient.ts` (variable `NUXT_API_BASE_URL`; sin ella no hay API). Si la API no está configurada, no responde (tiempo máximo 2 s) o no tiene nada publicado, el sitio usa el **contenido de respaldo del código** (`constants/portfolio.ts`, `MY_SOCIAL_MEDIA`, `data/work.ts`): el landing nunca cae ni queda vacío. Endpoints del sitio: `/api/portfolio`, `/api/portfolio/[slug]`, `/api/social-links`, `/api/policies` (caché corta con `swr` en producción; **sin caché en desarrollo**). La lógica de mapeo y tarjetas es pura y vive en `utils/publicContent.ts` (con pruebas). Las páginas cargan con `usePortfolio()` / `usePolicies()`; las redes, con el plugin `plugins/socialLinks.ts` (SSR, sin parpadeo).
- **Modo mantenimiento** (`server/middleware/maintenance.ts`, lógica pura en `server/utils/{apiHealth,maintenancePage}.ts`): con `NUXT_API_BASE_URL` configurada, antes de renderizar cada página se comprueba `GET /api/health` de la API (caché de 15 s si responde y 5 s si no, un reintento). Si la API está caída se responde **503** con una página de mantenimiento autocontenida (`Retry-After: 60`, `no-store`, `noindex`; se reintenta sola), de modo que nunca se ve contenido de respaldo desactualizado. Estáticos, `/api/*`, `robots.txt` y `sitemap.xml` no pasan por la comprobación. Sin API configurada (desarrollo, previews) no actúa. El respaldo del código sigue usándose si la API responde pero no tiene nada publicado.
- **Portafolio (respaldo)**: vive en `constants/portfolio.ts` (solo Mi Comodoro y Mi Despensa) y se sirve por `/api/portfolio` cuando no hay API (no desde Firestore). Campos clave: `slug`, `type` (`client` | `product` | `practice`), `status` (`published` | `in-development`; en desarrollo no tiene ficha de detalle), `description`, `role` / `year` / `duration`, `problem` / `decision` / `result`, `highlights`, `scope`, `gallery` (con `alt`) y `ogImage`; lo opcional solo se muestra si tiene contenido. Guía completa: `docs/portfolio-guide.md`. El detalle público es `pages/portafolio/[slug].vue` (la página legacy `[id].vue` se eliminó porque tapaba a `[slug]`).
- **Redes sociales**: salen de la API (`/api/social-links`, gestionadas desde el panel) con respaldo en `MY_SOCIAL_MEDIA` (`constants/common`), vía `useSocialMedia()`; se cargan durante el SSR. Los testimonios no tienen endpoint hasta que exista uno real aprobado.
- **Titular legal del sitio (Términos, Privacidad, pie)**: los datos NUNCA van en el código ni en el repositorio público. Llegan por `runtimeConfig.public.legal` (vacío por defecto) con las variables `NUXT_PUBLIC_LEGAL_NAME`, `NUXT_PUBLIC_LEGAL_ID_TYPE` (`CC` | `NIT`), `NUXT_PUBLIC_LEGAL_ID_NUMBER`, `NUXT_PUBLIC_LEGAL_EMAIL` y `NUXT_PUBLIC_LEGAL_CITY`, que se cargan en Netlify/servidor (solo nombres en `.env.example`). `useLegalHolder()` (lógica pura en `utils/legalHolder.ts`, con pruebas) devuelve el titular; todo texto que lo use se omite si falta el dato. Documentos legales: `data/privacy.ts` (`PRIVACY_UPDATED_AT`) y `data/terms.ts` (`TERMS_UPDATED_AT`, **actualizar al cambiar el texto**), renderizados con la plantilla `LegalDocument`; rutas `/privacidad` y `/terminos-y-condiciones`. Los Términos son un borrador que requiere revisión legal.
- **Contacto**: `POST /api/contact` captura el mensaje por **dos canales**: primero el correo (Resend: `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`) y después el lead en la API (`POST /api/intake/leads` con `NUXT_INTAKE_API_KEY`, hasta 3 reintentos solo ante fallos transitorios; la API es idempotente). Éxito si **al menos uno** capturó el mensaje; solo si fallan ambos se devuelve error y el visitante conserva lo escrito. El formulario exige la casilla de consentimiento (Ley 1581, átomo `Checkbox`); el servidor valida `consent: true` y fija la versión de la política (`PRIVACY_UPDATED_AT` de `data/privacy.ts`; **al cambiar la política, actualizar esa fecha**). Lógica pura y probada en `server/utils/{contactSchema,contactFlow,leadIntake}.ts`. Sin API o sin clave, solo se envía el correo. Los registros no incluyen datos personales.

## Convenciones

- **Nombres en inglés, siempre.** Ningún archivo, carpeta, componente, composable, tipo, constante ni ruta de API se nombra en español. El español es solo para el copy visible y la documentación. Las URL públicas pueden seguir en español por SEO (`/portafolio`, `/como-trabajo`, `/privacidad`) definiéndolas con `definePageMeta({ path })` o `routeRules`, con el archivo en inglés. Deuda de nombres de páginas pagada (nov-2026): las URL públicas en español se definen con `definePageMeta({ path })` (`pages/how-we-work.vue`, `pages/privacy.vue`, `pages/portfolio/`); las rutas del panel van en inglés (`/admin/{team,experience,leads,projects,rates,testimonials}`). Renombra las claves/IDs en español de `constants/` y `data/` que se detecten al tocarlos.
- **Frontend: Atomic Design obligatorio y pixel perfect.** Todo UI nuevo se construye como átomos → moléculas → organismos → plantillas → páginas; si un fragmento se repite o tiene identidad propia, se **componentiza** (no se duplica marcado). Se implementa **fiel al diseño** (espaciados, tipografía, radios, sombras, colores y estados exactos de `docs/brand-system.md` y de la referencia visual), revisado en el navegador en móvil y escritorio antes de cerrar. Los componentes del panel (`components/admin/`) siguen la misma jerarquía.
- Prettier + ESLint (config en repo); `<script>` indentado dentro de `.vue`. Respetar `.prettierrc`.
- Clases Tailwind canónicas v4 y tokens `brand-*`; seguir `docs/brand-system.md` para jerarquía tipográfica y contraste.
- Accesibilidad: `min-h-11` en objetivos táctiles, `focus-visible`, `aria-hidden` en iconos decorativos.
- Texto de UI en español, tono cercano y orientado al negocio (no jerga técnica en el copy).
- Imágenes en `public/` (webp); usar `NuxtImg`. Las de proyectos van en `public/projects/<slug>/` con las medidas de `docs/portfolio-guide.md` (portada 1280×720 ≤100 KB, galería 1600×900 ≤150 KB, 3–6 por proyecto, og 1200×630 jpg). `tests/publicImages.test.mjs` hace cumplir ≤150 KB y ≤1920 px.
- Commits en español, descriptivos y cortos (ver `git log`).

## Seguridad de cabeceras

- `routeRules` en `nuxt.config.ts` añade `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS y un CSP mínimo (`frame-ancestors`, `base-uri`, `form-action`, `object-src`). Zonas privadas llevan `no-store` y `X-Robots-Tag`. El CSP completo (script/connect-src) queda pendiente.
- El servidor de desarrollo escucha solo en `localhost` (no en toda la red).

## Calidad antes de integrar

- **Auditoría de dependencias:** el CI ejecuta `npm run audit:ci` (`scripts/audit.mjs`), que falla ante cualquier aviso alto o crítico salvo los aceptados en `scripts/audit-allowlist.json` (con motivo y fecha de vencimiento; al vencer vuelve a bloquear). Excepción vigente: `GHSA-fc5q-39xc-vjpf` (`picomatch`, ReDoS; sin parche publicado; solo herramientas de build, no está en `.output`), revisar antes del 2026-12-15. Nunca usar `npm audit fix --force` (sugiere degradar Nuxt).
- Además de lint, build y tests: abrir la home en `npm run dev` y revisar que la consola no muestre avisos de Vue ni "Hydration mismatch". Un import perdido (p. ej. `Section`) no rompe la página a la vista pero sí genera errores de hidratación.
- Lighthouse (referencia nov-2026, build local): móvil 68–80 (varía por corrida) / escritorio 98–99 en rendimiento; accesibilidad, buenas prácticas y SEO en 100. Imágenes de `public/` ≤ ~100 KB y ≤ 1920 px de ancho.

## Contrato de API

- La API del panel y el esquema de datos viven en el repositorio hermano **`../migueljalvarez-api`** (NestJS + PostgreSQL; ver su `AGENTS.md`, `docs/dashboard-scope.md` y `docs/openapi-panel.yaml`). Este sitio la consumirá desde el servidor (Nitro), nunca desde el navegador. El contrato de este archivo (`openapi.yaml`) sigue cubriendo solo los endpoints de `server/api`.
- `docs/openapi.yaml` (OpenAPI 3.1) documenta todos los endpoints `/api/*` y es el contrato que debe cumplir el futuro backend Nest. Al agregar o cambiar un endpoint hay que actualizarlo: `tests/openapiContract.test.mjs` falla si un archivo de `server/api` no está documentado (o al revés).

## SEO

- Metadatos por página con `usePageSeo()` (`composables/useSiteSeo.ts`): título, descripción, canonical, Open Graph y Twitter. La URL base sale de `NUXT_PUBLIC_BASE_URL` (obligatoria en producción: `https://migueljalvarez.com`); nunca usar `window` para calcularla.
- `/robots.txt` y `/sitemap.xml` son rutas de servidor (`server/routes/`). El robots bloquea todo si la URL base es local. El sitemap excluye proyectos `in-development`.
- Páginas privadas (`/login`, `/dashboard/*`) llevan `noindex`. JSON-LD (Person + ProfessionalService) en la home.

## Código retirado a propósito

- Se eliminó todo lo que ninguna página usaba (nov-2026): componentes (Hero, Avatar, Badge, Footer, Card, AvatarCard, Blockquote, carruseles, HeroVisual, HeroCurve, Testimonial, PortfolioItem), `DynamicTable`, composables sin uso, los endpoints `/api/testimonials`, `/api/me` y `/api/socialMedia`, `firebase-admin` y todo el código/variables de Firebase, las 6 páginas del dashboard viejo, la configuración de Cloudinary, la fuente IBM Plex Mono y los logos/cursos de `public/`. Quedan en el historial de git si se necesitan.
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
2. Nunca leer, imprimir ni commitear valores de `.env` (Resend, sesión admin). Solo nombres de variables.
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

## Antes de reemplazar `main` (publicar)

- **NOTA (decisión del autor, 18-nov-2026): por ahora no se activa el segundo factor (OTP) del panel.** La opción sigue en el código (`AUTH_REQUIRE_TOTP`, obligatorio por defecto; la API no arranca con `false` fuera de `APP_ENV=local`). Publicar sin OTP exige antes una decisión explícita y cambiar esa regla de la API; mientras tanto, contraseña larga y única, límite de intentos y, idealmente, Cloudflare Access delante de la API. Con OTP: `true` en el servidor, administrador real con `npm run admin:create` y códigos de recuperación guardados.

El checklist completo vive en Notion (página "Checklist antes de reemplazar main"). Resumen: repo público/privado decidido, variables de entorno cargadas en Netlify, `NUXT_PUBLIC_BASE_URL` definido, revisión legal de `/privacidad`, prueba real del formulario, revisión en teléfono real, Node 22.22.3, contenido de Mi Comodoro y CI en verde. Reemplazar `main` dispara el deploy de producción: solo cuando el autor lo pida.

## Agentes y skills (`.claude/` y espejo `.agents/`)

Subagentes con rol fijo (`.claude/agents/*.md`) y skills alineadas a cada uno (`.claude/skills/<name>/SKILL.md`). `.agents/` es una copia idéntica para otras herramientas: **al editar uno, copiar al otro** (`npm test` falla si difieren). Las skills de diseño y frontend viven solo aquí; la API (`../migueljalvarez-api`) tiene las suyas de backend.

| Agente         | Rol                                                                 | Skills                                                           |
| -------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `architect`    | Valida Atomic Design, capas, público/privado y nombres; solo revisa | `atomic-design`                                                  |
| `design`       | Valida identidad visual, pixel perfect y accesibilidad; solo revisa | `brand-identity`, `ui-ux-principles`, `nuxt-ui`                  |
| `frontend-dev` | Implementa UI componentizada, pixel perfect                         | `atomic-design`, `brand-identity`, `ui-ux-principles`, `nuxt-ui` |
| `refactor`     | Corrige violaciones y deuda de nombres de forma incremental         | `atomic-design`                                                  |
| `review`       | Revisión final de calidad y reglas del proyecto                     | `atomic-design`, `brand-identity`, `ui-ux-principles`            |

`nuxt-ui` es la skill oficial de Nuxt UI v4 (copiada de `finhub-dashboard`); si choca con la identidad, mandan los tokens `brand-*` de `brand-identity`. Flujo: `frontend-dev` → `architect` + `design` → `review`.

## Gestión de pendientes

Plan de trabajo y backlog en Notion (workspace del autor). Base "migueljalvarez.com – Backlog": https://app.notion.com/p/41a3dd9397f681c9ba0fd839c2e4786b (sprints semanales S1–S15 desde el 16-nov-2026, ~5 h/semana; vistas Tablero, Roadmap y Por sprint).

Dirección estratégica: cerrar y publicar v2/landing → endurecer seguridad → SEO/contenido → API propia NestJS + PostgreSQL (repositorio `../migueljalvarez-api`: auth, lecturas públicas, módulos del panel) → conectar el panel `/admin` de este proyecto Nuxt a esa API.

## Panel administrativo (estructura hecha, sin datos reales)

- `/admin/*` (layout `admin`, guarda global `middleware/auth.global.ts`): Menú agrupado: _Contenido del sitio_ (Portafolio —próximamente—, Redes sociales, Políticas, Testimonios) y _Gestión_ (Leads, Proyectos, Equipo y pagos, Tarifas, Experiencia). Redes sociales y Políticas ya están conectadas a la API (`pages/admin/social-links.vue`, `pages/admin/policies.vue`), y también Leads, Proyectos/Clientes y Equipo y pagos (`pages/admin/leads.vue`, `pages/admin/projects.vue`, `pages/admin/team.vue`; composables `useAdminLeads`, `useAdminProjects` y `useAdminTeam`, lógica pura probada en `utils/admin/leads.ts`, `projects.ts` y `team.ts`, componentes en `components/admin/leads/`, `projects/` y `team/`). El menú y los módulos se definen en `constants/admin.ts`. `/dashboard/**` redirige a `/admin`. `/login` usa el layout mínimo `auth`.
- Los datos de ejemplo del panel (`constants/admin.samples.ts`) existen solo en desarrollo, con la etiqueta "Datos de ejemplo"; en producción el panel muestra estados vacíos hasta conectar la API.
- Toda página nueva de `/admin` queda protegida automáticamente por la guarda global.
- **Capa de datos del panel (conectada a la API):** `composables/useAdminSession.ts` (login en dos pasos, sesión, logout), `composables/useAdminApi.ts` (único punto de acceso a la API: `get/post/patch/put/del`, errores como `AdminApiError` con mensaje listo para mostrar, 401 → `/login`) y `utils/adminApiError.ts`. Las pantallas nunca llaman a `$fetch` directamente. Siguen en memoria (`useAdminData`, solo desarrollo): testimonios, tarifas y experiencia; el resumen (`/admin`) todavía cuenta leads y proyectos de los datos de ejemplo.
- **Formularios y acciones ya construidos** (leads con pipeline y notas, testimonios, clientes y proyectos con horas y deadline, equipo con horas y pagos en USD con TRM, tarifas y políticas, experiencia). Validan con Zod (`utils/admin/schemas.ts`, mismos campos que validará la API) y hablan con una sola capa de datos: `composables/useAdminData.ts`. **Hoy esa capa guarda en memoria y solo en desarrollo**; en producción los módulos muestran "Sin API conectada" y las acciones quedan deshabilitadas (`ADMIN_API_CONNECTED` en `constants/admin.ts`). Al conectar la API solo cambia el interior de `useAdminData`.
- Primitivas de UI del panel en `components/admin/` (`AdminInput`, `AdminField`, `AdminDialog` con `<dialog>` nativo, `AdminButton`, `AdminPageHeader`). Importar siempre los componentes de forma explícita.

## Panel administrativo (visión)

Módulos previstos en `/admin` (privado, noindex, Supabase Auth, un solo admin): leads (captura del formulario + alta manual + pipeline), testimonios (solicitud por correo con enlace único → aprobación), políticas y tarifas, clientes y proyectos, equipo (horas pactadas y pagos pendientes; solo el admin registra), experiencia profesional y, a futuro, generador de CV ATS por vacante (usa solo hechos de la base de experiencia, sin inventar).

**Posicionamiento**: el sitio público proyecta a un profesional que presta servicios, no a alguien que busca empleo. No exponer CV ni experiencia laboral públicamente.

## Deuda técnica conocida (a priorizar en el plan)

- **Nombres en español pendientes de renombrar** (sin cambiar el copy visible): claves de `data/services.ts` (`situacion`, `titulo`, `paraQuien`, `comoAyudo`, `queRecibes`, `etiquetas`, `fases`) y de `data/work.ts` (`titulo`, `texto`, `nota`, `pregunta`, `respuesta`); los literales `'cliente'`/`'propio'` y las etiquetas de `PortfolioFilter` en `types/portfolio.ts` y `utils/portfolioFilters.ts` (separar el id de la etiqueta visible).

- **Auth del panel:** la resuelve la API (`../migueljalvarez-api`): contraseña (argon2id) + TOTP, sesión `admin_session` HttpOnly. El sitio ya **no guarda credenciales de administrador** (se retiraron `ADMIN_EMAIL/PASSWORD/SESSION_SECRET` y la sesión provisional). Todo `/api/admin/**` pasa por el proxy `server/api/admin/[...path].ts` (`server/utils/adminProxy.ts`): reenvía solo la cookie `admin_session` y la IP real, valida segmentos de ruta y `Origin`, no sigue redirecciones. Sin `NUXT_API_BASE_URL` o con la API caída responde 503 y el panel lo explica. El usuario se crea en el repo de la API con `npm run admin:create`.
- `server/api/(contact)/contact.ts` ya está endurecido (escape de HTML, límites, honeypot, 5 intentos/10 min por IP en memoria, `runtimeConfig`). Pendiente: rate limit del proveedor y prueba de envío real en preview.
- La web pública ya no depende de ninguna base de datos: puede desplegarse sin esperar a Supabase (la compuerta de publicación sigue siendo decisión del autor).
- Netlify: el build con el preset `netlify` funciona en local (`NITRO_PRESET=netlify npm run build`); pesa 45 MB la función por los iconos de `@nuxt/icon` en modo local (valorar modo `remote` o recorte de colecciones). Falta medir en un deploy preview real.
- Cobertura de tests básica (filtros, mocks, contrato OpenAPI, secretos).

## Problemas conocidos de entorno

- **Node**: Nuxt 4.6 exige Node `^22.22.3 || ^24.15.0 || >=26`. Con 22.12 compila pero avisa "unsupported". Actualizar con `nvm install 22.22.3` (Netlify usa `.nvmrc`).
- `estree-walker@^2.0.2` es dependencia directa a propósito: sin ella `node .output/server/index.mjs` falla con `ERR_PACKAGE_PATH_NOT_EXPORTED` (Nitro no copiaba la v2 anidada de `@vue/compiler-core`). No quitarla.
- **Secretos**: nunca se leen de `process.env` en `nuxt.config.ts` (quedarían escritos en `.output`). Los valores privados de `runtimeConfig` van vacíos y se resuelven en ejecución con `getServerSecret()` (`server/utils/secrets.ts`): primero `NUXT_<CLAVE>` (p. ej. `NUXT_RESEND_API_KEY`) y como respaldo el nombre clásico del `.env` (`RESEND_API_KEY`). `tests/noSecretsInBuild.test.mjs` falla si un secreto del `.env` aparece en `.output`.
- El correo y teléfono de `pages/dashboard/cv.vue` viajan en un chunk JS público aunque la página esté protegida; se retirarán al reconstruir el módulo de CV.
