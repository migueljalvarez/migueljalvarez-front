---
name: brand-identity
description: Identidad visual y de tono del sitio migueljalvarez.com (profesional sereno, consultivo y confiable): tokens brand-*, tipografía Poppins/Inter, motivo de hexágonos, bandas oscuras/claras, componentes y copy. Úsala al crear o revisar cualquier UI, texto visible o estilo del sitio.
---

# Identidad visual del proyecto

Sitio personal de Miguel Alvarez que **capta clientes**: transmite "antes de escribir código, entiendo el problema". Las mejoras son **refinamientos, no rediseños**. Fuentes de verdad: `assets/css/main.css` (tokens), `docs/brand-system.md` (escala tipográfica y contraste) y la sección "Identidad visual" de `AGENTS.md`.

## Tono y copy

- Español, tuteo y primera persona; cercano, orientado al negocio.
- Sin jerga técnica y sin tono de búsqueda de empleo. El sitio proyecta a un profesional que presta servicios.
- Estructura narrativa: hero (promesa + CTA + disponibilidad) → ¿en qué punto estás? → proceso → acuerdos de trabajo → portafolio → sobre mí → contacto.
- Nombres de archivos, componentes y tokens en inglés; solo el texto visible va en español.

## Paleta (tokens `brand-*`)

- **Protagonista:** azul marino profundo — `brand-navy` `#121e30`, `brand-mid` `#1c2f4c`, `brand-accent` `#243b62` (CTA principal y foco).
- **Superficies:** casi blancas para lectura — `brand-surface` `#f5f7fa`, `brand-surface-soft`, `brand-border`; tarjetas `brand-surface-card` (blanco).
- **Texto:** `brand-ink` (principal), `brand-muted` (secundario), `brand-helper` (auxiliar/placeholder).
- **`brand-blue` `#3f6bad`** (azul del logo): solo acentos puntuales (iconos, estado activo, hover). No para fondos grandes ni párrafos.
- **Ámbar `brand-warm` `#F5B544`** (solo sobre fondos oscuros y en botones; sobre claros los acentos son `logo-blue` y `brand`, y el marrón se eliminó de la paleta; excepción: la cita «Principio clave»): único acento cálido, puntual (eyebrows oscuros, marcador activo del proceso, checks oscuros). Nunca fondos grandes ni botones.
- **Verde:** solo estados y WhatsApp. Estados `success|warning|danger|error` con sus variantes `-bg/-text/-border`.
- Nunca colores hardcodeados ni paleta cruda de Tailwind si existe un token. Usa clases canónicas de Tailwind v4.

## Tipografía

- Poppins (`font-display`) para títulos: peso fuerte, tracking ajustado. Inter (`font-sans`) para cuerpo.
- **Eyebrow** (mayúsculas con tracking amplio) antes de cada título de sección.
- Escala de referencia: h1 48–64/700, h2 32–40/700, h3 24–30/600, cuerpo 16–18/400–500, secundario 14–16, labels 12–14/500–600, micro 12–13.
- Contraste: texto principal oscuro sobre fondo casi blanco; los grises de apoyo no pueden bajar de legibles.

## Motivo y composición

- **Hexágonos**: logo, fondo del hero, marcadores numerados 01–06 y placeholders de proyecto.
- **Bandas alternas:** oscuras (hero, proceso, contacto) y claras (servicios, portafolio, sobre mí).
- **Tarjetas** blancas con esquinas muy redondeadas y sombra suave (`brand-shadow-card`) sobre fondo claro; **paneles oscuros** con borde sutil (`brand-border-soft/strong`).
- **Botones:** primario (azul oscuro) y secundario (contorno). **Chips** pequeños para etiquetas. **Checks** para beneficios.
- **Contacto:** panel oscuro con formulario **solapado sobre el footer a propósito**. No "corregirlo".

## Fidelidad (pixel perfect)

- Medir contra la referencia: espaciados, radios, sombras, tamaños y estados exactos; sin valores "a ojo".
- Puntos de ruptura del tema: 360, 375, 411, 1366 (`laptop`), 1920 (`fullhd`) además de los estándar.
- Estados completos: hover, `focus-visible`, disabled, cargando, vacío y error.

## Accesibilidad

- Objetivos táctiles `min-h-11`; `focus-visible` visible; `aria-hidden` en iconos decorativos; imágenes con `alt`.
- Imágenes de `public/` en webp con `NuxtImg`; medidas y peso en `docs/portfolio-guide.md` (portada 1280×720 ≤100 KB, galería 1600×900 ≤150 KB, og 1200×630 jpg).

## Datos de ejemplo

Los mocks existen solo en desarrollo (`import.meta.dev`) y siempre con la marca "Datos de ejemplo". El portafolio público solo muestra productos propios y trabajos reales de clientes.
