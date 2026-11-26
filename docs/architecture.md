# Arquitectura del sitio

Detalle técnico que no se deduce del código. Se lee a demanda: las reglas globales están en [AGENTS.md](../AGENTS.md).

## Fuentes de datos

- **Contenido público gestionado desde el panel** (portafolio, redes, políticas, Sobre mí): fuente principal la API, vía `server/utils/publicContent.ts` y `publicApiClient.ts` (`NUXT_API_BASE_URL`). Sin API, con respuesta lenta (2 s) o sin contenido publicado, se usa el respaldo del código (`constants/portfolio.ts`, `MY_SOCIAL_MEDIA`, `ABOUT_FALLBACK` en `constants/common`, `data/work.ts`). Endpoints del sitio: `/api/portfolio`, `/api/portfolio/[slug]`, `/api/social-links`, `/api/policies`, `/api/about`. Caché `swr` corta en producción, ninguna en desarrollo. El mapeo es puro y está probado en `utils/publicContent.ts`.
- **Sobre mí**: `GET /api/about` solo se sirve publicado y con al menos una imagen (el mapeo acepta cero imágenes si hay cargo o nombre). La plantilla recibe únicamente `content`, omite todo bloque sin datos y usa consultas de contenedor (`@container`) para que la vista previa del panel sea fiel. La API solo registra rutas de imagen (`/about/<slug>.webp` en `public/about/`); no sube archivos.
- **Portafolio**: solo productos propios y trabajos reales de clientes. El listado y la ficha usan `PortfolioList` y `ProjectDetail` (lógica pura en `utils/portfolioList.ts`; el diseño está en `docs/portfolio-guide.md`); la home usa `PortfolioSection` (envuelve a `PortfolioList`; conserva el nombre por el hook de prefetch). Los mocks (`constants/portfolio.mock.ts`) se activan solo en desarrollo; `tests/portfolioMocks.test.mjs` revisa que no lleguen a `.output`. Para ver solo datos reales: `npm run build && npm run preview`.
- **Testimonios**: no hay sección pública hasta que exista uno real aprobado.
- **Titular legal** (Términos y Privacidad): los datos nunca van en el repositorio ni en `runtimeConfig.public` (se serializaría en el HTML de todas las páginas). Llegan por `NUXT_PUBLIC_LEGAL_NAME`, `_ID_TYPE` (`CC` | `NIT`), `_ID_NUMBER`, `_EMAIL` y `_CITY`, que `server/api/legal.get.ts` lee en ejecución; `await useLegalHolder()` (`utils/legalHolder.ts`) los pide solo en Términos y Privacidad y todo texto que los use se omite si faltan. Contacto y pie no los usan (la ubicación es `HOME_COPY.contact.location`). Al cambiar `data/privacy.ts` o `data/terms.ts`, actualizar `PRIVACY_UPDATED_AT` / `TERMS_UPDATED_AT` (la fecha de privacidad también se guarda con cada consentimiento). Los Términos son un borrador sin revisión legal. Las páginas legales no pueden prerenderizarse: el titular es de runtime.
- **Contacto**: `POST /api/contact` captura por dos canales: primero correo (Resend: `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`) y luego lead en la API (`POST /api/intake/leads` con `NUXT_INTAKE_API_KEY`, idempotente, reintenta solo fallos transitorios). Éxito si al menos uno funcionó. Exige `consent: true`. Sin API o sin clave, solo correo. Lógica en `server/utils/{contactSchema,contactFlow,leadIntake}.ts`.
- **Comentarios de Mi Despensa** (`/admin/feedback`, solo lectura): el panel llama a `GET /api/admin/despensa/{ping,feedback}` (`server/api/admin/despensa/`), que exige sesión de administrador y llama desde el servidor a la API de administración de Mi Despensa con `NUXT_MI_DESPENSA_API_URL` y `NUXT_MI_DESPENSA_ADMIN_KEY` (también valen `MI_DESPENSA_API_URL` / `MI_DESPENSA_ADMIN_KEY`; la llave es la `ADMIN_API_KEY` de ese servidor). La llave nunca va al navegador, al código ni al build (`tests/despensa.test.mjs` y `tests/noSecretsInBuild.test.mjs`). Sus errores salen como 502/429/503, nunca 401 (el panel lo toma por sesión vencida). En desarrollo sin variables responde con datos simulados (`server/utils/despensaMock.ts`, no entra en producción). Contrato de esa API: `docs/api-admin.md` del repositorio de Mi Despensa.
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

