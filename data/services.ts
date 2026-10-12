export type ServiceOffering = {
  id: string
  situacion: string
  titulo: string
  etiquetas: string[]
  paraQuien: string
  comoAyudo: string
  queRecibes: string
  fases: number[]
}

// Copy provisional hasta disponer del HTML de referencia.
export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: 'construir-una-idea',
    situacion: 'Tengo una idea o necesito construir algo',
    titulo: 'Una idea convertida en un producto que puedas operar.',
    etiquetas: ['MVP', 'Landing', 'SaaS', 'Software a la medida'],
    paraQuien:
      'Para emprendedores y equipos que necesitan validar una idea o construir una herramienta digital desde cero.',
    comoAyudo:
      'Analizo el problema, defino un alcance viable y desarrollo la solución con una base técnica preparada para evolucionar.',
    queRecibes:
      'Una solución funcional, una experiencia clara y una base de código documentada para seguir creciendo.',
    fases: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'mejorar-un-producto',
    situacion: 'Ya tengo algo y necesito que funcione mejor',
    titulo: 'Mejoras claras sobre lo que ya tienes, sin perder de vista el negocio.',
    etiquetas: ['Code review', 'Refactorización'],
    paraQuien:
      'Para empresas y equipos con un sistema en marcha que necesitan resolver problemas que frenan su operación o añadir capacidades.',
    comoAyudo:
      'Reviso el estado actual, identifico riesgos y oportunidades, y priorizo cambios que mejoren la estabilidad y el uso del producto.',
    queRecibes:
      'Hallazgos priorizados, decisiones técnicas explicadas y mejoras implementadas con pruebas acordes al alcance.',
    fases: [1, 2, 4, 5]
  },
  {
    id: 'decidir-antes-de-invertir',
    situacion: 'Necesito decidir bien antes de invertir',
    titulo: 'Claridad sobre el camino antes de comprometer tiempo y presupuesto.',
    etiquetas: ['Consultoría técnica'],
    paraQuien:
      'Para personas y organizaciones que necesitan evaluar una idea, una arquitectura o una decisión técnica importante.',
    comoAyudo:
      'Analizo objetivos, restricciones y alternativas para separar lo esencial de lo accesorio y entender los riesgos.',
    queRecibes:
      'Recomendaciones concretas, opciones comparadas y próximos pasos acordes a tus prioridades.',
    fases: [1, 2]
  }
]
