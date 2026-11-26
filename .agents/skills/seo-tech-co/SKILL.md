---
name: seo-tech-co
description: Lista de comprobación de SEO técnico y local (Colombia y remoto) para este sitio. Úsala al crear o auditar páginas públicas, metadatos o Schema.org.
---

# SEO del sitio

Base técnica: sección "SEO" de `docs/architecture.md`. Datos estructurados en `utils/seo.ts` y `pages/index.vue`.

## Metadatos

- Toda página pública usa `usePageSeo()`: título único con la marca (≈ 60 caracteres), descripción propia (≈ 155), canonical y Open Graph.
- La URL base sale de `NUXT_PUBLIC_BASE_URL`; nunca de `window`.
- Páginas privadas y con token: `noindex`.

## Estructura

- Un solo `h1` por página; `h2` por sección y `h3` dentro, sin saltar niveles.
- Enlaces internos con texto descriptivo; imágenes con `alt` (vacío si son decorativas).
- Toda página indexable está en el sitemap y recibe al menos un enlace interno.

## Schema.org

- Ya existen `Person` y `ProfessionalService` (home), `BreadcrumbList`, `CreativeWork` y `Article`. Revisar antes de añadir.
- Solo datos visibles y verdaderos. Sin `aggregateRating` ni `review` sin testimonios reales publicados.
- Sin teléfono, correo ni dirección exacta; bastan ciudad y país.
- Validar el JSON-LD en el HTML que genera el SSR.

## Local y remoto

- Intención de búsqueda: desarrollo de software a la medida y consultoría técnica, en Medellín, en Colombia y en remoto para LATAM.
- Mencionar la ubicación con naturalidad; sin repetir palabras clave ni duplicar páginas por ciudad.
- `lang` en español y `areaServed` coherente con el copy.

## Verificación

- `npm test` (`tests/seoStructured.test.mjs`) y `npm run build`.
- Lighthouse solo mide bien el SEO con la base de producción.
- No afirmar posiciones ni volúmenes de búsqueda sin una fuente.
