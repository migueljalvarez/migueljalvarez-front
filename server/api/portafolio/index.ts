import { PORTFOLIO_PROJECTS } from '~/constants/portfolio'

export default defineEventHandler(() =>
  PORTFOLIO_PROJECTS.slice().sort(
    (a, b) => Number(b.id === 'mi-comodoro') - Number(a.id === 'mi-comodoro')
  )
)
