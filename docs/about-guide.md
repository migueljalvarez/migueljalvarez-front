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

Cargo, frase, nombre e intereses (`role`, `tagline`, `name`, `interests`, máx. 6 etiquetas de 30 caracteres) se editan en el panel y los guarda la API (migración 0011); texto plano, sin `<` ni `>`. Si quedan vacíos, el bloque se omite: nunca se completan con el respaldo del código (que solo se usa cuando no hay nada publicado).

La marca a color (`only-brand-color.svg`) va como fondo decorativo muy tenue en la esquina superior
derecha de esta banda clara; no es contenido ni se edita desde el panel.

Todo bloque opcional se omite si está vacío. Para publicar hacen falta título y presentación, y al
menos una imagen con texto alternativo **o** un cargo/nombre. La API de hoy sigue exigiendo una imagen.

Sin fotos (o si la ruta falla) la tarjeta de foto se mantiene con la **imagen de ejemplo de marca**
(hexágonos sobre azul marino, 4:3, sin texto) solo si hay cargo o nombre; sin ninguno se omite y la
tarjeta de texto ocupa todo el ancho. Así se puede publicar sin fotos y añadirlas después desde el panel.

## Imágenes

| Elemento   | Regla                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Carpeta    | `public/about/`                                                       |
| Ruta       | `/about/<slug>.webp` (minúsculas, números y guiones; también jpg/png) |
| Proporción | 4:3 (se recorta para encuadrar la parte alta)                         |
| Formato    | webp, ≤ 150 KB y ≤ 1920 px de ancho (`tests/publicImages.test.mjs`)   |
| Cantidad   | de 1 a 4 (todas van al carrusel)                                      |
| Alt        | obligatorio (1–140 caracteres): describe lo que se ve                 |

- La primera (predeterminada) es la que se ve al cargar; el carrusel no avanza solo, con flechas, puntos y teclado (izquierda/derecha). Con una sola imagen no hay controles.
- El archivo debe existir en el sitio antes de registrar su ruta: el panel muestra una vista previa
  y avisa si no se encuentra.
- Nunca subas fotos con datos personales que no quieras públicas: el repositorio es público.
