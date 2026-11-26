---
name: legal-habeas-data-co
description: Lista de comprobación legal en Colombia (Ley 1581, privacidad, términos y propiedad intelectual del código). Úsala al tocar formularios, datos personales o textos legales. No es asesoría legal.
---

# Cumplimiento en Colombia

Guía de revisión, no asesoría legal: lo dudoso lo confirma un abogado, y antes de cambiar un texto se verifica la norma vigente en una fuente oficial. Textos: `data/privacy.ts` y `data/terms.ts`. Si existe `.claude/legal.local.md`, consultarlo sin copiar nada de él al repositorio.

## Formularios (Ley 1581 de 2012)

- Autorización previa, expresa e informada: casilla sin marcar, con enlace a la política.
- Guardar prueba de la autorización con la versión de la política.
- Pedir solo los datos necesarios; evitar datos sensibles y de menores.
- Publicar un testimonio exige autorización específica y permitir retirarlo.
- Un formulario o dato nuevo obliga a revisar la política.

## Política de tratamiento (Decreto 1377 de 2013, compilado en el 1074 de 2015)

- Responsable y sus datos de contacto (la norma incluye teléfono: comprobarlo).
- Datos, finalidades, proveedores y envíos de datos fuera del país.
- Derechos: conocer, actualizar, rectificar, suprimir, revocar, pedir prueba y quejarse ante la SIC.
- Canal y plazos: consultas 10 días hábiles (prorrogables 5); reclamos 15 (prorrogables 8).
- Vigencia y conservación.

## Términos

- Quién opera, objeto, uso aceptable, responsabilidad, ley aplicable y fecha.
- Si se vende a consumidores desde el sitio, revisar el Estatuto del Consumidor (Ley 1480 de 2011).

## Propiedad intelectual del código

- Marco: Ley 23 de 1982 (el software se protege como obra) y sus reformas.
- La cesión de derechos patrimoniales debe constar por escrito (art. 183); los derechos morales no se ceden.
- Art. 183: sin plazo pactado, la cesión se limita a 5 años; sin territorio, al país donde se hace. Escribir ambos.
- Art. 20: en contratos de prestación de servicios hay presunción de cesión al encargante. Pactar la condición (p. ej. pago total) y las exclusiones.
- Cada contrato define qué se cede, cuándo (por ejemplo, al pago total) y qué queda fuera (herramientas previas y software open source).
- `data/work.ts`, `data/terms.ts` y los precios deben decir lo mismo.

## Al modificar textos

Actualizar `PRIVACY_UPDATED_AT` o `TERMS_UPDATED_AT`. Los datos del titular llegan por variables de entorno y nunca se escriben en el repositorio.
