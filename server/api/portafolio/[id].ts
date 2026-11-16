import { PORTFOLIO_PROJECTS } from '~/constants/portfolio'

export default defineEventHandler(event => {
  const portfolioId = getRouterParam(event, 'id')

  if (!portfolioId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing portfolio ID'
    })
  }

  const project = PORTFOLIO_PROJECTS.find(
    item => item.id === portfolioId || item.slug === portfolioId
  )

  // Los productos en desarrollo no tienen ficha de detalle pública.
  if (!project || project.status === 'in-development') {
    throw createError({
      statusCode: 404,
      statusMessage: `Portfolio item with ID '${portfolioId}' not found`
    })
  }

  return project
})
