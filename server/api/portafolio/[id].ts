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

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: `Portfolio item with ID '${portfolioId}' not found`
    })
  }

  return project
})
