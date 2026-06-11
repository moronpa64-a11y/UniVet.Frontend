import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Foro } from '../models/foro';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  private readonly apiUrl = `${environment.apiUrl}/foros`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Foro[]> {
    return this.http.get<Foro[]>(this.apiUrl);
  }

  obtenerPorId(id: string | number): Observable<Foro> {
    return this.http.get<Foro>(`${this.apiUrl}/${id}`);
  }

  crear(foro: Foro): Observable<Foro> {
    return this.http.post<Foro>(this.apiUrl, foro);
  }

  agregarRespuesta(id: string | number, respuesta: any): Observable<Foro> {
    return this.http.post<Foro>(`${this.apiUrl}/${id}/respuestas`, respuesta);
  }

  eliminar(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
