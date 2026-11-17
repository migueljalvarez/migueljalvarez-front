# Alcance del panel: qué es público y qué es privado

Decisiones del autor (nov-2026) que gobiernan la API y la base de datos.

## 1. Lo que se gestiona en el panel y aparece en el landing

| Contenido                        | Dónde se ve                                             | Tabla / vista pública                                        |
| -------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Redes sociales                   | Hero, contacto y pie                                    | `social_links` → `public_social_links`                       |
| Portafolio                       | `/portafolio`, destacados del home, fichas, sitemap, OG | `portfolio_entries` + `portfolio_media` → `public_portfolio` |
| Testimonios aprobados            | Sección de testimonios (solo si hay al menos uno)       | `testimonial_requests` → `public_testimonials`               |
| Políticas marcadas como públicas | `/como-trabajo` (acuerdos de trabajo)                   | `policies` → `public_policies`                               |

**Fuera del panel (decisión):** el copy del sitio (hero, servicios, sobre mí, disponibilidad) sigue en código (`constants/`, `data/`) porque es identidad de marca y pasa por revisión. Las **tarifas son privadas**: no se muestran en el sitio por ahora (`rates.is_public` queda disponible, sin consumidor).

Entrante: el formulario de contacto del landing crea leads (`POST /api/contact`).

## 2. Lo privado (solo el administrador)

Leads, notas y pipeline · clientes · proyectos (cliente, tarifa, horas, deadline) · equipo, horas, pagos, TRM y saldos · experiencia y CV (`profile`, `experiences`, `skills`, `education`, `certifications`, `languages`) · solicitudes de testimonio (tokens, respuestas sin aprobar) · usuarios, sesiones e intentos de acceso.

## 3. Reglas de separación

1. **Proyecto privado ≠ ficha pública.** `projects` nunca se publica; `portfolio_entries` es contenido público con su propio interruptor `is_published`. El vínculo `portfolio_entries.project_id` es opcional (los productos propios no lo tienen) y no se expone.
2. **La API pública lee solo vistas `public_*`.** Listan columnas permitidas; no hay `SELECT *` sobre tablas privadas en endpoints públicos. Los modelos de respuesta públicos son distintos de los internos.
3. **Dos superficies:** `/api/*` público (sin sesión, de solo lectura salvo el contacto) y `/api/admin/*` (sesión obligatoria, `no-store`). Ver `docs/openapi-panel.yaml`.
4. **Nada se publica por defecto.** Portafolio y testimonios nacen ocultos; publicar exige portada (portafolio) o consentimiento y respuesta (testimonio), validado en la base.
5. **Testimonios:** el texto original del cliente no se edita; lo publicado va en `published_text`. Se muestra el nombre, cargo, empresa y foto/logo solo con `consent_publish`.
6. **Portafolio real:** solo productos propios y trabajos de clientes (`kind` = `client` | `product`); no hay proyectos de práctica. Máximo 6 imágenes por proyecto, `alt` obligatorio.
7. **Actualización del landing:** lecturas públicas con caché corta (`swr`, minutos); al publicar en el panel el sitio lo refleja sin reconstruir.
8. **Imágenes:** se guardan en el servidor propio (no Supabase Storage) respetando `docs/portfolio-guide.md`.
9. **Datos personales:** el repositorio es público; el CV vive en `.private/seed/` y en la base, y nunca se sirve desde endpoints públicos.

## 4. Orden de construcción de la API

1. Autenticación propia (`admin_users`, `admin_sessions`, límites en `login_attempts`) en lugar de la sesión provisional.
2. Lectura pública desde vistas: portafolio, redes, políticas (después testimonios).
3. Módulos del panel: leads → clientes/proyectos → equipo y pagos → testimonios → portafolio y redes → políticas y tarifas → experiencia/CV.
4. Contacto: enviar el correo primero y guardar el lead con reintento y consentimiento.
5. Conectar `useAdminData` (`ADMIN_API_CONNECTED`) módulo por módulo.
