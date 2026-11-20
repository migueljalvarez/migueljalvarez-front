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

Todo bloque opcional se omite si está vacío. Para publicar hacen falta solo título y presentación: las
imágenes son opcionales (la API ya no las exige).

Sin fotos (o si la ruta falla) la tarjeta de foto se mantiene con la **imagen de ejemplo de marca**
(hexágonos sobre azul marino, 16:10, sin texto) solo si hay cargo o nombre; sin ninguno se omite y la
tarjeta de texto ocupa todo el ancho. Así se puede publicar sin fotos y añadirlas después desde el panel.

## Imágenes

| Elemento   | Regla                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Carpeta    | `public/about/`                                                                                                              |
| Ruta       | `/about/<slug>.webp` (minúsculas, números y guiones; también jpg/png) **o** la URL https de una imagen subida desde el panel |
| Proporción | 16:10 (se recorta para encuadrar la parte alta)                                                                              |
| Formato    | webp, ≤ 150 KB y ≤ 1920 px de ancho (`tests/publicImages.test.mjs`)                                                          |
| Cantidad   | de 1 a 4 (todas van al carrusel)                                                                                             |
| Alt        | obligatorio (1–140 caracteres): describe lo que se ve                                                                        |

- La primera (predeterminada) es la que se ve al cargar; el carrusel no avanza solo, con flechas, puntos y teclado (izquierda/derecha). Con una sola imagen no hay controles.
- Lo más simple: **súbela desde el panel** (botón o arrastrar y soltar; JPEG, PNG o WebP de hasta 5 MB). La
  API la normaliza a WebP (lado mayor ≤ 1920 px), la guarda en el almacenamiento (R2) y el panel registra su
  URL. Al reemplazarla o quitarla, el archivo anterior se borra del almacenamiento solo después de guardar.
  Sin almacenamiento configurado en el servidor el panel avisa (503) y se puede pegar una ruta o URL a mano.
- Si prefieres un archivo del sitio, debe existir antes de registrar su ruta: el panel muestra una vista previa
  y avisa si no se encuentra.
- Nunca subas fotos con datos personales que no quieras públicas: el repositorio es público.
