# AGENTS.md

Reglas globales para agentes de IA en este repositorio. Se usa `AGENTS.md`; no se usa `CLAUDE.md`. Idioma de la UI y del copy: español. Nombres de código: inglés.

## Proyecto

Sitio de captación de clientes de Miguel Álvarez (desarrollador independiente, Medellín): landing, portafolio, cómo trabajo, cómo cobro, guías, contacto, páginas legales y panel privado `/admin`. Negocio y audiencia: [docs/memory/project-brief.md](docs/memory/project-brief.md).

**Stack:** Nuxt 4 (SSR, carpetas en la raíz) · Vue 3 · TypeScript · Tailwind CSS 4 · Nuxt UI 4 (instalado; hoy sin componentes en uso) · Zod · Resend · Netlify. Backend: repositorio hermano `../migueljalvarez-api` (NestJS + PostgreSQL), consumido solo desde Nitro, nunca desde el navegador.

## Dónde leer (solo si la tarea lo toca)

| Tema                                                                                           | Archivo                                                                                        |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Fuentes de datos, contacto, legal, mantenimiento, rendimiento, seguridad, SEO, clics, imágenes | [docs/architecture.md](docs/architecture.md)                                                   |
| Marca, tipografía, color, botones, logos                                                       | [docs/brand-system.md](docs/brand-system.md)                                                   |
| Portafolio y Sobre mí                                                                          | [docs/portfolio-guide.md](docs/portfolio-guide.md), [docs/about-guide.md](docs/about-guide.md) |
| Endpoints `/api/*`                                                                             | [docs/openapi.yaml](docs/openapi.yaml)                                                         |

## Memoria: vive en Notion

Tareas, estado de sprint, decisiones, pendientes y bitácora de sesiones viven en **Notion**, no en este repositorio. No crear bitácoras ni historiales aquí. `docs/memory/` solo guarda contexto estable.

- Base "migueljalvarez.com – Backlog": https://app.notion.com/p/41a3dd9397f681c9ba0fd839c2e4786b
- Estados: `Hecho` = terminado y verificado sin publicar; `Desplegado` = ya en producción. Actualizar tras cada iteración.

## Agentes

Definidos en `.claude/agents/`; cada uno declara sus skills (`.claude/skills/<name>/SKILL.md`). Usar un subagente solo cuando el autor lo pida; si no, aplicar la skill correspondiente en la misma sesión.

| Si la tarea es…                          | Agente              | Escribe código      |
| ---------------------------------------- | ------------------- | ------------------- |
| Implementar UI                           | `frontend-dev`      | Sí                  |
| Revisar arquitectura y nombres           | `architect`         | No                  |
| Revisar identidad visual y accesibilidad | `design`            | No                  |
| Revisión final antes de integrar         | `review`            | No                  |
| Corregir deuda de nombres o capas        | `refactor`          | Sí                  |
| Redactar o editar copy                   | `copy-humanizer`    | Solo con aprobación |
| Auditar SEO o cumplimiento legal         | `seo-legal-auditor` | No                  |

Flujo: `frontend-dev` → `architect` + `design` → `review`. `.agents/` es copia idéntica de `.claude/agents` y `.claude/skills` (al editar uno, copiar al otro; `npm test` falla si difieren). Al cerrar una sesión de trabajo, aplicar la skill `session-compactor`. La skill `nuxt-ui` no se precarga: abrirla solo si se van a usar sus componentes; si choca con la identidad, mandan los tokens `brand-*`.

## Respuestas (ahorro de contexto)

- Mostrar solo diffs o fragmentos modificados, nunca archivos completos, salvo que se pidan.
- Leer solo lo que la tarea necesita; respuestas cortas y en español claro.

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

