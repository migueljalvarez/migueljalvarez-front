export type AdminPage<T> = { items: T[]; total: number }

/** Carga todas las páginas respetando el máximo de 100 registros de la API. */
export const listAllAdminPages = async <T>(
  // eslint-disable-next-line no-unused-vars
  fetchPage: (query: { limit: number; offset: number }) => Promise<AdminPage<T>>
): Promise<T[]> => {
  const limit = 100
  const first = await fetchPage({ limit, offset: 0 })
  const pages = [first.items]
  let offset = first.items.length
  while (offset < first.total) {
    const page = await fetchPage({ limit, offset })
    pages.push(page.items)
    if (!page.items.length) break
    offset += page.items.length
  }
  return pages.flat()
}
