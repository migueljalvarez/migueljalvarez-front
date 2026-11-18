import type { LeadStatus } from '~/constants/admin'

export type LeadNote = { id: string; text: string; at: string }

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  origin: string
  status: LeadStatus
  message: string
  lostReason: string
  nextAction: string
  nextActionDate: string
  createdAt: string
  notes: LeadNote[]
}

export type TestimonialRequestStatus =
  'enviada' | 'abierta' | 'respondida' | 'aprobada' | 'rechazada' | 'expirada'

export type TestimonialRequest = {
  id: string
  clientName: string
  email: string
  projectName: string
  message: string
  status: TestimonialRequestStatus
  createdAt: string
  /** Texto enviado por el cliente (cuando responde). */
  answer?: string
}

export type Client = { id: string; name: string; email: string; company: string; notes: string }

export type Project = {
  id: string
  name: string
  clientId: string
  status: string
  rateUsd: number
  budgetHours: number
  startDate: string
  deadline: string
  publishable: boolean
}

export type Rate = { id: string; service: string; rateUsd: number; isPublic: boolean }

export type Experience = {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  achievements: string
  technologies: string
  evidence: string
}

export type AdminData = {
  leads: Lead[]
  testimonials: TestimonialRequest[]
  clients: Client[]
  projects: Project[]
  rates: Rate[]
  experiences: Experience[]
}
