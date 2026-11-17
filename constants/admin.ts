/**
 * Estructura del panel privado /admin. Los módulos marcados `planned` aún no tienen datos reales:
 * se construyen cuando exista la base de datos (ver plan de trabajo en Notion).
 */
export type AdminNavItem = {
  label: string
  to: string
  icon: string
  /** Frase corta de lo que hará el módulo. */
  summary: string
  /** Capacidades previstas (se muestran en la página mientras el módulo no existe). */
  planned: string[]
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: 'Resumen',
    to: '/admin',
    icon: 'mdi:view-dashboard-outline',
    summary: 'Vista general de leads, proyectos y pagos pendientes.',
    planned: []
  },
  {
    label: 'Leads',
    to: '/admin/leads',
    icon: 'mdi:account-search-outline',
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
    label: 'Testimonios',
    to: '/admin/testimonios',
    icon: 'mdi:message-star-outline',
    summary: 'Solicita testimonios a clientes reales y apruébalos antes de publicarlos.',
    planned: [
      'Solicitud por correo con enlace único y vencimiento',
      'Página pública para que el cliente deje su testimonio, foto y logo',
      'Aprobar, rechazar o editar (conservando el texto original)',
      'Publicar solo los aprobados en la web'
    ]
  },
  {
    label: 'Proyectos',
    to: '/admin/proyectos',
    icon: 'mdi:folder-outline',
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
    to: '/admin/equipo',
    icon: 'mdi:account-group-outline',
    summary: 'Colaboradores, horas pactadas y cuándo debes pagarles.',
    planned: [
      'Colaboradores con rol, responsabilidades y tarifa en USD',
      'Asignación a proyectos con horas pactadas',
      'Registro de horas y saldo por pagar',
      'Pagos con la TRM del día guardada'
    ]
  },
  {
    label: 'Políticas y tarifas',
    to: '/admin/tarifas',
    icon: 'mdi:file-document-edit-outline',
    summary: 'Políticas de trabajo, preguntas frecuentes y valor de la hora.',
    planned: [
      'Editar los compromisos y preguntas frecuentes de "Cómo trabajo"',
      'Tarifas por tipo de servicio (siempre en USD)',
      'Decidir qué se muestra en público y qué es interno'
    ]
  },
  {
    label: 'Experiencia',
    to: '/admin/experiencia',
    icon: 'mdi:briefcase-outline',
    summary: 'Tu trayectoria como fuente de verdad privada (nunca pública).',
    planned: [
      'Empresas, roles, logros con métricas verificables y evidencias',
      'Base para generar un CV ATS por vacante sin inventar datos'
    ]
  }
]

export const LEAD_STATUSES = [
  { value: 'nuevo', label: 'Nuevo', tone: 'blue' },
  { value: 'contactado', label: 'Contactado', tone: 'amber' },
  { value: 'reunion', label: 'Reunión', tone: 'violet' },
  { value: 'propuesta', label: 'Propuesta', tone: 'orange' },
  { value: 'ganado', label: 'Ganado', tone: 'green' },
  { value: 'perdido', label: 'Perdido', tone: 'gray' }
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]['value']
