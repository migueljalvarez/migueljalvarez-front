/**
 * Auditoría de dependencias para el CI.
 *
 * Falla ante CUALQUIER hallazgo de severidad alta o crítica, salvo los avisos que estén aceptados de
 * forma explícita en `scripts/audit-allowlist.json` (con motivo y fecha de vencimiento). Un aviso
 * aceptado cuya fecha pasó vuelve a bloquear el CI, para obligar a revisarlo.
 *
 * Uso: node scripts/audit.mjs
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const BLOCKING = new Set(['high', 'critical'])

export const advisoryId = url => /GHSA-[a-z0-9-]+/i.exec(url ?? '')?.[0]

/** Avisos únicos (no las cadenas de dependencias que los arrastran) del informe de `npm audit --json`. */
export const collectAdvisories = report => {
  const advisories = new Map()
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via !== 'object') continue
      const id = advisoryId(via.url) ?? String(via.source)
      if (!advisories.has(id)) {
        advisories.set(id, {
          id,
          package: via.name,
          severity: via.severity,
          title: via.title,
          url: via.url
        })
      }
    }
  }
  return [...advisories.values()]
}

export const evaluate = (report, allowlist, now = new Date()) => {
  const accepted = []
  const blocking = []
  const expired = []
  const seen = new Set()

  for (const advisory of collectAdvisories(report)) {
    seen.add(advisory.id)
    if (!BLOCKING.has(advisory.severity)) continue
    const rule = allowlist.find(entry => entry.id === advisory.id)
    if (!rule) blocking.push(advisory)
    else if (new Date(rule.expires) < now) expired.push({ ...advisory, rule })
    else accepted.push({ ...advisory, rule })
  }

  // Excepciones que ya no hacen falta (el aviso desapareció): conviene retirarlas.
  const unused = allowlist.filter(entry => !seen.has(entry.id))
  return { accepted, blocking, expired, unused }
}

const run = () => {
  const allowlist = JSON.parse(
    readFileSync(new URL('./audit-allowlist.json', import.meta.url), 'utf8')
  )
  let output
  try {
    output = execSync('npm audit --json', { maxBuffer: 1e8, encoding: 'utf8' })
  } catch (error) {
    // `npm audit` sale con código 1 cuando hay hallazgos; el informe llega por stdout.
    output = error.stdout?.toString()
    if (!output) throw error
  }
  const { accepted, blocking, expired, unused } = evaluate(JSON.parse(output), allowlist)

  for (const item of accepted) {
    console.log(
      `ACEPTADO  ${item.id} ${item.package} (${item.severity}) hasta ${item.rule.expires}\n          ${item.rule.reason}`
    )
  }
  for (const item of unused)
    console.log(
      `AVISO     la excepción ${item.id} ya no aplica: retírala de scripts/audit-allowlist.json`
    )
  for (const item of expired) {
    console.error(
      `VENCIDO   ${item.id} ${item.package} (${item.severity}): la excepción venció el ${item.rule.expires}; revísala\n          ${item.url}`
    )
  }
  for (const item of blocking) {
    console.error(
      `BLOQUEA   ${item.id} ${item.package} (${item.severity}): ${item.title}\n          ${item.url}`
    )
  }

  if (blocking.length > 0 || expired.length > 0) {
    console.error('\nAuditoría fallida.')
    process.exit(1)
  }
  console.log('\nAuditoría correcta: sin hallazgos altos o críticos sin aceptar.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run()
