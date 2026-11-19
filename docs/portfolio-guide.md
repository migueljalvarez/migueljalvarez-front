# Guía del portafolio: qué mostrar y cómo preparar las imágenes

Esta guía define qué debe tener cada proyecto para convencer a un cliente o visitante y las medidas
exactas de las imágenes. Los datos viven en `constants/portfolio.ts` (tipo `PortfolioType` en
`types/common/index.d.ts`). La ficha pública es `pages/portfolio/[slug].vue`.

**Regla de oro:** solo se muestra lo real y verificable. Si no hay dato, el campo se omite; la ficha
no muestra secciones vacías. Nada de cifras, clientes ni capturas inventados.

## 1. Qué busca un cliente (en este orden)

| #   | Pregunta del cliente             | Dónde se responde en la ficha                         | Campo                                       |
| --- | -------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| 1   | ¿Qué es y para quién?            | Encabezado: título y resumen de 1–2 frases            | `title`, `description`                      |
| 2   | ¿Qué papel tuvo Miguel y cuándo? | Datos rápidos: tipo, rol, año, duración               | `portfolioType`, `role`, `year`, `duration` |
| 3   | ¿Cómo se ve?                     | Portada y sección "Así se ve"                         | `urlImage`, `gallery`                       |
| 4   | ¿Qué problema resolvió?          | "El problema"                                         | `problem`                                   |
| 5   | ¿Qué decidió y por qué?          | "Lo que decidí y por qué"                             | `decision`                                  |
| 6   | ¿Funcionó? ¿Cómo lo sé?          | Cifras destacadas y "El resultado"                    | `highlights`, `result`                      |
| 7   | ¿Qué incluyó el trabajo?         | "Qué incluyó"                                         | `scope`                                     |
| 8   | ¿Con qué tecnología?             | "Tecnologías" (al final: al cliente le importa menos) | `technologies`                              |
| 9   | ¿Puedo verlo en vivo?            | Botón "Ver proyecto"                                  | `url`                                       |
| 10  | ¿Cómo sigo?                      | Llamada a la acción: WhatsApp y formulario            | (fija)                                      |

## 2. Mínimos y recomendados por tipo de proyecto

| Elemento                       | Producto propio                 | Trabajo para un cliente                       | En desarrollo                                                     |
| ------------------------------ | ------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| Título y resumen               | obligatorio                     | obligatorio                                   | obligatorio                                                       |
| Portada                        | obligatorio                     | obligatorio                                   | visual de marca (sin mockups que aparenten un producto terminado) |
| Problema, decisión y resultado | obligatorio                     | obligatorio                                   | no (no tiene ficha)                                               |
| Rol, año y duración            | recomendado                     | **obligatorio**                               | no                                                                |
| Galería                        | mínimo 3                        | mínimo 4                                      | no                                                                |
| Cifras destacadas              | si existen y son verificables   | **muy recomendado** (con permiso del cliente) | no                                                                |
| Qué incluyó                    | opcional                        | recomendado                                   | no                                                                |
| Enlace                         | si es público                   | si el cliente lo permite                      | no                                                                |
| Testimonio                     | cuando exista uno real aprobado | idem                                          | no                                                                |

Los proyectos "en desarrollo" (`status: 'in-development'`) solo aparecen como tarjeta con la etiqueta
"En desarrollo"; no tienen ficha ni enlace hasta que haya contenido real.

## 3. Imágenes: medidas, formato y cantidad

Las imágenes de un proyecto se **suben desde el panel** (portada, imagen para redes y galería: JPEG, PNG o
WebP de hasta 5 MB, que la API guarda como WebP en el almacenamiento y el panel registra por su URL https) o,
para el respaldo del código, viven en `public/projects/<slug>/` y se referencian desde `constants/portfolio.ts`.
Las medidas de abajo valen para ambas; el almacenamiento reduce a 1920 px de lado mayor pero no recorta. Se usa siempre **WebP** (excepto la imagen para redes, que es JPG).

| Imagen                             | Archivo                         | Medida                | Formato           | Peso máx.      | Cantidad                                   |
| ---------------------------------- | ------------------------------- | --------------------- | ----------------- | -------------- | ------------------------------------------ |
| **Portada** (tarjeta y cabecera)   | `cover.webp`                    | **1280 × 720** (16:9) | WebP, calidad ~80 | **100 KB**     | 1                                          |
| **Imagen para redes** (Open Graph) | `og.jpg`                        | **1200 × 630**        | JPG, calidad ~80  | **100 KB**     | 1 (opcional; si falta se usa la del sitio) |
| **Galería**                        | `01-<descripcion>.webp`, `02-…` | **1600 × 900** (16:9) | WebP, calidad ~80 | **150 KB** c/u | **mínimo 3, ideal 4–6, máximo 8**          |

Reglas de composición:

- **Zona segura de la portada:** deja el logo y el sujeto principal dentro del 85 % central. En móvil se
  muestra completa (16:9); en tarjetas anchas de escritorio se recorta ~5 % arriba y abajo (16:10).
