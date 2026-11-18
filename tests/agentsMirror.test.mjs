import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import test from 'node:test'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const walk = dir =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = join(dir, entry.name)
        return entry.isDirectory() ? walk(path) : [path]
      })
    : []

/** Mapa ruta-relativa → contenido (sin saltos de línea de Windows, para comparar de forma estable). */
const snapshot = base =>
  Object.fromEntries(
    walk(join(root, base)).map(file => [
      relative(join(root, base), file).split(sep).join('/'),
      readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
    ])
  )

for (const folder of ['agents', 'skills']) {
  test(`.agents/${folder} es idéntico a .claude/${folder}`, () => {
    assert.deepEqual(snapshot(`.agents/${folder}`), snapshot(`.claude/${folder}`))
  })
}

const frontmatter = text => /^---\n([\s\S]*?)\n---/.exec(text.replace(/\r\n/g, '\n'))?.[1] ?? ''

test('cada agente tiene name, description y solo referencia skills que existen', () => {
  const agents = snapshot('.claude/agents')
  const skills = new Set(
    Object.keys(snapshot('.claude/skills'))
      .filter(path => path.endsWith('/SKILL.md'))
      .map(path => path.split('/')[0])
  )
  assert.ok(Object.keys(agents).length > 0)

  for (const [file, text] of Object.entries(agents)) {
    const header = frontmatter(text)
    assert.match(header, /^name: [a-z-]+$/m, `${file}: falta name`)
    assert.match(header, /^description: .+/m, `${file}: falta description`)
    const referenced = [...header.matchAll(/^\s+- ([a-z-]+)$/gm)].map(match => match[1])
    for (const skill of referenced)
      assert.ok(skills.has(skill), `${file}: la skill "${skill}" no existe`)
  }
})

test('cada skill tiene SKILL.md con name y description', () => {
  for (const [file, text] of Object.entries(snapshot('.claude/skills'))) {
    if (!file.endsWith('/SKILL.md') || file.split('/').length !== 2) continue
    const header = frontmatter(text)
    assert.match(
      header,
      new RegExp(`^name: ${file.split('/')[0]}$`, 'm'),
      `${file}: name debe coincidir con la carpeta`
    )
    assert.match(header, /^description: .+/m, `${file}: falta description`)
  }
})
