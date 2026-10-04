import Badge from '~/components/atoms/Badge/Badge.vue'
import type { PortafolioType } from '~/types/common'

const NOT_APPLY = 'N/A'
export const useTechnicalSheet = () => {
  const getTechnicalSheet = (data: PortafolioType) => {
    return [
      ['Nombre del Proyecto', data.title || NOT_APPLY],
      [
        'Tecnologías',
        data.technologies?.length
          ? {
              component: 'div', // Contenedor para múltiples Badges
              props: {
                class: 'flex flex-row gap-2',
                default: data.technologies.map(tech => ({
                  component: Badge,
                  props: { theme: 'info', value: tech }
                }))
              }
            }
          : NOT_APPLY
      ],
      ['Versión', data.version || NOT_APPLY],
      [
        'Enlace',
        data.url
          ? {
              component: 'a',
              props: {
                href: data.url,
                class: 'text-brand-accent hover:underline',
                target: '_blank',
                innerHTML: data.url
              }
            }
          : NOT_APPLY
      ],

      ['Problema Inicial', data.initialProblem || NOT_APPLY],
      ['Solución', data.solutionDetails || NOT_APPLY],
      [
        'Estado',
        data.status
          ? {
              component: markRaw(Badge),
              props: {
                class: 'inline-block text-xs',
                value: String(data.status),
                theme: 'success'
              }
            }
          : NOT_APPLY
      ]
    ]
  }
  return { getTechnicalSheet }
}
