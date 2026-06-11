/**
 * Modelo Foro - El backend mapeará a la tabla `forum_topics`
 * Campos BD: id, title, description, author_name, replies_count, created_at, faculty
 */
export interface Foro {
  id?: string | number;
  titulo: string;             // → title en BD
  contenido: string;          // → description en BD
  autor: string;              // → author_name en BD
  email?: string;
  fecha?: string;             // → created_at en BD
  respuestas: ForoRespuesta[]; // virtual (no en BD, se gestiona aparte)
  repliesCount?: number;      // → replies_count en BD
}

export interface ForoRespuesta {
  autor: string;
  contenido: string;
  fecha: string;
}
