# AGENTS.md

Guía para agentes de IA en este repositorio. Se usa `AGENTS.md`; no se usa `CLAUDE.md`.

## Proyecto

Sitio de captación de clientes de Miguel Álvarez (desarrollador independiente, Medellín): landing, portafolio, cómo trabajo, contacto, páginas legales y un panel privado `/admin`. Idioma de la UI y del copy: español. Nombres de código: inglés.

El backend es el repositorio hermano `../migueljalvarez-api` (NestJS + PostgreSQL). El sitio lo consume solo desde Nitro, nunca desde el navegador.

## Notion

Tareas, estado de sprint, decisiones y pendientes viven en Notion, no en este repositorio.

- Base "migueljalvarez.com – Backlog": https://app.notion.com/p/41a3dd9397f681c9ba0fd839c2e4786b
- Estados: `Hecho` = terminado y verificado sin publicar; `Desplegado` = ya en producción. Actualizar tras cada iteración.
- Aquí se documenta solo lo que no se deduce del código.

## Comandos

```bash
npm ci
npm run dev        # http://localhost:3000 (si está ocupado: PORT=3333 npm run dev, y ajusta NUXT_PUBLIC_BASE_URL)
npm run build
npm run lint
npm test           # node --test sobre tests/*.mjs; algunos revisan .output tras un build
npm run audit:ci   # falla ante avisos altos o críticos no aceptados en scripts/audit-allowlist.json
```

Node `^22.22.3 || ^24.15.0 || >=26` (`.nvmrc`). Para probar el build: `npm run build && node --env-file=.env .output/server/index.mjs`.

Antes de cerrar una tarea: `npm run lint`, `npm test` y `npm run build`. Si toca UI, abrir la home en `npm run dev` y comprobar que la consola no muestre avisos de Vue ni "Hydration mismatch" (un import perdido no rompe la vista pero sí hidrata mal).

## Ramas y publicación

- **`main` es producción**: cada push a `main` despliega el sitio en Netlify. **`develop`** es la rama de integración y nace de `main`. Toda funcionalidad o corrección sale de `develop` en una rama `feat/*` o `fix/*`, se integra de vuelta en `develop` con merge local `--no-ff` y de `develop` pasa a `main` (merge sin forzar) solo cuando el autor lo pida. **Tras integrar una rama `feat/*` o `fix/*` en `develop`, se borra** (local y, si se subió, remota; `git branch -d`, que se niega si faltara algo).
- El push de `develop` y de las ramas `feat/*` / `fix/*` está permitido. No hacer push a `main`, push forzado, PR a `main` ni deploy sin petición explícita. Una urgencia en producción sale de `main` como `fix/*`, se integra en `main` y se trae de vuelta a `develop`.
- Commits en español, cortos. Sin líneas de atribución de Claude (`Co-Authored-By`, "Generated with Claude Code").
- El repositorio de GitHub es público: nada de datos personales (teléfono, correo, CV) ni secretos. El CV y documentos personales viven en `.private/` (ignorado) y no se sirven desde `public/`.
- **Nunca versionar:** `.env` con valores reales, credenciales (R2, intake, claves, tokens), datos personales (CV, teléfono, correo, documento), respaldos y volcados (`*.dump`, `backups/`), paquetes (`*.bundle`, `*.zip`), capturas (`shots/`), imágenes de prueba, logs y cookies de sesión. Tests y ejemplos usan valores inventados (`ejemplo@example.com`, `573000000000`). Antes de cada commit: `git status` y `git diff --staged --stat`. Lo que ya esté en el historial se reporta, no se reescribe.

