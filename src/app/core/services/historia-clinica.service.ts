import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HistoriaClinica } from '../models/historia-clinica';

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaService {
  private readonly apiUrl = `${environment.apiUrl}/historias-clinicas`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(this.apiUrl);
  }

  crear(h: HistoriaClinica): Observable<HistoriaClinica> {
    return this.http.post<HistoriaClinica>(this.apiUrl, h);
  }

  actualizar(id: number, h: HistoriaClinica): Observable<HistoriaClinica> {
    return this.http.put<HistoriaClinica>(`${this.apiUrl}/${id}`, h);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
