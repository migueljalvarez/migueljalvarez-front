---
name: ui-ux-principles
description: Principios de UI/UX y pixel perfect del proyecto, con valores concretos y cómo medirlos (escala de espaciado, tamaños de controles, radios, tipografía, contraste, jerarquía de pantallas, estados, formularios, responsive). Úsala al diseñar, implementar o revisar cualquier pantalla, sobre todo del panel /admin.
---

# Principios de UI/UX (panel y sitio)

Rol: especialista en UI/UX. **Nada se hace "por hacer".** Cada elemento responde a una pregunta: _¿qué decide, entiende o hace la persona aquí?_ Si no hay respuesta, no se añade. La identidad (`brand-identity`) no se rediseña: se **refina con reglas**.

## 0. Cómo se decide una medida

1. Sale de una **escala** (abajo). Un valor fuera de la escala se justifica en un comentario o no se usa.
2. Sin valores arbitrarios (`w-[13px]`, `mt-[7px]`) si existe una clase de la escala. Sí se aceptan los del sistema ya definido (`tracking-[0.14em]` del eyebrow, `shadow-[...]` de marca).
3. **Se mide, no se estima**: `getBoundingClientRect()` y `getComputedStyle()` en el navegador (ver sección 11).

## 1. Espaciado (base 4 px, ritmo de 8)

Solo estos valores de Tailwind: `1`(4) `1.5`(6) `2`(8) `3`(12) `4`(16) `5`(20) `6`(24) `8`(32) `10`(40) `12`(48) `16`(64).

- **Proximidad:** el espacio _dentro_ de un grupo es siempre menor que el espacio _entre_ grupos (relación ≥ 1,5×). Lo relacionado se ve junto.
- Etiqueta → control: **4 px** (`mb-1`). Control → ayuda/error: **4 px** (`mt-1`).
- Campo → campo en un formulario: **16 px** (`gap-4` / `space-y-4`). Grupo de campos → grupo: **24 px** (`gap-6`).
- Encabezado de página → contenido: **24 px** (`mb-6`). Migas → encabezado: **16 px** (`mb-4`).
- Relleno de página en el panel: **20 px** móvil / **32 px** `md` (`p-5 md:p-8`). Relleno interior de tarjeta/diálogo: **20 px** / **24 px** (`p-5 md:p-6`).
- Botones en una fila: **8 px** entre sí (`gap-2`). Filtros/píldoras: **8 px**.
- Objetivos táctiles contiguos: separación ≥ **8 px**.

## 2. Tamaño de controles

- **Alto táctil mínimo 44 px (`min-h-11`)** para botones, campos, selects, píldoras de filtro, ítems de menú y botones de icono (`min-w-11`).
- **Controles en la misma fila tienen la misma altura** (campo + botón = 44 px). Un campo `py-2.5` con `text-sm` mide ≈ 42 px: debe subirse a `min-h-11`.
- Iconos: **20 px** dentro de botones y menú, **22 px** en acciones de icono solas, **18 px** en enlaces de texto. Siempre `aria-hidden` si acompañan texto.
- Anchos: campo de búsqueda/filtro `sm:w-72` (288 px); diálogo `min(40rem, 100vw − 2rem)`; formulario de acceso `max-w-md` (448 px); lectura larga `max-w-2xl`/`max-w-prose` (60–75 caracteres por línea).

## 3. Radios (escala de 4 niveles)

| Nivel      | Clase                 | Uso                                                                   |
| ---------- | --------------------- | --------------------------------------------------------------------- |
| Control    | `rounded-lg` (8 px)   | botones, **campos**, selects, botones de icono (igual que la landing) |
| Elemento   | `rounded-xl` (12 px)  | ítems de navegación, tarjetas pequeñas anidadas, bloques de estado    |
| Contenedor | `rounded-2xl` (16 px) | tarjetas, paneles, diálogos, tablas                                   |
| Píldora    | `rounded-full`        | filtros, etiquetas de estado                                          |

Elementos adyacentes de la misma altura comparten radio. No mezclar niveles en un mismo componente sin motivo.

## 4. Tipografía

Poppins (títulos) / Inter (cuerpo). Escala del panel:

| Rol                      | Clases                                                        | Notas            |
| ------------------------ | ------------------------------------------------------------- | ---------------- |
| Título de página (h1)    | `text-2xl md:text-3xl font-semibold leading-tight`            | uno por pantalla |
| Título de sección (h2)   | `text-xl font-semibold`                                       |                  |
| Subtítulo / tarjeta (h3) | `text-lg font-semibold`                                       |                  |
| Cuerpo                   | `text-sm leading-6` (denso) · `text-base leading-7` (lectura) |                  |
| Etiqueta de campo        | `text-sm font-medium`                                         |                  |
| Ayuda / microtexto       | `text-xs` (12 px, **mínimo absoluto**)                        |                  |
| Eyebrow                  | `text-xs font-semibold uppercase tracking-[0.14em]`           | antes del h1     |
| Encabezado de tabla      | `text-xs font-semibold uppercase tracking-[0.08em]`           |                  |

Jerarquía por **tamaño + peso + color**, no por mayúsculas sueltas. Nunca menos de 12 px. Números alineados: `tabular-nums` en columnas de cifras/horas.

## 5. Color y contraste (WCAG AA)

