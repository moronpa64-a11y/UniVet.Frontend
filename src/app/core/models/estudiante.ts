/**
 * Modelo Estudiante - El backend mapeará a usuarios con role=STUDENT
 * Campos BD: full_name, email, dni, student_code, faculty, semester, is_active
 */
export interface Estudiante {
  id?: string;
  nombre: string;        // → full_name en BD
  email: string;
  telefono?: string;
  documento: string;     // → dni en BD
  programa: string;      // → faculty en BD
  codigoEstudiante?: string; // → student_code en BD
  semestre?: number;     // → semester en BD
  estado?: 'ACTIVO' | 'INACTIVO'; // → is_active en BD
  fechaIngreso?: string;
}