- **Galería con 4–6 imágenes, en este orden:**
  1. Pantalla principal o de entrada.
  2. El flujo clave del producto (lo que más valor da).
  3. Vista móvil / responsive (si aplica).
  4. Un detalle que muestre una decisión (p. ej. reportes, administración, formulario).
  5. _(opcional)_ Antes / después o diagrama simple de cómo funciona.
  6. _(opcional)_ Panel de gestión.
- **Capturas móviles verticales:** no se suben sueltas (la galería es 16:9 y se recortarían). Se componen
  2–3 en un lienzo de 1600 × 900, idealmente dentro de un marco de dispositivo.
- La **primera** imagen de la galería se muestra a ancho completo cuando hay 3, 5 o 7 imágenes (así las
  filas quedan completas); con 4, 6 u 8 todas tienen el mismo tamaño.
- **Nunca** subas datos reales de personas o clientes (nombres, correos, montos): difumina o usa datos de
  ejemplo creíbles.
- **Texto alternativo obligatorio** en cada imagen (`alt`: describe lo que se ve) y `caption`
  recomendado (una línea: qué muestra y por qué importa).
- **Nombres:** minúsculas, sin espacios ni tildes, con guiones (`01-resumen-mensual.webp`).
- **Ancho máximo absoluto de cualquier imagen del sitio:** 1920 px.

### Cómo optimizar una imagen

Con `sharp` (ya instalado como dependencia indirecta) o cualquier herramienta equivalente:

```js
import sharp from 'sharp'
await sharp('original.png')
  .resize({ width: 1600 })
  .webp({ quality: 80, effort: 6 })
  .toFile('public/projects/mi-proyecto/01-pantalla-principal.webp')
```

`tests/publicImages.test.mjs` falla si alguna imagen de `public/` supera 150 KB o 1920 px de ancho.

### Imagen de ejemplo (respaldo)

Si un proyecto no tiene portada o una ruta falla (archivo sin copiar, ruta mal escrita), la tarjeta, la
cabecera del detalle y la galería muestran un **placeholder de marca** (fondo azul marino con los
hexágonos del hero, proporción 16:9, sin texto) en lugar de una imagen rota; el layout no se mueve. Sirve
para publicar sin fotos y reemplazarlas después, pero no sustituye a las capturas reales: una portada de
ejemplo no vende el proyecto. Implementación: `ImageWithFallback` (molécula) + `ImagePlaceholder` (átomo).

## 4. Plantilla para completar un proyecto

```ts
{
  id: 'mi-proyecto',
  slug: 'mi-proyecto',
  type: 'client', // 'client' | 'product'
  portfolioType: 'Cliente',
  title: 'Nombre del proyecto',
  description: 'Una o dos frases: qué es y para quién.',
  role: 'Qué hice yo (p. ej. diseño y desarrollo completo)',
  year: '2026',
  duration: '6 semanas',
  problem: 'Qué problema tenía el cliente o el usuario.',
  decision: 'Qué decidí y por qué (en lenguaje de negocio, no solo técnico).',
  result: 'Qué cambió gracias al proyecto.',
  highlights: [{ value: '-40 %', label: 'tiempo de publicación' }], // solo si es verificable
  scope: ['Entregable 1', 'Entregable 2'],
  technologies: ['Nuxt', 'TypeScript'],
  urlImage: '/projects/mi-proyecto/cover.webp',
  ogImage: '/projects/mi-proyecto/og.jpg',
  gallery: [
    { src: '/projects/mi-proyecto/01-pantalla-principal.webp', alt: 'Qué se ve', caption: 'Qué muestra' }
  ],
  url: 'https://…' // solo si es público
}
```

Después de agregar un proyecto: añadir su contexto (`projectKind`, `sector`, `audience`) en
`PORTFOLIO_PROJECT_CONTEXT` y revisar la ficha en `npm run dev`.

## 5. Estado actual de los proyectos

### Mi Comodoro (producto propio, con ficha)

Tiene: portada y imagen para redes, problema, decisión, resultado y tecnologías.
**Falta** (datos que solo conoce el autor; no se inventan): rol, año, duración, estado/enlace público,
**3–6 capturas reales de la aplicación** (la portada actual es una imagen de presentación, no una
captura del producto), al menos una cifra verificable y, si aplica, qué incluyó.

### Mi Despensa (producto propio, en desarrollo)

Solo tarjeta con etiqueta "En desarrollo". No requiere imágenes hasta que exista un prototipo.
Cuando lo haya: portada de 1280 × 720 y 3 capturas del prototipo; se retira `status: 'in-development'`.

## Enlaces de la tarjeta

Cada tarjeta muestra "Ver detalle" (hacia la ficha, salvo en proyectos en desarrollo) y, si el proyecto tiene una URL https en su ficha, "Visitar sitio" (se abre en otra pestaña). La tarjeta completa es clicable hacia la ficha mediante el enlace "Ver detalle" extendido con `::after`; el enlace externo va por encima para no anidar enlaces. Las etiquetas viven en el cuerpo de la tarjeta, no sobre la imagen, y el recorte de la imagen se ancla arriba a la izquierda (logo y título suelen estar ahí).
