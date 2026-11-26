---
name: session-compactor
description: Resume las decisiones y próximos pasos de la sesión en máximo 10 líneas y los guarda en Notion. Úsala al cerrar una sesión de trabajo.
---

# Cierre de sesión

La memoria vive en Notion (enlace en `AGENTS.md`). No crear bitácoras ni historiales en el repositorio.

## Pasos

1. Reunir solo lo que no se deduce del código ni de git: decisiones (con su porqué), bloqueos y próximos pasos.
2. Redactar como máximo 10 líneas.
3. Guardarlo en la tarjeta del backlog trabajada y actualizar su estado (`Hecho` o `Desplegado`). Si no hay tarjeta o no está claro dónde, preguntar antes de crear algo.
4. Si Notion no está disponible, entregar el resumen en el chat y avisar que no quedó guardado.

## Formato

```
AAAA-MM-DD · rama
Hecho: …
Decisiones: … (porque …)
Pendiente: …
Siguiente paso: …
```

## Reglas

- Solo lo verificado; si algo no se probó, decirlo.
- Sin secretos, datos personales ni de clientes.
- No copiar diffs, logs ni la conversación.
- Si no hubo decisiones ni cambios, no escribir nada.
