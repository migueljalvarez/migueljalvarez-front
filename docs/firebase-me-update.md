# Actualización manual del documento "me" en Firebase

No existe un seed script ni sincronizador para este documento en el proyecto actual. Si vas a editarlo directamente en la consola de Firebase, usa estos valores exactos.

## 1) Campo `jobDescription`

```text
Convierto ideas en sitios web, sistemas y MVPs que tu negocio puede sostener — no solo lanzar. Antes de escribir código, entiendo bien el problema que hay detrás.
```

## 2) Segundo párrafo de la sección "Sobre mí"

```text
Fui Microsoft Student Partner (MSP) para Microsoft de Venezuela durante mi época de estudiante, lo que me permitió aprender, liderar y compartir conocimientos con otros estudiantes y profesionales del sector.
```

## 3) Heading de la sección "Sobre mí"

```text
Un poco más sobre mí
```

## Ejemplo de documento `me`

```json
{
  "jobDescription": "Convierto ideas en sitios web, sistemas y MVPs que tu negocio puede sostener — no solo lanzar. Antes de escribir código, entiendo bien el problema que hay detrás.",
  "aboutText": {
    "secondParagraph": "Fui Microsoft Student Partner (MSP) para Microsoft de Venezuela durante mi época de estudiante, lo que me permitió aprender, liderar y compartir conocimientos con otros estudiantes y profesionales del sector.",
    "heading": "Un poco más sobre mí"
  }
}
```

> Si el documento `me` en Firestore usa campos planos en lugar de un objeto `aboutText`, pega el texto exacto en los campos correpondientes del documento. El contenido anterior es el valor literal que debe quedar publicado.
