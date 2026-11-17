import type { H3Event } from 'h3'

// IP del cliente para los límites de intentos. NO se usa X-Forwarded-For: cualquiera puede enviarlo
// falsificado y saltarse el límite. En Netlify la cabecera `x-nf-client-connection-ip` la fija la
// plataforma; en cualquier otro caso se usa la dirección del socket.
// TODO: al mover el backend a un servidor propio detrás de Nginx, leer la IP real desde la cabecera
// que fije ese proxy (y solo si la petición viene de él).
export const getClientIp = (event: H3Event): string =>
  getRequestHeader(event, 'x-nf-client-connection-ip') ||
  event.node.req.socket?.remoteAddress ||
  'desconocida'