- **Conteo anónimo de clics**: la directiva `v-track` (`plugins/track.ts`, universal; lógica pura en `utils/track.ts`, lista cerrada de IDs en `constants/track.ts`, igual que en la API) envía con `sendBeacon` a `POST /api/track` (`server/api/track.post.ts`, `server/utils/track.ts`), que valida estricto, ignora bots y limita por IP (HMAC con sal por proceso) y reenvía a `POST /api/intake/events` de la API con la clave de intake (mejor esfuerzo, siempre 204). Sin cookies; no cambiar el enlace de WhatsApp. Un botón nuevo = añadir su ID en `constants/track.ts`, en la API (CHECK de la migración) y en `utils/admin/analytics.ts` (etiqueta). En componentes con `v-track`, los booleanos de `Button` van como `:on-dark="true"` (el atributo `on-dark` sin valor se pierde en el SSR y rompe la hidratación). La única escritura en `localStorage` es la marca `mj_no_track` del interruptor «No contar mis visitas» del panel (`useNoTrack`); `useTrack` solo la lee. La tarjeta «Clics por botón» del Resumen vive en `components/admin/analytics/`.

## Convenciones

- **Nombres en inglés** para archivos, carpetas, componentes, composables, tipos, constantes y rutas de API. El español es solo copy y documentación. Las URL públicas pueden ir en español por SEO (`/portafolio`, `/como-trabajo`, `/privacidad`, `/terminos-y-condiciones`, `/testimonio/:token`) con `definePageMeta({ path })`; el archivo se queda en inglés.
- **Atomic Design obligatorio**: atoms → molecules → organisms → templates → pages. Lo que se repite o tiene identidad propia se componentiza. Cada carpeta tiene `index.ts` y su `.d.ts` de tipos. Los componentes del panel (`components/admin/`) siguen la misma jerarquía y se importan de forma explícita.
- **Pixel perfect** contra `docs/brand-system.md`: espaciados, tipografía, radios, sombras, colores y estados; revisar en móvil y escritorio.
- Tokens `brand-*` y clases Tailwind v4 canónicas. Trampa: `outline-none` y `outline-hidden` anulan `focus-visible:outline-2`.
- Accesibilidad: `min-h-11` en objetivos táctiles, `focus-visible`, `aria-hidden` en iconos decorativos.
- Imágenes de `public/` en webp con `NuxtImg` (SVG de marca como `<img>`: ipx los convierte a webp). Medidas y pesos en `docs/portfolio-guide.md` y `docs/about-guide.md`; `tests/publicImages.test.mjs` hace cumplir ≤150 KB y ≤1920 px.
- Imágenes de contenido editable (Sobre mí, portada/galería de proyectos, vista previa del panel): siempre `ImageWithFallback` (molécula), nunca `NuxtImg` suelto. Si falta `src` o falla la carga muestra `ImagePlaceholder` (átomo, hexágonos de marca sin texto). El contenedor fija posición y proporción; `alt` vacío = decorativo. Sobre mí sin fotos conserva la tarjeta solo con cargo o nombre. `tests/imagePlaceholder.test.mjs`.
- Copy cercano, en primera persona, orientado al negocio; sin jerga ni tono de búsqueda de empleo.
- Prettier + ESLint del repositorio. No formatear en masa ni revertir cambios ajenos.

## Identidad visual

Detalle en `docs/brand-system.md`. Reglas que se rompen con facilidad:

