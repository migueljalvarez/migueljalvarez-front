export default defineEventHandler(async event => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing portfolio slug' })
  }

  const items = await getPortfolioItems()
  const project = items.find(item => item.slug === slug || item.id === slug)

  // Los productos en desarrollo no tienen ficha de detalle pública.
  if (!project || project.status === 'in-development') {
    throw createError({
      statusCode: 404,
      statusMessage: `Portfolio item with slug '${slug}' not found`
    })
  }

  return project
})
