/** Contenido de la sección "Sobre mí" tal como lo consume el sitio (API o respaldo en el código). */
export type AboutImage = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type AboutStat = { value: string; label: string }

export type AboutContent = {
  eyebrow: string
  heading: string
  intro: string
  /** Cargo que se muestra sobre la presentación (p. ej. Desarrollador de software). */
  role?: string
  /** Frase de presentación destacada; la presentación (`intro`) va debajo como subtítulo. */
  tagline?: string
  /** Nombre que se muestra bajo la foto. */
  name?: string
  /** Intereses fuera del trabajo, como etiquetas. */
  interests?: string[]
  quote?: string
  howIWork?: string
  beyondWork?: string
  location?: string
  workMode?: string
  availability?: string
  stats: AboutStat[]
  tools: string[]
  cta?: { label: string; href: string }
  /** De 1 a 4: el carrusel nunca muestra más. La primera es la predeterminada. */
  images: AboutImage[]
}