- Solo tokens `brand-*`. El color computado debe coincidir con el token.
- **Texto normal ≥ 4,5:1; texto grande (≥ 18 px, o ≥ 14 px en negrita) y componentes de interfaz ≥ 3:1.** Calcúlalo (luminancia relativa) y deja la cifra en el reporte.
- `brand-muted` (#4d5868, ≈ 7:1 sobre blanco) para texto secundario. **`brand-helper` (#7e8897, ≈ 3,6:1) NO cumple AA para texto pequeño**: solo para placeholders y decoración; las ayudas y errores `text-xs` van en `brand-muted`/token de error.
- **El color nunca es el único portador de significado**: estado = texto + color (+ icono). Publicado / Borrador / Oculto / En desarrollo se leen sin ver el color.
- Semántica fija: éxito `brand-success-*`, aviso `brand-warning-*`, error `brand-danger-*`/`brand-error-*`. Un solo color de acento activo por pantalla (`brand-accent` primario).

## 6. Jerarquía y organización de una pantalla del panel

Anatomía, siempre en este orden: **(1)** migas → **(2)** `AdminPageHeader` (eyebrow, h1, descripción de una frase, acciones) → **(3)** barra de herramientas (búsqueda, filtros) → **(4)** resultado (tabla o tarjetas) → **(5)** estados.

- **Un solo botón primario por vista y por diálogo.** El resto secundario/fantasma. Las acciones destructivas (eliminar) van separadas del flujo principal, en `danger`, y **piden confirmación** que nombra lo que se elimina.
- Diálogos: título = acción (“Editar proyecto”), pie con acciones **a la derecha**, orden _secundario → primario_; en móvil apiladas a ancho completo con el primario arriba.
- Tablas: filas ≥ 44 px (`px-4 py-3`), primera columna = identificador (nombre + dato secundario en `text-xs text-brand-muted`), acciones a la derecha, `caption sr-only`, en móvil scroll horizontal controlado (`min-w-*`) **o** tarjetas bajo `md`; nunca desbordar el documento.
- Densidad: priorizar lo que se usa a diario; lo raro, detrás de un diálogo o detalle.
- Orden de lectura = orden visual = orden de foco con teclado.

## 7. Estados (todos, siempre)

1. **Cargando:** esqueleto que **reserva el alto final** (sin saltos de layout) y `aria-busy`. Sin spinner suelto en pantallas completas.
2. **Vacío:** qué es esto + por qué está vacío + **una acción** para crear el primero. Nunca una tabla en blanco.
3. **Error:** qué pasó en lenguaje llano + cómo reintentar (botón) + sin culpar a la persona. `role="alert"`.
4. **Éxito:** confirmación breve, **anunciada** (`aria-live="polite"`), que desaparece sola; nombra lo hecho (“Proyecto publicado”).
5. **Deshabilitado:** solo si es obvio por qué; si no, explícalo (texto de ayuda). Prefiere dejar el botón activo y mostrar el error al enviar.
6. **Sin API conectada / sin permiso:** mensaje explícito, nunca una pantalla muerta.
7. **Publicación visible:** Borrador, Publicado, Oculto o En desarrollo siempre con etiqueta de texto.

## 8. Formularios

- Etiquetas **siempre visibles** (el placeholder no sustituye a la etiqueta). Obligatorios con `*` (aria-hidden) y `required`.
- Validar **al enviar y al salir del campo**; mensaje específico y accionable (“Escribe un correo válido, p. ej. nombre@dominio.co”), junto al campo, `role="alert"`, y **foco al primer error**.
- Tipos y atributos correctos: `type=email`, `inputmode`, `autocomplete` (`email`, `current-password`, `one-time-code`), `maxlength` donde aplique. Enter envía.
- Código de verificación (TOTP): campo único, `inputmode="numeric"`, `autocomplete="one-time-code"`, 6 dígitos, texto grande y con `tabular-nums`; opción visible “Usar un código de recuperación”.
- Prevención de errores: confirmaciones en destructivo, avisar de cambios sin guardar, no perder lo escrito si falla el envío.
- Agrupa con `fieldset/legend` lo que va junto (p. ej. galería de imágenes).

## 9. Interacción y movimiento

- Foco visible **siempre**: `focus-visible:outline-2 outline-offset-2` en `brand-blue` sobre fondo claro y `brand-white` sobre oscuro. El hover nunca es el único indicador.
- Transiciones de color `duration-200`; sin animar layout; respetar `prefers-reduced-motion`.
- Feedback inmediato (< 100 ms) en la acción; si tarda > 1 s, estado de carga en el propio botón (“Guardando…”) sin cambiar su ancho.

## 10. Responsive

- Móvil primero. Puntos del tema: 360, 375, 411, `sm` 640, `md` 768, `lg` 1024, `laptop` 1366, `fullhd` 1920. Panel: barra lateral fija de 16 rem desde `lg`.
- **Nunca** scroll horizontal del documento (`scrollWidth ≤ innerWidth`). Texto largo con medida 60–75 caracteres.
- Verificar a **375, 768, 1024, 1440**.

## 11. Verificación pixel perfect (obligatoria)

En el navegador, por cada pantalla: (1) alturas de controles = 44 px y alineados en fila; (2) separaciones medidas contra la sección 1; (3) radios, tamaño y `line-height` de fuente contra las secciones 3–4; (4) colores computados = tokens; (5) contraste calculado para cada par texto/fondo nuevo; (6) captura antes/después en 375 y 1440; (7) sin avisos de Vue ni hidratación; (8) operable con teclado. **Reporta las medidas reales y las desviaciones que dejaste.**

## 12. Lo que no se hace

- Decoración, animaciones o componentes sin tarea de usuario.
- Cambiar la identidad (paleta, tipografía, hexágonos, solape deliberado del Contacto).
- Duplicar marcado: lo repetido se **componentiza** (Atomic Design, ver `atomic-design`).
- Nombres en español en archivos, componentes o rutas de API.