- **`main` es producción** (cada push despliega en Netlify); **`develop`** es la integración y nace de `main`. Todo sale de `develop` como `feat/*` o `fix/*`, vuelve con merge local `--no-ff` y pasa a `main` (sin forzar) solo cuando el autor lo pida. Tras integrar, la rama se borra (local y remota; `git branch -d`).
- **`main` está protegida en GitHub (también para el dueño)**: solo por pull request con el check `verify` en verde y la rama al día. Para publicar: PR de `develop` a `main`. Urgencia: `fix/*` desde `main` y PR, y traerla de vuelta a `develop`. Saltar la protección: solo el dueño, a mano en Settings → Branches.
- Se puede hacer push de `develop`, `feat/*` y `fix/*`. Sin petición explícita: nada de push a `main`, push forzado, PR a `main` ni deploy.
- Commits en español, cortos, sin líneas de atribución de Claude (`Co-Authored-By`, "Generated with Claude Code").
- **El repositorio es público.** Nunca versionar: `.env` con valores reales, credenciales (R2, intake, claves, tokens), datos personales (CV, teléfono, correo, documento), respaldos y volcados (`*.dump`, `backups/`), paquetes (`*.bundle`, `*.zip`), capturas (`shots/`), imágenes de prueba, logs ni cookies de sesión. Lo personal vive en `.private/` (ignorado), nunca en `public/`. Tests y ejemplos usan valores inventados (`ejemplo@example.com`, `573000000000`). Antes de cada commit: `git status` y `git diff --staged --stat`. Lo que ya esté en el historial se reporta, no se reescribe.

## Convenciones

- **Nombres en inglés** (archivos, carpetas, componentes, composables, tipos, constantes, rutas de API). Las URL públicas pueden ir en español por SEO (`/portafolio`, `/como-trabajo`, `/como-cobro`, `/privacidad`, `/terminos-y-condiciones`, `/testimonio/:token`) con `definePageMeta({ path })`.
- **Atomic Design obligatorio** y **pixel perfect** contra `docs/brand-system.md`, en móvil y escritorio.
- Tokens `brand-*` y clases Tailwind v4 canónicas. Trampa: `outline-none` y `outline-hidden` anulan `focus-visible:outline-2`.
- Accesibilidad: `min-h-11` en objetivos táctiles, `focus-visible`, `aria-hidden` en iconos decorativos.
- Imágenes de `public/` en webp (≤150 KB, ≤1920 px) con `NuxtImg`; las de contenido editable, siempre con `ImageWithFallback`.
- Un botón nuevo con `v-track` exige registrar su ID (ver `docs/architecture.md`).
- Prettier + ESLint del repositorio.

## Tono e identidad

- Copy cercano, en primera persona, con tuteo, orientado al negocio; sin jerga ni tono de búsqueda de empleo.
- Azul marino protagonista, bandas oscuras y claras alternadas, motivo de hexágonos. Logos siempre con `AppLogo`.
- Ámbar `brand-warm` solo como acento sobre oscuro y como **botón principal sobre fondo oscuro** (texto navy); sobre claro, el botón principal es navy. Verde solo para estados y WhatsApp. Sin colores hex sueltos.

## Datos, secretos y contratos

- **Secretos:** nunca leer, imprimir ni commitear valores de `.env`; solo nombres (`.env.example`). Se resuelven en ejecución con `getServerSecret()`, nunca con `process.env` en `nuxt.config.ts`. Los datos del titular legal no van en el repositorio ni en `runtimeConfig.public`.
- Mocks solo en desarrollo; no deben llegar a `.output`. El portafolio muestra solo productos propios y trabajos reales; sin testimonios públicos hasta que haya uno real aprobado.
- Panel: toda llamada pasa por `composables/useAdminApi.ts`.
- SEO: `usePageSeo()` en páginas públicas; `noindex` en las privadas.
- Al cambiar un endpoint de `server/api`, actualizar `docs/openapi.yaml`.
- Dependencias: nunca `npm audit fix --force`; no quitar `estree-walker`.

## Reglas para agentes

1. No modificar nada fuera del alcance pedido ni revertir o formatear en masa trabajo ajeno.
2. No crear `CLAUDE.md`.
3. Verificar UI en una copia o puerto distinto al `:3000` del autor. En un worktree con `node_modules` enlazado (junction), borrar el junction con `cmd /c rmdir` antes de `git worktree remove`.
