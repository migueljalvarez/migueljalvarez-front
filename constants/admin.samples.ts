import type { LeadStatus } from './admin'

/**
 * DATOS DE EJEMPLO DEL PANEL — SOLO DESARROLLO.
 * Permiten ver cómo se comporta la interfaz antes de tener base de datos. Se activan únicamente con
 * `import.meta.dev` y no deben llegar a producción (ver tests/portfolioMocks.test.mjs). Los nombres,
 * correos y mensajes son inventados.
 */
export const USE_ADMIN_SAMPLES: boolean = import.meta.dev

export type SampleLead = {
  id: string
  name: string
  email: string
  subject: string
  origin: string
  status: LeadStatus
  date: string
  nextAction?: string
}

export const SAMPLE_LEADS: SampleLead[] = USE_ADMIN_SAMPLES
  ? [
      {
        id: 's1',
        name: 'Ana Ejemplo',
        email: 'ana@ejemplo.test',
        subject: 'Desarrollo',
        origin: 'Formulario',
        status: 'nuevo',
        date: '2026-11-16'
      },
      {
        id: 's2',
        name: 'Carlos Muestra',
        email: 'carlos@ejemplo.test',
        subject: 'Consulta',
        origin: 'WhatsApp',
        status: 'contactado',
        date: '2026-11-14',
        nextAction: 'Llamada el 20-nov'
      },
      {
        id: 's3',
        name: 'Laura Prueba',
        email: 'laura@ejemplo.test',
        subject: 'Oferta',
        origin: 'Referido',
        status: 'reunion',
        date: '2026-11-10',
        nextAction: 'Enviar resumen de la reunión'
      },
      {
        id: 's4',
        name: 'Tienda Demo S.A.S.',
        email: 'compras@demo.test',
        subject: 'Desarrollo',
        origin: 'Formulario',
        status: 'propuesta',
        date: '2026-11-05',
        nextAction: 'Seguimiento de la propuesta'
      },
      {
        id: 's5',
        name: 'Pedro Ficticio',
        email: 'pedro@ejemplo.test',
        subject: 'Soporte',
        origin: 'LinkedIn',
        status: 'ganado',
        date: '2026-10-28'
      },
      {
        id: 's6',
        name: 'Marta Inventada',
        email: 'marta@ejemplo.test',
        subject: 'Consulta',
        origin: 'Formulario',
        status: 'perdido',
        date: '2026-10-20'
      }
    ]
  : []
