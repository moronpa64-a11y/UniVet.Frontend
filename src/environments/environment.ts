/**
 * Configuración para entorno de DESARROLLO LOCAL.
 *
 * Cambia `apiUrl` según donde corra tu backend:
 *
 * Spring Boot por defecto:    http://localhost:8080/api
 * Node.js / Express:          http://localhost:3000/api
 * Python FastAPI:             http://localhost:8000/api
 * PHP / Laravel:              http://localhost/api
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
