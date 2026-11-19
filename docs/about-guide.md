# Guía de "Sobre mí": contenido e imágenes

La sección "Sobre mí" de la home se gestiona desde `/admin/about` (Contenido del sitio → Sobre mí) y
se guarda en la API. Si no hay nada publicado, o la API no responde, el sitio muestra el respaldo del
código (`ABOUT_FALLBACK` en `constants/common`, con `/ma.webp`).

## Qué se muestra (y en qué orden)

1. Junto a la foto (arriba, alineados): sobre-título, título, ubicación · modo de trabajo (con el pin) y presentación.
2. Cita y cifras (hasta 4, en una sola franja con separadores).
3. "Cómo trabajo" y "Fuera del trabajo" en una sola tarjeta de dos columnas.
4. Herramientas (hasta 12 etiquetas).
5. Cierre: texto de disponibilidad y botón (en el respaldo, el de la home y WhatsApp).

La marca a color (`only-brand-color.svg`) va como fondo decorativo muy tenue en la esquina superior
derecha de esta banda clara; no es contenido ni se edita desde el panel.

Todo bloque opcional se omite si está vacío. Para publicar hacen falta título, presentación y al
menos una imagen con texto alternativo.

## Imágenes

| Elemento   | Regla                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| Carpeta    | `public/about/`                                                         |
| Ruta       | `/about/<slug>.webp` (minúsculas, números y guiones; también jpg/png)   |
| Proporción | 4:5 vertical (1200×1500) o 4:3; se recorta para encuadrar la parte alta |
| Formato    | webp, ≤ 150 KB y ≤ 1920 px de ancho (`tests/publicImages.test.mjs`)     |
| Cantidad   | hasta 4 registradas; el sitio muestra las 3 primeras                    |
| Alt        | obligatorio (1–140 caracteres): describe lo que se ve                   |

- La primera (predeterminada) es la grande del collage; las otras dos van más pequeñas.
- Con una sola imagen se ve un recuadro que iguala el alto del texto (4:3 en móvil, cuadrado en escritorio); con dos, dos recuadros lado a lado; con tres, una grande y dos pequeñas debajo.
- El archivo debe existir en el sitio antes de registrar su ruta: el panel muestra una vista previa
  y avisa si no se encuentra.
- Nunca subas fotos con datos personales que no quieras públicas: el repositorio es público.
