/**
 * Modelo Evento - El backend mapeará a la tabla `veterinary_journeys`
 * Campos BD: id, name, journey_date, location, max_capacity, service_type, status
 */
export interface Evento {
  id?: string | number;
  titulo: string;          // → name en BD
  descripcion?: string;
  fecha: string;           // → journey_date en BD
  lugar: string;           // → location en BD
  organizador?: string;
  tipo: string;            // → service_type en BD
  estado?: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO'; // → status en BD
  participantes?: number;
  maxCapacidad?: number;   // → max_capacity en BD
  imagenUrl?: string;
}
