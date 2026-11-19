export type TestimonialRecord = {
  id: string
  status: 'enviada' | 'abierta' | 'respondida' | 'aprobada' | 'rechazada' | 'expirada'
  createdAt: string
}
