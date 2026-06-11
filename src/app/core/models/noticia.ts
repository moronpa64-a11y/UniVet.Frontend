/**
 * Modelo Noticia - El backend mapeará a la tabla `news`
 * Campos BD: id, title, content, category, image_url, author, publish_date
 */
export interface Noticia {
  id?: string | number;
  titulo: string;           // → title en BD
  contenido: string;        // → content en BD
  categoria: string;        // → category en BD
  imagenUrl: string;        // → image_url en BD
  autor?: string;           // → author en BD
  fechaPublicacion?: string; // → publish_date en BD
}
