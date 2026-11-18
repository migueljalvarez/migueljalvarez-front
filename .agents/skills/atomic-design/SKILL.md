---
name: atomic-design
description: Estándar de arquitectura de componentes del sitio (Atomic Design), componentización, pixel perfect y reglas de nombres en inglés. Úsala al crear, mover, revisar o refactorizar componentes, composables, páginas o archivos del frontend.
---

# Atomic Design en este sitio

Regla del proyecto: **todo el UI sigue Atomic Design**, se **componentiza** lo que lo amerite y se implementa **pixel perfect**. Nuxt 4 con carpetas en la raíz (sin `app/`).

## Capas

```
components/
  atoms/        Button, Input, Select, Title        — una sola responsabilidad visual, sin lógica de negocio
  molecules/    Header, SocialMedia                 — composición de átomos con un propósito
  organisms/    Section                             — bloques de interfaz completos y reutilizables
  templates/    Main, Services, Portfolio*, About…  — secciones/plantillas de página con su contenido
  admin/        AdminInput, AdminField, AdminDialog… — primitivas del panel (misma jerarquía)
pages/          solo ensamblan templates y definen SEO/ruta
layouts/        default, admin, auth
composables/    acceso a datos y lógica reutilizable (useAdminData, useEmail, usePageSeo…)
```

- Cada capa tiene `index.ts` (exports) y `.d.ts` de tipos. Un componente por carpeta: `Button/Button.vue`.
- Un componente solo importa de su misma capa o de las inferiores (átomo ← molécula ← organismo ← template ← página). Nunca hacia arriba.
- **Componentizar** cuando: el marcado se repite, tiene identidad propia o tiene estados propios. No crear abstracciones para un uso único sin identidad.
- Importar siempre de forma **explícita**; un import perdido no rompe la vista pero provoca "Hydration mismatch".
- Datos: `$fetch`/`useFetch` no van en componentes; viven en composables o `server/api`. En el panel, solo a través de `useAdminData`.
- Vue 3 `<script setup lang="ts">`; `<script>` indentado dentro de `.vue`; respetar `.prettierrc`.

## Nombres: siempre en inglés

- Ningún archivo, carpeta, componente, composable, tipo, constante ni ruta de API en español. El español queda solo para el copy visible y la documentación.
- Componentes en PascalCase, composables `useX`, utilidades en camelCase.
- Las **URL públicas** pueden seguir en español por SEO (`/portafolio`, `/como-trabajo`, `/privacidad`) usando `definePageMeta({ path })` o `routeRules`, con el archivo en inglés.
- Deuda conocida por renombrar: ver `AGENTS.md` (páginas en español). Lo nuevo no suma deuda.

## Pixel perfect: proceso

1. Obtener la referencia visual (diseño, captura o sección equivalente del sitio).
2. Construir con tokens `brand-*` y clases canónicas de Tailwind v4 (ver skill `brand-identity`); sin números mágicos.
3. Comparar en `npm run dev` a 375, 768, 1366 y 1920 px: espaciados, radios, sombras, tipografía y estados.
4. Revisar la consola: sin avisos de Vue ni "Hydration mismatch".
5. Accesibilidad: `min-h-11`, `focus-visible`, `aria-hidden` en iconos decorativos, `alt` en imágenes.

## Cierre de una tarea

`npm run lint` y `npm test` en verde; para cambios visuales, verificación en el navegador. Commits en español, cortos, sin líneas de atribución. Nada se publica sin petición explícita del autor.
