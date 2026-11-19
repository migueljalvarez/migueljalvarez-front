# Guía de "Sobre mí": contenido e imágenes

La sección "Sobre mí" de la home se gestiona desde `/admin/about` (Contenido del sitio → Sobre mí) y
se guarda en la API. Si no hay nada publicado, o la API no responde, el sitio muestra el respaldo del
código (`ABOUT_FALLBACK` en `constants/common`, con `/ma.webp`).

## Qué se muestra (y en qué orden)

1. Cabecera: sobre-título (eyebrow) y título.
2. Collage de 1 a 3 imágenes y, debajo, ubicación y modo de trabajo.
3. Presentación, cita y cifras (hasta 4).
4. "Cómo trabajo" y "Fuera del trabajo".
5. Herramientas (hasta 12 etiquetas).
6. Botón y texto de disponibilidad.

Todo bloque opcional se omite si está vacío. Para publicar hacen falta título, presentación y al
menos una imagen con texto alternativo.

## Imágenes

| Elemento   | Regla                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Carpeta    | `public/about/`                                                       |
| Ruta       | `/about/<slug>.webp` (minúsculas, números y guiones; también jpg/png) |
| Proporción | 4:5 vertical, recomendado 1200×1500                                   |
| Formato    | webp, ≤ 150 KB y ≤ 1920 px de ancho (`tests/publicImages.test.mjs`)   |
| Cantidad   | hasta 4 registradas; el sitio muestra las 3 primeras                  |
| Alt        | obligatorio (1–140 caracteres): describe lo que se ve                 |

- La primera (predeterminada) es la grande del collage; las otras dos van más pequeñas.
- Con una sola imagen se ve una tarjeta 4:5; con dos, dos filas; con tres, una grande y dos pequeñas.
- El archivo debe existir en el sitio antes de registrar su ruta: el panel muestra una vista previa
  y avisa si no se encuentra.
- Nunca subas fotos con datos personales que no quieras públicas: el repositorio es público.
