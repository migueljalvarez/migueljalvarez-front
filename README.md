# migueljalvarez.com

Sitio web de **Miguel Álvarez**, ingeniero de sistemas y desarrollador de software independiente.
Es una página de captación de clientes (landing, portafolio, cómo trabajo y contacto) y, más adelante,
un panel privado en `/admin` para gestionar leads, testimonios, proyectos, equipo y pagos.

> **Estado:** en desarrollo (`v2/landing`). No se publica hasta que la base de datos esté lista.
> Contexto completo para personas y agentes de IA: [AGENTS.md](AGENTS.md).

## Stack

Nuxt 4 (SSR) · Vue 3 · TypeScript · Nuxt UI 4 · Tailwind CSS 4 · Nitro (`server/api`) ·
Resend · Zod · (sin base de datos por ahora; llegará con Supabase y luego un backend propio) ·
Netlify.

## Requisitos

- Node `^22.22.3 || ^24.15.0 || >=26` (ver `.nvmrc`; con `nvm install 22.22.3`).
- npm 10 o superior.

## Primeros pasos

```bash
npm ci                      # instala dependencias
cp .env.example .env        # completa los valores (nunca subas .env)
npm run dev                 # http://localhost:3000
```

Si el puerto 3000 está ocupado, usa uno temporal: `PORT=3333 npm run dev` (ajusta
`NUXT_PUBLIC_BASE_URL` si lo necesitas).

## Scripts

| Comando          | Qué hace                                          |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Servidor de desarrollo (con proyectos de ejemplo) |
| `npm run build`  | Compila para producción                           |
| `npm run lint`   | ESLint                                            |
| `npm run format` | Prettier                                          |
| `npm test`       | Tests (`node --test`)                             |

Para probar el build de producción en local:
`npm run build && node --env-file=.env .output/server/index.mjs`.

## Variables de entorno

Los nombres están en [.env.example](.env.example). Los secretos se leen **en ejecución** (no quedan
dentro del build): puedes usar el nombre clásico (`RESEND_API_KEY`) o su versión con prefijo `NUXT_`
(`NUXT_RESEND_API_KEY`), que tiene prioridad.

## Estructura

```
pages/         rutas (landing, cómo trabajo, portafolio, privacidad, login, dashboard)
components/    atoms · molecules · organisms · templates (diseño atómico)
server/api/    endpoints /api/* (contrato en docs/openapi.yaml)
server/utils/  sesión admin, secretos, IP del cliente
constants/     copy y datos del sitio (portafolio real + mock solo en dev)
data/          servicios, "cómo trabajo", política de privacidad
docs/          openapi.yaml, sistema de marca
tests/         tests de filtros, mocks, contrato de API y secretos en el build
```

## Calidad

- `npm run lint`, `npm run build` y `npm test` deben pasar antes de integrar cambios.
- La consola del navegador no debe mostrar avisos de Vue ni errores de hidratación.
- CI (GitHub Actions) ejecuta lint, build, tests y `npm audit --audit-level=high`.

## Despliegue (Netlify)

`netlify.toml` está preparado (preset `netlify` de Nitro, `publish = "dist"`, Node 22.22.3). Antes de
publicar: definir las variables de entorno en Netlify, completar la revisión legal de `/privacidad`
y tener lista la base de datos. Ver [AGENTS.md](AGENTS.md) para el flujo de ramas.
