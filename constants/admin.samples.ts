import type { AdminData } from '~/types/admin'

/**
 * DATOS DE EJEMPLO DEL PANEL — SOLO DESARROLLO.
 * Permiten ver y probar la interfaz antes de tener API. Se activan únicamente con `import.meta.dev` y
 * no deben llegar a producción (ver tests/portfolioMocks.test.mjs). Nombres, correos y mensajes son
 * inventados.
 */
export const USE_ADMIN_SAMPLES: boolean = import.meta.dev

const empty = (): AdminData => ({
  leads: [],
  testimonials: [],
  clients: [],
  projects: [],
  rates: [],
  experiences: []
})

const lead = (
  id: string,
  name: string,
  email: string,
  subject: string,
  origin: string,
  status: AdminData['leads'][number]['status'],
  createdAt: string,
  extra: Partial<AdminData['leads'][number]> = {}
): AdminData['leads'][number] => ({
  id,
  name,
  email,
  phone: '',
  subject,
  origin,
  status,
  message: '',
  lostReason: '',
  nextAction: '',
  nextActionDate: '',
  createdAt,
  notes: [],
  ...extra
})

export const buildSampleData = (): AdminData => {
  if (!USE_ADMIN_SAMPLES) return empty()

  return {
    leads: [
      lead(
        'l1',
        'Ana Ejemplo',
        'ana@ejemplo.test',
        'desarrollo',
        'formulario',
        'nuevo',
        '2026-11-16',
        {
          message: 'Hola, necesito una web para mi negocio de repostería (mensaje de ejemplo).'
        }
      ),
      lead(
        'l2',
        'Carlos Muestra',
        'carlos@ejemplo.test',
        'consulta',
        'whatsapp',
        'contactado',
        '2026-11-14',
        {
          nextAction: 'Llamada de descubrimiento',
          nextActionDate: '2026-11-20',
          notes: [{ id: 'n1', text: 'Prefiere hablar por la tarde (ejemplo).', at: '2026-11-14' }]
        }
      ),
      lead(
        'l3',
        'Laura Prueba',
        'laura@ejemplo.test',
        'oferta',
        'referido',
        'reunion',
        '2026-11-10',
        {
          nextAction: 'Enviar resumen de la reunión',
          nextActionDate: '2026-11-18'
        }
      ),
      lead(
        'l4',
        'Tienda Demo S.A.S.',
        'compras@demo.test',
        'desarrollo',
        'formulario',
        'propuesta',
        '2026-11-05',
        {
          nextAction: 'Seguimiento de la propuesta',
          nextActionDate: '2026-11-19'
        }
      ),
      lead(
        'l5',
        'Pedro Ficticio',
        'pedro@ejemplo.test',
        'soporte',
        'linkedin',
        'ganado',
        '2026-10-28'
      ),
      lead(
        'l6',
        'Marta Inventada',
        'marta@ejemplo.test',
        'consulta',
        'formulario',
        'perdido',
        '2026-10-20',
        {
          lostReason: 'Presupuesto fuera de alcance (ejemplo)'
        }
      )
    ],
    testimonials: [
      {
        id: 't1',
        clientName: 'Cliente de Ejemplo',
        email: 'cliente@ejemplo.test',
        projectName: 'Proyecto de ejemplo',
        message: '',
        status: 'respondida',
        createdAt: '2026-11-10',
        answer: 'Trabajar con Miguel fue claro y ordenado (testimonio de ejemplo).'
      },
      {
        id: 't2',
        clientName: 'Otra Persona',
        email: 'otra@ejemplo.test',
        projectName: '',
        message: '',
        status: 'enviada',
        createdAt: '2026-11-15'
      }
    ],
    clients: [
      {
        id: 'c1',
        name: 'Tienda Demo S.A.S.',
        email: 'compras@demo.test',
        company: 'Tienda Demo',
        notes: ''
      },
      { id: 'c2', name: 'Pedro Ficticio', email: 'pedro@ejemplo.test', company: '', notes: '' }
    ],
    projects: [
      {
        id: 'p1',
        name: 'Tienda en línea (ejemplo)',
        clientId: 'c1',
        status: 'en-curso',
        rateUsd: 30,
        budgetHours: 80,
        startDate: '2026-10-15',
        deadline: '2026-12-10',
        publishable: false
      },
      {
        id: 'p2',
        name: 'Sitio informativo (ejemplo)',
        clientId: 'c2',
        status: 'planificado',
        rateUsd: 25,
        budgetHours: 40,
        startDate: '2026-12-01',
        deadline: '2027-01-15',
        publishable: true
      }
    ],
    rates: [
      { id: 'r1', service: 'Desarrollo web a la medida', rateUsd: 30, isPublic: false },
      { id: 'r2', service: 'Consultoría técnica', rateUsd: 40, isPublic: false }
    ],
    experiences: []
  }
}
