/**
 * Estructura del panel privado /admin. Los módulos marcados `planned` aún no tienen datos reales:
 * se construyen cuando exista la base de datos (ver plan de trabajo en Notion).
 */
export type AdminNavGroup = 'overview' | 'content' | 'management'

export type AdminNavItem = {
  label: string
  to: string
  icon: string
  group: AdminNavGroup
  /** Frase corta de lo que hará el módulo. */
  summary: string
  /** Capacidades previstas (se muestran en la página mientras el módulo no existe). */
  planned: string[]
}

/** Encabezados del menú lateral, en orden. El grupo `overview` no lleva encabezado. */
export const ADMIN_NAV_GROUPS: { id: AdminNavGroup; label?: string }[] = [
  { id: 'overview' },
  { id: 'content', label: 'Contenido del sitio' },
  { id: 'management', label: 'Gestión' }
]

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: 'Resumen',
    to: '/admin',
    icon: 'mdi:view-dashboard-outline',
    group: 'overview',
    summary: 'Vista general de leads, proyectos y pagos pendientes.',
    planned: []
  },
  {
    label: 'Portafolio',
    to: '/admin/portfolio',
    icon: 'mdi:image-multiple-outline',
    group: 'content',
    summary:
      'Los proyectos del portafolio público: créalos, edítalos y publícalos sin tocar el código.',
    planned: []
  },
  {
    label: 'Redes sociales',
    to: '/admin/social-links',
    icon: 'mdi:share-variant-outline',
    group: 'content',
    summary: 'Los enlaces del encabezado y del contacto, en el orden que quieras.',
    planned: []
  },
  {
    label: 'Políticas',
    to: '/admin/policies',
    icon: 'mdi:file-document-edit-outline',
    group: 'content',
    summary: 'Tus acuerdos de trabajo: los públicos se muestran en Cómo trabajo.',
    planned: []
  },
  {
    label: 'Testimonios',
    to: '/admin/testimonials',
    icon: 'mdi:message-star-outline',
    group: 'content',
    summary: 'Solicita testimonios a clientes reales y apruébalos antes de publicarlos.',
    planned: [
      'Solicitud por correo con enlace único y vencimiento',
      'Página pública para que el cliente deje su testimonio, foto y logo',
      'Aprobar, rechazar o editar (conservando el texto original)',
      'Publicar solo los aprobados en la web'
    ]
  },
  {
    label: 'Leads',
    to: '/admin/leads',
    icon: 'mdi:account-search-outline',
    group: 'management',
    summary: 'Posibles clientes que te escriben por el formulario o que agregas a mano.',
    planned: [
      'Captura automática desde el formulario de contacto',
      'Alta manual con origen (referido, LinkedIn, WhatsApp…)',
      'Pipeline: nuevo, contactado, reunión, propuesta, ganado o perdido',
      'Notas, historial y próxima acción con fecha',
      'Convertir un lead ganado en cliente y proyecto'
    ]
  },
  {
    label: 'Proyectos',
    to: '/admin/projects',
    icon: 'mdi:folder-outline',
    group: 'management',
    summary: 'Clientes y proyectos con presupuesto de horas y fecha límite aproximada.',
    planned: [
      'Clientes y proyectos con estado, tarifa en USD y deadline',
      'Horas presupuestadas frente a horas usadas',
      'Marcar proyectos como publicables en el portafolio',
      'Alertas de deadline cercano'
    ]
  },
  {
    label: 'Equipo y pagos',
    to: '/admin/team',
    icon: 'mdi:account-group-outline',
    group: 'management',
    summary: 'Colaboradores, horas pactadas y cuándo debes pagarles.',
    planned: [
      'Colaboradores con rol, responsabilidades y tarifa en USD',
      'Asignación a proyectos con horas pactadas',
      'Registro de horas y saldo por pagar',
      'Pagos con la TRM del día guardada'
    ]
  },
  {
    label: 'Tarifas',
    to: '/admin/rates',
    icon: 'mdi:cash-multiple',
    group: 'management',
    summary: 'El valor de tu hora por tipo de servicio, siempre en USD.',
    planned: [
      'Tarifas por tipo de servicio (siempre en USD)',
      'Decidir qué se muestra en público y qué es interno'
    ]
  },
  {
    label: 'Experiencia',
    to: '/admin/experience',
    icon: 'mdi:briefcase-outline',
    group: 'management',
    summary: 'Tu trayectoria como fuente de verdad privada (nunca pública).',
    planned: [
      'Empresas, roles, logros con métricas verificables y evidencias',
      'Base para generar un CV ATS por vacante sin inventar datos'
    ]
  }
]

/**
 * ¿Está conectada la API del panel? Mientras sea `false`, en producción el panel no permite guardar
 * cambios (solo en desarrollo, con datos de ejemplo en memoria). Pasa a `true` al conectar la API.
 */
export const ADMIN_API_CONNECTED = false

export const LEAD_STATUSES = [
  { value: 'nuevo', label: 'Nuevo', tone: 'blue' },
  { value: 'contactado', label: 'Contactado', tone: 'amber' },
  { value: 'reunion', label: 'Reunión', tone: 'violet' },
  { value: 'propuesta', label: 'Propuesta', tone: 'orange' },
  { value: 'ganado', label: 'Ganado', tone: 'green' },
  { value: 'perdido', label: 'Perdido', tone: 'gray' }
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]['value']
