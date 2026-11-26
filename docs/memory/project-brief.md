# Project brief: migueljalvarez.com

Contexto estable del negocio. Tareas, decisiones y bitácora viven en Notion (ver [AGENTS.md](../../AGENTS.md)). Archivo público: sin datos personales ni de clientes.

## Qué es

Sitio para captar clientes de Miguel Álvarez, desarrollador de software independiente en Medellín, Colombia. Ofrece desarrollo a la medida y consultoría técnica.

## Propuesta de valor

Antes de escribir código, entiende el problema: no todo lo que suena bien técnicamente es lo correcto para el negocio.

Compromisos que lo sostienen (fuente: `data/work.ts`):

- El código y los accesos son del cliente.
- Dice cuándo algo no conviene, aunque signifique construir menos.
- Acuerda el alcance antes de implementar y explica las decisiones importantes.
- Usa IA con transparencia y valida lo que produce.
- Trabaja directamente con el cliente y responde por el resultado.

## Servicios (fuente: `data/services.ts`)

| Situación del cliente                       | Qué se ofrece                                          |
| ------------------------------------------- | ------------------------------------------------------ |
| Tiene una idea o necesita construir algo    | MVP, página web, plataforma SaaS, software a la medida |
| Ya tiene algo y necesita que funcione mejor | Revisión de código, ordenar lo existente               |
| Necesita decidir antes de invertir          | Consultoría técnica                                    |

Servicios de entrada en `/como-cobro` (fuente: `data/pricing.ts`): sesión de consultoría, diagnóstico «¿Rehacer o mejorar?», revisión de código acotada y descubrimiento de proyecto. Los precios se gestionan en el panel, en USD; no escribirlos en el repositorio.

## Audiencia

- Emprendedores y equipos que validan una idea o construyen desde cero.
- Empresas y equipos con un sistema en marcha que frena su operación.
- Personas y organizaciones que evalúan una decisión técnica antes de invertir.

El sitio habla de clientes en Colombia y de trabajo remoto para LATAM.

## Portafolio

Solo productos propios y trabajos reales. Respaldo en `constants/portfolio.ts` (Mi Comodoro, Mi Despensa); lo publicado se gestiona en el panel.

## Proceso (fuente: `constants/common`)

Descubrimiento → planificación y arquitectura → diseño de experiencia → desarrollo e integración → pruebas → despliegue y evolución.

## Páginas

`/`, `/portafolio`, `/como-trabajo`, `/como-cobro`, `/guias/rehacer-o-mejorar-software`, `/privacidad`, `/terminos-y-condiciones`, `/testimonio/:token` y el panel `/admin`.
