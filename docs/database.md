# Base de datos

Esquema PostgreSQL del panel `/admin`. Es SQL estándar (Postgres ≥ 13, sin extensiones ni funciones de Supabase) para poder ejecutarlo igual en el servidor propio, en Supabase o en cualquier otro Postgres.

## Desarrollo local

```bash
npm run db:up       # Postgres 17 en Docker, 127.0.0.1:5433 (usuario/clave de desarrollo: dev/dev)
npm run db:migrate  # aplica db/migrations/*.sql pendientes (tabla schema_migrations)
npm run db:reset    # borra el esquema y vuelve a migrar (solo desarrollo)
npm run db:seed     # carga .private/seed/*.sql (datos personales, fuera de git)
npm run db:down
```

`tests/dbSchema.test.mjs` valida restricciones y vistas contra ese contenedor (se omite si no está levantado; cada caso se revierte).

Cadena de conexión local: `postgres://dev:dev@127.0.0.1:5433/migueljalvarez`. En el servidor real se usan credenciales propias, nunca estas, y la base **no se expone a Internet** (solo la API la alcanza).

## Migraciones

| Archivo          | Contenido                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `0001_core.sql`  | clients, leads, lead_notes, testimonial_requests, projects, team_members, assignments, time_entries, trm_rates, payments, rates, policies, experiences |
| `0002_auth.sql`  | admin_users (hash de contraseña), admin_sessions (hash del token, vencimiento, revocación), login_attempts                                             |
| `0004_cv.sql`    | profile, skills, education, certifications, languages (+ kind/location en experiences): hechos del CV, privados                                        |
| `0003_views.sql` | project_hours, member_balances, assignment_hours                                                                                                       |

Las migraciones son de solo avance: un cambio nuevo es un archivo nuevo (`0004_...sql`), nunca se edita uno aplicado.

## Datos privados (seed)

El repositorio es público: las migraciones llevan solo estructura. Los hechos reales del CV (perfil, experiencia, habilidades, formación) viven en `.private/seed/cv.sql`, ignorado por git, y se cargan con `npm run db:seed` (idempotente). En producción se cargarán desde el panel `/admin` o con un respaldo propio, nunca desde el repositorio. El generador de CV solo selecciona y ordena estos hechos.

## Decisiones

- **USD siempre**: montos en `numeric`; cada pago guarda su `trm` (COP por USD del día) y `amount_cop` se calcula. `trm_rates` guarda el histórico diario.
- **Reglas en la base, no solo en la interfaz**: `CHECK`/FK repiten las reglas de Zod (`utils/admin/schemas.ts`): deadline ≥ inicio, horas ≤ 24, lead perdido con motivo, experiencia con fin o "actual", testimonio aprobado solo con respuesta y consentimiento.
- **Secretos como hash**: contraseñas (`password_hash`, argon2id/bcrypt), tokens de sesión y de enlace de testimonio (`token_hash` sha-256). El token real nunca se guarda. La IP de `login_attempts` se guarda como hash.
- **Consentimiento (Ley 1581)**: `leads.consent_at` y `consent_policy_version`.
- **Experiencia privada**: `experiences` es fuente de verdad para el futuro CV; nunca se expone por endpoints públicos.
- **Texto original intacto**: en testimonios, `answer` (cliente) no se modifica; lo publicado va en `published_text`.
- **Borrado**: un cliente con proyectos no se puede borrar (`RESTRICT`); borrar un lead borra sus notas; horas y pagos no se pierden al borrar colaboradores/proyectos (`RESTRICT`).

## Pendiente

- Row-level security no aplica con API propia (un solo rol de aplicación); si se usa Supabase habrá que añadir políticas RLS.
- Backups (`pg_dump` programado) y restauración probada en el servidor.
- API Nest/Nitro que sustituya la capa en memoria de `useAdminData` y contrato en `docs/openapi.yaml`.
