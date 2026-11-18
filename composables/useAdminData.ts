import { ADMIN_API_CONNECTED } from '~/constants/admin'
import { buildSampleData, USE_ADMIN_SAMPLES } from '~/constants/admin.samples'
import type {
  AdminData,
  Experience,
  Rate,
  TestimonialRequest,
  TestimonialRequestStatus
} from '~/types/admin'

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
const today = () => new Date().toISOString().slice(0, 10)

/**
 * Capa de datos en memoria de los módulos del panel que aún no hablan con la API (testimonios, tarifas,
 * experiencia). Leads, clientes, proyectos y equipo ya usan la API: `useAdminLeads`, `useAdminProjects`
 * y `useAdminTeam`.
 * HOY guarda en memoria (se pierde al recargar) y solo se puede escribir en
 * desarrollo con datos de ejemplo. Cuando exista la API, solo cambia el interior de estas funciones
 * (cada acción pasará a llamar a un endpoint documentado en docs/openapi.yaml); las pantallas no cambian.
 */
export const useAdminData = () => {
  const data = useState<AdminData>('admin-data', () => buildSampleData())

  /** ¿Se pueden guardar cambios? (en producción, solo cuando la API esté conectada). */
  const canWrite = USE_ADMIN_SAMPLES || ADMIN_API_CONNECTED
  const persistence: 'memoria' | 'api' | 'ninguna' = ADMIN_API_CONNECTED
    ? 'api'
    : USE_ADMIN_SAMPLES
      ? 'memoria'
      : 'ninguna'

  // --- Testimonios
  const addTestimonialRequest = (
    input: Pick<TestimonialRequest, 'clientName' | 'email' | 'projectName' | 'message'>
  ) => {
    const request: TestimonialRequest = {
      ...input,
      id: newId(),
      status: 'enviada',
      createdAt: today()
    }
    data.value.testimonials.unshift(request)
    return request
  }
  const setTestimonialStatus = (id: string, status: TestimonialRequestStatus) => {
    const item = data.value.testimonials.find(entry => entry.id === id)
    if (item) item.status = status
  }

  // --- Tarifas
  const addRate = (input: Omit<Rate, 'id'>) => {
    data.value.rates.push({ ...input, id: newId() })
  }
  const removeRate = (id: string) => {
    data.value.rates = data.value.rates.filter(item => item.id !== id)
  }

  // --- Experiencia
  const addExperience = (input: Omit<Experience, 'id'>) => {
    data.value.experiences.unshift({ ...input, id: newId() })
  }
  const removeExperience = (id: string) => {
    data.value.experiences = data.value.experiences.filter(item => item.id !== id)
  }

  return {
    data,
    canWrite,
    persistence,
    addTestimonialRequest,
    setTestimonialStatus,
    addRate,
    removeRate,
    addExperience,
    removeExperience
  }
}
