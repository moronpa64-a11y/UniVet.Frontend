/**
 * Modelo Docente - El backend mapeará a usuarios con role=TEACHER
 * Campos BD: full_name, email, dni, faculty, professional_card, is_active
 */
export interface Docente {
  id?: string;
  nombre: string;          // → full_name en BD
  email: string;
  telefono?: string;
  especialidad: string;    // → faculty en BD
  documento: string;       // → dni en BD
  tarjetaProfesional?: string; // → professional_card en BD
  estado?: 'ACTIVO' | 'INACTIVO'; // → is_active en BD
  fechaVinculacion?: string;
}
