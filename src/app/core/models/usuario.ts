/**
 * Modelo Usuario - Adaptado a la BD `usuarios` de veterinaria_db
 * Roles según BD: ADMIN, STUDENT, TEACHER, USER, VETERINARIAN
 */
export type UserRole = 'ADMIN' | 'STUDENT' | 'TEACHER' | 'USER' | 'VETERINARIAN';

export interface Usuario {
  id?: string; // UUID
  email: string;
  fullName: string;        // full_name en BD
  password?: string;
  role: UserRole;          // role en BD
  isActive: boolean;       // is_active en BD
  dni?: string;
  faculty?: string;
  professionalCard?: string; // professional_card en BD
  studentCode?: string;      // student_code en BD
  semester?: number;
  createdAt?: string;        // created_at en BD
}

/**
 * Etiquetas amigables para mostrar en UI (Español)
 */
export const RoleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  TEACHER: 'Docente',
  STUDENT: 'Estudiante',
  VETERINARIAN: 'Veterinario',
  USER: 'Asistente'
};

/**
 * Íconos para cada rol
 */
export const RoleIcons: Record<UserRole, string> = {
  ADMIN: 'admin_panel_settings',
  TEACHER: 'school',
  STUDENT: 'person',
  VETERINARIAN: 'medical_services',
  USER: 'badge'
};
