# Guía de "Sobre mí": contenido e imágenes

La sección "Sobre mí" de la home se gestiona desde `/admin/about` (Contenido del sitio → Sobre mí) y
se guarda en la API. Si no hay nada publicado, o la API no responde, el sitio muestra el respaldo del
código (`ABOUT_FALLBACK` en `constants/common`, con `/ma.webp`).

## Qué se muestra (y en qué orden)

Encabezado (sobre-título y título) con divisor fino y, debajo, dos tarjetas lado a lado (texto 7/12, foto 5/12; apiladas en móvil):

1. Tarjeta de texto: cargo, frase de presentación y presentación, cifras (hasta 4, en una franja con divisores), "Cómo trabajo" y recuadro "Principio clave" (la cita).
2. Tarjeta de foto: carrusel (la primera cifra va como etiqueta sobre la foto), nombre y ubicación · modo de trabajo, y "Fuera del trabajo" con etiquetas de intereses.
3. Herramientas (hasta 12 etiquetas).
4. Cierre: texto de disponibilidad y botón (en el respaldo, el de la home y WhatsApp).

Cargo, frase, nombre e intereses (`role`, `tagline`, `name`, `interests`) hoy solo salen del respaldo del código; la API no los guarda, así que con contenido de la API esos bloques se omiten.

La marca a color (`only-brand-color.svg`) va como fondo decorativo muy tenue en la esquina superior
derecha de esta banda clara; no es contenido ni se edita desde el panel.

Todo bloque opcional se omite si está vacío. Para publicar hacen falta título, presentación y al
menos una imagen con texto alternativo.

## Imágenes

| Elemento   | Regla                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Carpeta    | `public/about/`                                                       |
| Ruta       | `/about/<slug>.webp` (minúsculas, números y guiones; también jpg/png) |
| Proporción | 4:3 (se recorta para encuadrar la parte alta)                         |
| Formato    | webp, ≤ 150 KB y ≤ 1920 px de ancho (`tests/publicImages.test.mjs`)   |
| Cantidad   | hasta 3 en la API (el carrusel admite 4)                              |
| Alt        | obligatorio (1–140 caracteres): describe lo que se ve                 |

- La primera (predeterminada) es la que se ve al cargar; el carrusel no avanza solo, con flechas, puntos y teclado (izquierda/derecha). Con una sola imagen no hay controles.
- El archivo debe existir en el sitio antes de registrar su ruta: el panel muestra una vista previa
  y avisa si no se encuentra.
- Nunca subas fotos con datos personales que no quieras públicas: el repositorio es público.
