import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Noticia } from '../models/noticia';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  private readonly apiUrl = `${environment.apiUrl}/noticias`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl);
  }

  obtenerPorId(id: string | number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
  }

  crear(noticia: Noticia): Observable<Noticia> {
    return this.http.post<Noticia>(this.apiUrl, noticia);
  }

  actualizar(id: string | number, noticia: Noticia): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.apiUrl}/${id}`, noticia);
  }

  eliminar(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