## Conteo anónimo de clics

- **Conteo anónimo de clics**: la directiva `v-track` (`plugins/track.ts`, universal; lógica pura en `utils/track.ts`, lista cerrada de IDs en `constants/track.ts`, igual que en la API) envía con `sendBeacon` a `POST /api/track` (`server/api/track.post.ts`, `server/utils/track.ts`), que valida estricto, ignora bots y limita por IP (HMAC con sal por proceso) y reenvía a `POST /api/intake/events` de la API con la clave de intake (mejor esfuerzo, siempre 204). Sin cookies; no cambiar el enlace de WhatsApp. Un botón nuevo = añadir su ID en `constants/track.ts`, en la API (CHECK de la migración) y en `utils/admin/analytics.ts` (etiqueta). En componentes con `v-track`, los booleanos de `Button` van como `:on-dark="true"` (el atributo `on-dark` sin valor se pierde en el SSR y rompe la hidratación). La única escritura en `localStorage` es la marca `mj_no_track` del interruptor «No contar mis visitas» del panel (`useNoTrack`); `useTrack` solo la lee. La tarjeta «Clics por botón» del Resumen vive en `components/admin/analytics/`.

## Convenciones (detalle)

- **Nombres en inglés** para archivos, carpetas, componentes, composables, tipos, constantes y rutas de API. El español es solo copy y documentación. Las URL públicas pueden ir en español por SEO (`/portafolio`, `/como-trabajo`, `/privacidad`, `/terminos-y-condiciones`, `/testimonio/:token`) con `definePageMeta({ path })`; el archivo se queda en inglés.
- **Atomic Design obligatorio**: atoms → molecules → organisms → templates → pages. Lo que se repite o tiene identidad propia se componentiza. Cada carpeta tiene `index.ts` y su `.d.ts` de tipos. Los componentes del panel (`components/admin/`) siguen la misma jerarquía y se importan de forma explícita.
- **Pixel perfect** contra `docs/brand-system.md`: espaciados, tipografía, radios, sombras, colores y estados; revisar en móvil y escritorio.
- Tokens `brand-*` y clases Tailwind v4 canónicas. Trampa: `outline-none` y `outline-hidden` anulan `focus-visible:outline-2`.
- Accesibilidad: `min-h-11` en objetivos táctiles, `focus-visible`, `aria-hidden` en iconos decorativos.
- Imágenes de `public/` en webp con `NuxtImg` (SVG de marca como `<img>`: ipx los convierte a webp). Medidas y pesos en `docs/portfolio-guide.md` y `docs/about-guide.md`; `tests/publicImages.test.mjs` hace cumplir ≤150 KB y ≤1920 px.
- Imágenes de contenido editable (Sobre mí, portada/galería de proyectos, vista previa del panel): siempre `ImageWithFallback` (molécula), nunca `NuxtImg` suelto. Si falta `src` o falla la carga muestra `ImagePlaceholder` (átomo, hexágonos de marca sin texto). El contenedor fija posición y proporción; `alt` vacío = decorativo. Sobre mí sin fotos conserva la tarjeta solo con cargo o nombre. `tests/imagePlaceholder.test.mjs`.
- Copy cercano, en primera persona, orientado al negocio; sin jerga ni tono de búsqueda de empleo.
- Prettier + ESLint del repositorio. No formatear en masa ni revertir cambios ajenos.
