# migueljalvarez.com

Sitio de Miguel Álvarez, desarrollador de software independiente: landing, portafolio, cómo trabajo, contacto, páginas legales y un panel privado en `/admin`. Se despliega en Netlify y consume la API de [`migueljalvarez-api`](../migueljalvarez-api) desde su servidor (Nitro). Sin la API funciona con contenido de respaldo.

Nuxt 4 (SSR) · Vue 3 · TypeScript · Nuxt UI 4 · Tailwind CSS 4 · Resend · Zod.

## Levantarlo

Requiere Node `^22.22.3 || ^24.15.0 || >=26` (ver `.nvmrc`) y npm 10 o superior.

```bash
npm ci
cp .env.example .env   # completa los valores; nunca subas .env
npm run dev            # http://localhost:3000
```

Si el puerto 3000 está ocupado: `PORT=3333 npm run dev` (ajusta `NUXT_PUBLIC_BASE_URL`).

## Probarlo

```bash
npm run lint
npm test
npm run build
```

Para ejecutar el build de producción: `node --env-file=.env .output/server/index.mjs`. El CI (`.github/workflows/ci.yml`) corre lint, build, tests y la auditoría de dependencias.

## Variables de entorno

Los nombres están en [.env.example](.env.example). Los secretos se leen en ejecución, no quedan dentro del build; cada uno acepta su nombre clásico (`RESEND_API_KEY`) o la versión con prefijo `NUXT_` (`NUXT_RESEND_API_KEY`), que tiene prioridad. Los datos del titular legal (`NUXT_PUBLIC_LEGAL_*`) se cargan en Netlify, no en el repositorio.

## Desplegarlo

Netlify, con `netlify.toml` (preset `netlify` de Nitro, Node 22.22.3). Definir las variables de `.env.example` en Netlify antes del primer deploy; `NUXT_PUBLIC_BASE_URL` se lee al compilar. Reemplazar la rama `main` dispara el deploy de producción.

Convenciones, flujo de ramas y reglas para agentes: [AGENTS.md](AGENTS.md). Contrato de la API del sitio: [docs/openapi.yaml](docs/openapi.yaml). Sistema de marca: [docs/brand-system.md](docs/brand-system.md).