- Azul marino (`brand-navy`) protagonista; superficies claras `brand-surface`; alternancia de bandas oscuras (hero, proceso, contacto) y claras.
- Ámbar `brand-warm` (#F5B544) solo sobre oscuro y `brand-warm-ink` (#8A4B00) sobre claro, como único acento cálido. Es acento (hexágonos, checks, subrayados) y el color del **botón principal sobre fondo oscuro** (texto `brand-navy`); nunca fondos de áreas grandes. Sobre fondo claro el botón principal es navy (`brand-accent`). WhatsApp siempre verde (`wa`).
- Tokens semánticos por función en `assets/css/main.css` (`surface`, `surface-alt`, `surface-inverse`, `text`, `text-muted`, `brand`, `accent`, `accent-ink`, `logo-blue`, `tint`, `wa`): alias de los `brand-*`; el comentario del archivo lista los pares fondo/texto válidos. Enlaces, etiquetas y foco sobre fondo claro usan `logo-blue`. Nada de colores hex sueltos en componentes (lo hace cumplir `tests/colorTokens.test.mjs`).
- **Logos**: siempre `AppLogo` (`components/atoms/AppLogo`), que elige la variante por fondo (`surface="light"` color, `"dark"` blanco) y por tipo (`full` con tagline, `compact` sin tagline; header y pie usan `compact`). Sobre foto o degradado, solo el blanco y con capa oscura. Espacio libre mínimo: la altura del hexágono. Los SVG compactos (`brand-compact*.svg`) salen de los originales quitando el tagline: no editarlos a mano.
- Verde solo para estados y WhatsApp.
- Sombras de tres niveles (plano por defecto): tokens `shadow-card`, `shadow-card-lg`, `shadow-dialog`, `shadow-header`. Ritmo vertical de bandas `py-12 md:py-16`.
- Motivo gráfico: hexágonos. El logo del pie se conserva aunque se repita.

## Fuentes de datos

- **Contenido público gestionado desde el panel** (portafolio, redes, políticas, Sobre mí): fuente principal la API, vía `server/utils/publicContent.ts` y `publicApiClient.ts` (`NUXT_API_BASE_URL`). Sin API, con respuesta lenta (2 s) o sin contenido publicado, se usa el respaldo del código (`constants/portfolio.ts`, `MY_SOCIAL_MEDIA`, `ABOUT_FALLBACK` en `constants/common`, `data/work.ts`). Endpoints del sitio: `/api/portfolio`, `/api/portfolio/[slug]`, `/api/social-links`, `/api/policies`, `/api/about`. Caché `swr` corta en producción, ninguna en desarrollo. El mapeo es puro y está probado en `utils/publicContent.ts`.
- **Sobre mí**: `GET /api/about` solo se sirve publicado y con al menos una imagen (el mapeo acepta cero imágenes si hay cargo o nombre). La plantilla recibe únicamente `content`, omite todo bloque sin datos y usa consultas de contenedor (`@container`) para que la vista previa del panel sea fiel. La API solo registra rutas de imagen (`/about/<slug>.webp` en `public/about/`); no sube archivos.
- **Portafolio**: solo productos propios y trabajos reales de clientes. Los mocks (`constants/portfolio.mock.ts`) se activan solo en desarrollo; `tests/portfolioMocks.test.mjs` revisa que no lleguen a `.output`. Para ver solo datos reales: `npm run build && npm run preview`.
- **Testimonios**: no hay sección pública hasta que exista uno real aprobado.
- **Titular legal** (Términos y Privacidad): los datos nunca van en el repositorio ni en `runtimeConfig.public` (se serializaría en el HTML de todas las páginas). Llegan por `NUXT_PUBLIC_LEGAL_NAME`, `_ID_TYPE` (`CC` | `NIT`), `_ID_NUMBER`, `_EMAIL` y `_CITY`, que `server/api/legal.get.ts` lee en ejecución; `await useLegalHolder()` (`utils/legalHolder.ts`) los pide solo en Términos y Privacidad y todo texto que los use se omite si faltan. Contacto y pie no los usan (la ubicación es `HOME_COPY.contact.location`). Al cambiar `data/privacy.ts` o `data/terms.ts`, actualizar `PRIVACY_UPDATED_AT` / `TERMS_UPDATED_AT` (la fecha de privacidad también se guarda con cada consentimiento). Los Términos son un borrador sin revisión legal. Las páginas legales no pueden prerenderizarse: el titular es de runtime.
- **Contacto**: `POST /api/contact` captura por dos canales: primero correo (Resend: `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`) y luego lead en la API (`POST /api/intake/leads` con `NUXT_INTAKE_API_KEY`, idempotente, reintenta solo fallos transitorios). Éxito si al menos uno funcionó. Exige `consent: true`. Sin API o sin clave, solo correo. Lógica en `server/utils/{contactSchema,contactFlow,leadIntake}.ts`.
- **Modo mantenimiento** (`server/middleware/maintenance.ts`): en producción con `NUXT_API_BASE_URL`, antes de cada página consulta `GET /api/health` (caché 15 s si responde, 5 s si no, un reintento). Si cae, responde 503 con página autocontenida (`Retry-After: 60`, `noindex`). Excluye estáticos, `/api/*`, `robots.txt` y `sitemap.xml`. No actúa en desarrollo. Si la API responde pero no tiene contenido, se usa el respaldo.

## Rendimiento

- La home carga las secciones bajo el pliegue con `utils/lazySection.ts` (hidratación al ser visibles, el HTML sigue completo en SSR). El hook `build:manifest` de `nuxt.config.ts` quita el prefetch de zonas privadas y depende de los nombres de chunk `Services`, `ProcessSection`, `PortfolioSection`, `About` y `Contact`: si renombras esos componentes, actualiza el hook.
- Importar plantillas por ruta directa, no por el barrel `components/templates` (arrastra zod a la home). `/` usa `swr: 60` solo en producción.

## Seguridad

- `routeRules` en `nuxt.config.ts` añade cabeceras (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS) y un CSP mínimo. Las zonas privadas llevan `no-store` y `X-Robots-Tag`.
- **Secretos**: nunca leer, imprimir ni commitear valores de `.env`; solo nombres (`.env.example`). No se leen de `process.env` en `nuxt.config.ts` (quedarían escritos en `.output`): `getServerSecret()` (`server/utils/secrets.ts`) los resuelve en ejecución, primero `NUXT_<CLAVE>` y como respaldo el nombre clásico. `tests/noSecretsInBuild.test.mjs` falla si uno aparece en `.output`.
- `estree-walker@^2.0.2` es dependencia directa a propósito: sin ella `node .output/server/index.mjs` falla con `ERR_PACKAGE_PATH_NOT_EXPORTED`. No quitarla.
- Dependencias: nunca `npm audit fix --force` (propone degradar Nuxt).

## SEO

`usePageSeo()` (`composables/useSiteSeo.ts`) fija título, descripción, canonical, Open Graph y Twitter. La URL base sale de `NUXT_PUBLIC_BASE_URL` (obligatoria en producción: debe ser la dirección que Netlify sirve como dominio principal, hoy `https://www.migueljalvarez.com`; el proxy del panel y el envío de testimonios comparan `Origin` con ella, y el canonical y el sitemap la usan); nunca usar `window` para calcularla. `robots.txt` bloquea todo si la base es local, y por eso Lighthouse mide SEO bien solo con la base de producción. Las páginas privadas llevan `noindex`.

## Contrato con la API

- `docs/openapi.yaml` documenta los endpoints `/api/*` de `server/api`; `tests/openapiContract.test.mjs` falla si un endpoint no está documentado (o al revés). Al cambiar un endpoint, actualizarlo.
- La API del panel y su contrato (`docs/openapi-panel.yaml`) viven en `../migueljalvarez-api`.
- Panel `/admin` (layout `admin`, guarda global `middleware/auth.global.ts`): toda llamada pasa por `composables/useAdminApi.ts` (nunca `$fetch` directo) y por el proxy `server/api/admin/[...path].ts`, que reenvía solo la cookie `admin_session`, valida segmentos y `Origin`, no sigue redirecciones y responde 503 si la API cae. Las rutas del panel van en inglés. El menú y los módulos se definen en `constants/admin.ts`. El envío de solicitudes de testimonio tiene endpoint propio (`server/api/admin/testimonial-requests/send.post.ts`, prioridad sobre el proxy).
- Los formularios del panel validan con Zod; la lógica pura vive en `utils/admin/*.ts` con pruebas.

## Agentes y skills

Subagentes en `.claude/agents/*.md` y skills en `.claude/skills/<name>/SKILL.md`; `.agents/` es copia idéntica (al editar uno, copiar al otro; `npm test` falla si difieren). Flujo: `frontend-dev` → `architect` + `design` → `review`; `refactor` corrige deuda de nombres o arquitectura. Si `nuxt-ui` choca con la identidad, mandan los tokens `brand-*`.

## Reglas para agentes

1. No modificar nada fuera del alcance pedido ni revertir o formatear en masa trabajo ajeno.
2. No crear `CLAUDE.md`.
3. Verificar UI en una copia o puerto distinto al `:3000` del autor. En un worktree con `node_modules` enlazado (junction), borrar el junction con `cmd /c rmdir` antes de `git worktree remove`.
